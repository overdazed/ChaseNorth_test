const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs').promises;
const { promisify } = require('util');
const { compile } = require('handlebars');

console.log('SMTP Config:', {
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE,
    user: process.env.SYSTEM_EMAIL
});

// Create a transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port:  process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SYSTEM_EMAIL,
        pass: process.env.SYSTEM_PASS
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

        const isSupportEmail = emailData.isSupportEmail || false;
        const templateName = isSupportEmail ? 'supportReportEmail' : 'reportEmail';
        
        // Prepare template data
        const templateData = {
            referenceNumber: emailData.referenceNumber || 'N/A',
            orderId: emailData.orderId || 'N/A',
            problemType: emailData.problemType || 'Not specified',
            details: emailData.details || 'No additional details provided',
            desiredOutcome: emailData.desiredOutcome || 'Not specified',
            email: emailData.email || emailData.to,
            currentYear: new Date().getFullYear(),
            adminUrl: process.env.ADMIN_URL || 'https://admin.chasenorth.com'
        };

        // Add attachments info for support emails
        if (isSupportEmail && emailData.attachments) {
            templateData.attachments = emailData.attachments;
        }

        // Compile the appropriate email template
        const html = await compileTemplate(templateName, templateData);

        // Set email subject based on recipient
        let subject;
        if (isSupportEmail) {
            subject = `[Action Required] New Report #${emailData.referenceNumber} - ${emailData.problemType || 'Issue Reported'}`;
        } else {
            subject = `Your Report Has Been Submitted - Reference #${emailData.referenceNumber || 'Pending'}`;
        }

        // Prepare email options
        const mailOptions = {
            from: `"ChaseNorth Support" <${process.env.SYSTEM_EMAIL}>`,
            to: emailData.to,
            subject: subject,
            html: html,
            // Add text version for email clients that don't support HTML
            text: isSupportEmail 
                ? `New Report Submitted - Reference #${templateData.referenceNumber}
                   
                   Order ID: ${templateData.orderId}
                   Problem Type: ${templateData.problemType}
                   Details: ${templateData.details}
                   Desired Outcome: ${templateData.desiredOutcome}
                   Customer Email: ${templateData.email}
                   
                   View full report: ${templateData.adminUrl}/reports/${emailData.reportId || ''}
                   `
                : `Your report has been submitted successfully.
                   
                   Reference Number: ${templateData.referenceNumber}
                   Order ID: ${templateData.orderId}
                   Problem Type: ${templateData.problemType}
                   
                   We'll review your report and get back to you within 24 hours.`
        };

        // Send mail with defined transport object
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${emailData.to}: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

module.exports = {
    sendReportConfirmation
};
