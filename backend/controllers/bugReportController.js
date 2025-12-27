const nodemailer = require('nodemailer');
require('dotenv').config();

const sendBugReport = async (req, res) => {
    try {
        const { subject, description, email, pageUrl } = req.body;
        const attachments = req.files?.attachments || [];

        // Validate required fields
        if (!subject || !description || !email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide subject, description, and email'
            });
        }

        // Configure nodemailer transporter
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
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

        res.status(200).json({
            success: true,
            message: 'Bug report submitted successfully!',
            data: {
                reference: `BUG-${Date.now()}`,
                email: email
            }
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
