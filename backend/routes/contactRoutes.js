const express = require('express');
const { body, validationResult } = require('express-validator');
const sendEmail = require('../utils/sendEmail');

const router = express.Router();

// @route   POST /api/contact
// @desc    Handle contact form submission
// @access  Public
router.post(
    '/',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isLength({ min: 3 }).withMessage('Please include a valid email'),
        body('subject').notEmpty().withMessage('Subject is required'),
        body('message').notEmpty().withMessage('Message is required')
    ],
    async (req, res) => {
        console.log('Received contact form data:', req.body);
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.error('Validation errors:', errors.array());
            return res.status(400).json({ 
                message: 'Validation failed',
                errors: errors.array() 
            });
        }

        const { name, email, subject, message, priority } = req.body;

        try {
            // Prepare email options
            const emailOptions = {
                email: 'support@chasenorth.com',
                subject: `[${priority || 'No Priority'}] ${subject}`,
                message: `
                    You have received a new contact form submission:
                    
                    Name: ${name}
                    Email: ${email}
                    Priority: ${priority || 'Not specified'}
                    
                    Message:
                    ${message}`,
                html: `
                    <h2>New Contact Form Submission</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
                    <p><strong>Priority:</strong> ${priority || 'Not specified'}</p>
                    <h3>Message:</h3>
                    <p>${message.replace(/\n/g, '<br>')}</p>
                `
            };
            
            // Send email using the sendEmail utility
            await sendEmail(emailOptions);

            res.status(200).json({ message: 'Your message has been sent successfully!' });
        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ message: 'Error sending message. Please try again later.' });
        }
    }
);

module.exports = router;
