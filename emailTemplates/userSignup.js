module.exports = function userSignup(fullName) {
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
            <h1>Welcome to Romanian Workers!</h1>
        </div>
        <div class="content">
            <p class="username">Dear ${fullName},</p>
            <h2>We’re Excited to Have You Onboard!</h2>
            <p class="welcome-message">
                Thank you for choosing Romanian Workers in UK! We are dedicated to providing you with top-notch legal services.
            </p>
            <p>
                Feel free to explore our platform, check out the legal services we offer, and get in touch with our team for any assistance. We are here to help you with all your legal needs.
            </p>
            <p>
                Visit our website and learn more about how we can assist you today!
            </p>
            <p>Best regards,<br>— The Romanian Workers in UK Team</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 Romanian Workers in UK. All rights reserved. This is an automated message; please do not reply.</p>
        </div>
    </div>
</body>
</html>
    `;
};
