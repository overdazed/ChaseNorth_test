const { exec } = require('child_process');
const path = require('path');
const { promisify } = require('util');
const fs = require('fs');

const execAsync = promisify(exec);

class InvoiceService {
    constructor() {
        this.pythonPath = process.env.PYTHON_PATH || 'python';
        this.scriptPath = path.join(__dirname, '../invoice_generator/invoice_generator.py');
    }

    async generateInvoice(orderData, companyData) {
        try {
            // Prepare the data to send to Python script
            const data = JSON.stringify({
                order_data: orderData,
                company_data: companyData
            });

            // Execute the Python script
            const { stdout, stderr } = await execAsync(
                `"${this.pythonPath}" "${this.scriptPath}" '${data.replace(/'/g, "\\'")}'`,
                {
                    maxBuffer: 1024 * 1024 * 10, // 10MB buffer for larger PDFs
                    encoding: 'utf8'
                }
            );

            if (stderr) {
                console.error('Python script stderr:', stderr);
                if (!stdout) {
                    throw new Error('Error generating invoice: ' + stderr);
                }
            }

            try {
                // Parse the JSON response
                const result = JSON.parse(stdout.trim());

                // Check for error in response
                if (result.error) {
                    throw new Error(`Python error: ${result.error} (${result.type || 'Unknown'})`);
                }

                // Ensure we have the required fields
                if (!result.pdf_content) {
                    throw new Error('No PDF content received from generator');
                }

                return {
                    pdfBuffer: Buffer.from(result.pdf_content, 'base64'),
                    invoiceNumber: result.invoice_number,
                    invoiceDate: result.invoice_date,
                    total: result.total
                };
            } catch (error) {
                console.error('Failed to parse Python script output:', error);
                console.error('Raw output:', stdout);
                throw new Error('Invalid response from generator: ' + error.message);
            }
        } catch (error) {
            console.error('Error in generateInvoice:', error);
            throw new Error(`Failed to generate invoice: ${error.message}`);
        }
    }
}

module.exports = new InvoiceService();