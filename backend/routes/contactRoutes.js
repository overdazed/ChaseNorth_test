const express = require('express');
const { body, validationResult } = require('express-validator');
const sendEmail = require('../utils/sendEmail');
const multer = require('multer');

const router = express.Router();

// Configure multer for file uploads
const upload = multer({ storage: multer.memoryStorage() });

// @route   POST /api/contact
// @desc    Handle contact form submission
// @access  Public
router.post(
    '/',
    upload.array('attachments'),
    async (req, res) => {
        console.log('Received contact form data:', req.body);
        console.log('Received files:', req.files);

        // Manual validation since express-validator doesn't work well with multipart form data
        const { name, email, subject, message, priority } = req.body;
        const attachments = req.files || [];
        
        console.log('Parsed form data:', { name, email, subject, message, priority });
        console.log('Attachments count:', attachments.length);
        console.log('Full req.body:', req.body);
        
        // Validate required fields manually
        const errors = [];
        if (!name || name.trim() === '') {
            errors.push({ msg: 'Name is required', param: 'name', location: 'body' });
        }
        if (!email || email.trim().length < 3) {
            errors.push({ msg: 'Please include a valid email', param: 'email', location: 'body' });
        }
        if (!subject || subject.trim() === '') {
            errors.push({ msg: 'Subject is required', param: 'subject', location: 'body' });
        }
        if (!message || message.trim() === '') {
            errors.push({ msg: 'Message is required', param: 'message', location: 'body' });
        }
        
        if (errors.length > 0) {
            console.error('Validation errors:', errors);
            console.error('Full request body:', req.body);
            console.error('Request files:', req.files);
            return res.status(400).json({
                message: 'Validation failed',
                errors: errors,
                receivedData: req.body,
                receivedFiles: req.files,
                debugInfo: {
                    hasName: !!name,
                    hasEmail: !!email,
                    hasSubject: !!subject,
                    hasMessage: !!message,
                    nameValue: name,
                    emailValue: email,
                    subjectValue: subject,
                    messageValue: message
                }
            });
        }

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
                    ${attachments.length > 0 ? '<h3>Attachments:</h3>' : ''}
                    ${attachments.map(file => `<p>${file.originalname}</p>`).join('')}
                `,
                attachments: attachments
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

