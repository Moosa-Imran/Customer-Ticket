const express = require('express');
const path = require('path');
const { ObjectId } = require('mongodb'); 
const nodemailer = require('nodemailer');;
const { v4: uuidv4 } = require('uuid')
const router = express.Router();
const dotenv = require('dotenv');

dotenv.config(); 


// Protected Route Middleware
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    } else {
        return res.redirect('/');
    }
}

// Create a transporter using Namecheap SMTP settings
const transporter = nodemailer.createTransport({
    host: "smtp.privateemail.com",
    port: 587, 
    secure: false, // Set to true if using port 465
    auth: {
        user: process.env.EMAIL, // Email from your .env file
        pass: process.env.PASSWORD // Password from your .env file
    }
});

// Route for Fetching User's Detials
router.get('/fetchUser', async (req, res) => {
    // Get the user ID from the session
    const userId = req.session.user ? req.session.user.id : null;
    const usersDb = req.app.locals.usersDb;

    try {
        // Check if the user ID exists
        if (!userId) {
            return res.status(401).json({ status: false, message: 'User not authenticated.' });
        }

        // Search for the user in the Customers collection
        const user = await usersDb.collection('Customers').findOne({ _id: new ObjectId(userId) });
        if (user) {
            // If user is found, send the user data along with status
            res.status(200).json({ status: true, user });
        } else {
            // If user does not exist, send status false
            res.status(404).json({ status: false, message: 'User not found.' });
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ status: false, message: 'Internal server error' });
    }
});

// Signup Route
router.post('/signup', async (req, res) => {
    const { fullName, email, password } = req.body;
    const usersDb = req.app.locals.usersDb;

    try {
        // Check if the email already exists
        const existingUser = await usersDb.collection('Customers').findOne({ email: email });
        if (existingUser) {
            return res.status(400).json({ status: 'email_exists', message: 'Email already in use.' });
        }

        // Check password length
        if (password.length < 6) {
            return res.status(400).json({ status: 'short_password', message: 'Password must be at least 6 characters long.' });
        }

        // Insert the new user into the database
        const newUser = {
            fullName: fullName,
            email: email,
            password: password, // You should hash the password in production (e.g., bcrypt)
            createdAt: new Date(),
        };

        const result = await usersDb.collection('Customers').insertOne(newUser);

        // Save user session
        req.session.user = {
            id: result.insertedId,
            username: fullName,
        };

        res.status(201).json({ status: 'success', message: 'Account created successfully!' });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const usersDb = req.app.locals.usersDb;

    try {
        // Search for the user by email
        const user = await usersDb.collection('Customers').findOne({ email: email });

        // If user is not found
        if (!user) {
            return res.status(401).json({ status: 'invalid', message: 'Invalid email.' });
        }

        // If password is incorrect
        if (user.password !== password) {
            return res.status(401).json({ status: 'incorrect', message: 'Incorrect password.' });
        }

        // If valid, store user session and create cookie
        req.session.user = {
            id: user._id,
        };

        // Send success response
        res.status(200).json({ status: 'success', message: 'Login successful!' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
});

// Route to handle ticket creation with conversation
router.post('/create-ticket', async (req, res) => {
    try {
        const { fullName, email, phoneNumber, address, serviceType, subService, description } = req.body;

        // Generate unique ticket number
        let ticketNo;
        let ticketExists = true;

        // Ensure the ticket number is unique
        while (ticketExists) {
            ticketNo = uuidv4().slice(0, 10); // Generate a unique 10-character ticket number
            // Check if the ticket number already exists in the database
            const existingTicket = await req.app.locals.ticketsDb.collection('All').findOne({ ticketNo });
            if (!existingTicket) {
                ticketExists = false; // Break the loop when the ticket number is unique
            }
        }

        // Prepare the conversation (with the customer's initial message)
        const conversation = [
            {
                sender: 'customer',
                message: description ,
                timestamp: new Date()
            }
        ];

        // Prepare the ticket data to be stored
        const ticketData = {
            ticketNo,
            fullName,
            email,
            phoneNumber,
            address,
            serviceType,
            subService,
            status: 'Open', // Default status
            createdAt: new Date(),
            createdBy: new ObjectId(req.session.user.id),
            conversation // Store the conversation
        };

        // Insert the ticket into the database
        await req.app.locals.ticketsDb.collection('All').insertOne(ticketData);

        // Send success response with ticket number
        res.json({ status: 'ok', ticketNo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Something went wrong, please try again later.' });
    }
});

// Route for sending messages in a ticket conversation
router.post('/ticket/:ticketNo/message', async (req, res) => {
    try {
        const { ticketNo } = req.params;
        const { sender, message } = req.body;
        
        const ticket = await req.app.locals.ticketsDb.collection('All').findOne({ ticketNo });

        if (!ticket) {
            return res.status(404).json({ status: 'error', message: 'Ticket not found' });
        }

        const newMessage = {
            sender,
            message,
            timestamp: new Date()
        };

        // Push the new message to the conversation array
        await req.app.locals.ticketsDb.collection('All').updateOne(
            { ticketNo },
            { status: 'Open' },
            { $push: { conversation: newMessage } }
        );

        res.json({ status: 'ok', message: 'Message sent' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Something went wrong' });
    }
});


// Route for Logout
router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ message: 'Logout failed. Please try again later.' });
        }
        res.clearCookie('connect.sid'); 
        res.status(200).json({ message: 'Logout successful!' });
    });
});


// Dashboard Route
router.get('/dashboard', isAuthenticated, async (req, res) => {
    try {
        // Get user ID from session
        const userId = req.session.user;
        const usersDb = req.app.locals.usersDb;
        const ticketsDb = req.app.locals.ticketsDb;
        const user = await usersDb.collection('Customers').findOne({ _id: new ObjectId(userId) });
        const tickets = await ticketsDb.collection('All').find({ createdBy: new ObjectId(userId) }).toArray();

        const ticketsData = {
            totalTickets: tickets.length,
            openTickets: tickets.filter(ticket => ticket.status === 'Open').length,
            resolvedTickets: tickets.filter(ticket => ticket.status === 'Resolved').length,
        tickets: tickets.map(ticket => ({
        serviceType: ticket.serviceType,
        createdAt: ticket.createdAt,
        status: ticket.status,
        ticketNo: ticket.ticketNo
        }))
        };

        // Render the dashboard with the updated data
        res.render('dashboard', { user, ticketsData });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/create-ticket', isAuthenticated, async (req, res) => {
    try {
        // Get user ID from session
        const userId = req.session.user;
        const usersDb = req.app.locals.usersDb;
        const user = await usersDb.collection('Customers').findOne({ _id: new ObjectId(userId) });

        // Render Create Ticket page with the updated data
        res.render('create-ticket', { user });
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

// Route to handle viewing a specific ticket
router.get('/ticket', async (req, res) => {
    try {
        const userId = req.session.user;
        const usersDb = req.app.locals.usersDb;
        const user = await usersDb.collection('Customers').findOne({ _id: new ObjectId(userId) });
        const { tid } = req.query; // Get the ticket number from the query string

        // Fetch the ticket from the database
        const ticket = await req.app.locals.ticketsDb.collection('All').findOne({ ticketNo: tid });

        if (!ticket) {
            return res.status(404).render('error', { message: 'Ticket not found' });
        }

        // Render the ticket details page and pass the ticket data
        res.render('ticket-details', { ticket, user });
    } catch (error) {
        console.error(error);
        res.status(500).render('error', { message: 'Something went wrong, please try again later.' });
    }
});



router.get('/settings', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'settings.html'));
});


module.exports = router;