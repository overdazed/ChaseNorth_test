const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs').promises;
const { promisify } = require('util');
const { compile } = require('handlebars');

console.log('SMTP Config:', {
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE,
    user: process.env.SUPPORT_EMAIL
});

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port:  process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SUPPORT_EMAIL,
        pass: process.env.SUPPORT_PASS
    },
    debug: true, // Enable debug output
    logger: true // Log to console
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
const sendReportConfirmation = async (emailData) => {
    try {
        if (!emailData.to) {
            console.error('No recipient email provided');
            throw new Error('No recipient email provided');
        }

        // Compile the email template with the provided data
        const html = await compileTemplate('reportEmail', {
            referenceNumber: emailData.referenceNumber || 'N/A',
            orderId: emailData.orderId,
            problemType: emailData.problemType,
            details: emailData.details,
            desiredOutcome: emailData.desiredOutcome
        });

        // Send mail with defined transport object
        const info = await transporter.sendMail({
            from: '"ChaseNorth Support" <support@chasenorth.com>',
            to: emailData.to,
            subject: `Your Report Has Been Submitted - Reference #${emailData.referenceNumber || 'Pending'}`,
            html: html,
            text: `Your report has been submitted successfully.\n\nReference Number: ${emailData.referenceNumber || 'Pending'}\nOrder ID: ${emailData.orderId}\nProblem Type: ${emailData.problemType}\n\nWe'll get back to you soon.`
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
