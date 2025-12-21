const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs').promises;
const { promisify } = require('util');
const { compile } = require('handlebars');

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.example.com', // Replace with your SMTP host
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER || 'support@chasenorth.com',
        pass: process.env.SMTP_PASS
    }
});

// Compile email template
const compileTemplate = async (templateName, data) => {
    try {
        const templatePath = path.join(__dirname, '../templates', `${templateName}.html`);
        const source = await fs.readFile(templatePath, 'utf-8');
        const template = compile(source);
        return template(data);
    } catch (error) {
        console.error('Error compiling email template:', error);
        throw error;
    }
};

// Send email function
const sendReportConfirmation = async (toEmail, referenceNumber) => {
    try {
        // Compile the email template with the provided data
        const html = await compileTemplate('reportEmail', { referenceNumber });

        // Send mail with defined transport object
        const info = await transporter.sendMail({
            from: `"Adventure Store Support" <support@chasenorth.com>`, // Sender address
            to: toEmail, // List of receivers
            subject: 'Your Report Has Been Submitted - Reference #' + referenceNumber, // Subject line
            html, // HTML body
            text: `Your report has been submitted successfully.\n\nReference Number: ${referenceNumber}\n\nWe'll get back to you soon.` // Plain text version
        });

        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = {
    sendReportConfirmation
};
