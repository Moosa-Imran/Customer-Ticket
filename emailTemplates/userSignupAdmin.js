module.exports = function userSignupAdmin(fullName, email, joinedAt) {
    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Romanain Workers!</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 20px;
        }
        .email-container {
            background-color: #ffffff;
            max-width: 600px;
            margin: 0 auto;
            border: 1px solid #dddddd;
            border-radius: 5px;
            overflow: hidden;
        }
        .header {
            background-color: #454547;
            padding: 20px;
            text-align: center;
            color: #ffffff;
        }
        .header img {
            max-width: 250px;
        }
        .content {
            padding: 20px;
            color: #333333;
        }
        .content h2 {
            color: #1a1a1d;
            font-size: 24px;
            margin-top: 0;
        }
        .welcome-message {
            font-size: 16px;
            color: #333333;
            margin: 20px 0;
        }
        .username {
            font-size: 20px;
            color: #3a4a8a;
            font-weight: bold;
            margin: 10px 0;
        }
        .footer {
            background-color: #f1f1f1;
            padding: 10px;
            text-align: center;
            font-size: 12px;
            color: #888888;
        }
        p a {
            color: #3a4a8a;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <img src="https://customer.romanianworkers.co.uk/img/logo.png" alt="Romanian Workers Logo">
            <h1>New Customer Signup Notification</h1>
        </div>
        <div class="content">
            <p class="username">Hello Admin,</p>
            <h2>A New Customer Has Signed Up!</h2>
            <p class="welcome-message">
                We are excited to inform you that a new customer has signed up on our website. Below are the details of the new customer:
            </p>
            <p>
                <strong>Full Name:</strong> ${fullName}<br>
                <strong>Email:</strong> ${email}<br>
                <strong>Joined At:</strong> ${joinedAt}
            </p>
            <p>Best regards,<br>— The Romanian Workers in UK Team</p>
        </div>
        <div class="footer"></div>
            <p>&copy; 2024 Romanian Workers in UK. All rights reserved. This is an automated message; please do not reply.</p>
        </div>
    </div>
</body>
</html>
    `;
};
