import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

// Create a test account using ethereal.email for development
const createTestAccount = async () => {
    return await nodemailer.createTestAccount();
};

// Configure the transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.ethereal.email',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER || 'ethereal.user@ethereal.email',
        pass: process.env.SMTP_PASS || 'etherealpass',
    },
});

// Contact form submission
router.post('/contact', async (req, res) => {
    try {
        const { name, email, subject, message, priority } = req.body;

        // Validate required fields
        if (!name || !email || !subject || !message) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Email options
        const mailOptions = {
            from: `"${name}" <${process.env.SMTP_FROM || email}>`,
            to: 'support@chasenorth.com',
            subject: `[Support Request: ${priority}] ${subject}`,
            text: `
                New support request from ${name} (${email}):
                
                Priority: ${priority}
                
                Message:
                ${message}
                
                ---
                This is an automated message from the support form.
            `,
            html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                    <h2>New Support Request</h2>
                    <p><strong>From:</strong> ${name} (${email})</p>
                    <p><strong>Priority:</strong> ${priority}</p>
                    <h3>Message:</h3>
                    <p style="white-space: pre-line;">${message}</p>
                    <hr>
                    <p style="font-size: 0.8em; color: #666;">
                        This is an automated message from the support form.
                    </p>
                </div>
            `
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        
        // For development, log the preview URL if using ethereal.email
        if (process.env.NODE_ENV !== 'production') {
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        }

        res.status(200).json({ 
            success: true, 
            message: 'Your message has been sent successfully!',
            messageId: info.messageId 
        });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to send message. Please try again later.',
            error: error.message 
        });
    }
});

export default router;
