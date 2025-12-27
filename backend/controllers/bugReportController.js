const nodemailer = require('nodemailer');
require('dotenv').config();

const sendBugReport = async (req, res) => {
    try {
        const { subject, description, email, pageUrl } = req.body;
        const attachments = req.files?.attachments || [];

        // Log incoming request for debugging
        console.log('Bug report request received:', {
            subject,
            email,
            pageUrl,
            fileCount: attachments.length
        });

        // Validate required fields
        if (!subject || !description || !email) {
            console.log('Missing required fields:', { subject, email, hasDescription: !!description });
            return res.status(400).json({
                success: false,
                message: 'Please provide subject, description, and email'
            });
        }

        // Check if required environment variables are set
        const requiredEnvVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_SECURE', 'SUPPORT_EMAIL', 'SUPPORT_PASS', 'SYSTEM_EMAIL'];
        const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

        if (missingVars.length > 0) {
            console.error('Missing required environment variables:', missingVars);
            return res.status(500).json({
                success: false,
                message: 'Server configuration error',
                error: 'Missing required environment variables'
            });
        }

        // Configure nodemailer transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT, 10),
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SUPPORT_EMAIL,
                pass: process.env.SUPPORT_PASS
            }
        });

        // Format attachments for email
        const emailAttachments = attachments.map(file => ({
            filename: file.originalname,
            content: file.buffer,
            contentType: file.mimetype
        }));

        // Email options
        const mailOptions = {
            from: `"ChaseNorth Support" <${process.env.SYSTEM_EMAIL}>`,
            to: 'support@chasenorth.com',
            replyTo: email,
            subject: `[Bug Report] ${subject}`,
            html: `
                <h2>New Bug Report</h2>
                <p><strong>From:</strong> ${email}</p>
                <p><strong>Page URL:</strong> ${pageUrl || 'Not specified'}</p>
                <h3>Description:</h3>
                <p>${description.replace(/\n/g, '<br>')}</p>
                <p><em>This is an automated message. Please do not reply directly to this email.</em></p>
            `,
            attachments: emailAttachments
        };

        // Send email
        await transporter.sendMail(mailOptions);
        console.log('Bug report email sent successfully');

        res.status(200).json({
            success: true,
            message: 'Bug report submitted successfully!',
            // data: {
            //     reference: `BUG-${Date.now()}`,
            //     email: email
            // }
        });

    } catch (error) {
        console.error('Error in sendBugReport:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit bug report',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

module.exports = {
    sendBugReport
};
