require('dotenv').config();
const { sendReportConfirmation } = require('./services/emailService');

async function testEmail() {
    try {
        console.log('Sending test email...');
        await sendReportConfirmation('overdazed@tutanota.com', 'TEST-123456');
        console.log('Test email sent successfully!');
    } catch (error) {
        console.error('Error sending test email:', error);
    }
}

testEmail();