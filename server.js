// backend/server.js
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

// Body parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Serve static files (your HTML, CSS, JS files)
app.use(express.static(path.join(__dirname, '../')));

// Home route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Contact form submission route
app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;

    // Create a transporter object using SMTP transport (you can use Gmail, SendGrid, etc.)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'your-email@gmail.com', // Replace with your email
            pass: 'your-email-password',   // Replace with your email password (or app password if using Gmail)
        },
    });

    // Email options
    const mailOptions = {
        from: email,
        to: 'your-email@gmail.com',  // The email where you want to receive the messages
        subject: `Message from ${name}`,
        text: message,
        html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p>`,
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send('Error occurred while sending message.');
        } else {
            return res.status(200).send('Message sent successfully!');
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
