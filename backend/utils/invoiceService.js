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

    async generateInvoice(orderData, companyData, customerData) {
        try {
            // Prepare the data to send to Python script
            const data = JSON.stringify({
                order_data: orderData,
                company_data: companyData,
                customer_data: customerData
            });

            // Execute the Python script
            const { stdout, stderr } = await execAsync(
                `"${this.pythonPath}" "${this.scriptPath}" '${data.replace(/'/g, "\\'")}'`,
                { 
                    maxBuffer: 1024 * 1024 * 10, // 10MB buffer for larger PDFs
                    encoding: 'binary'  // Handle binary data properly
                }
            );

            if (stderr) {
                console.error('Python script stderr:', stderr);
                if (!stdout) {
                    throw new Error('Error generating invoice: ' + stderr);
                }
            }

            // The Python script saves the PDF to a file and prints the path
            const match = stdout.match(/Invoice generated: (.+\.pdf)/i);
            if (!match) {
                console.error('Could not find PDF path in output:', stdout);
                throw new Error('Failed to generate invoice: Invalid response from generator');
            }

            const pdfPath = match[1];
            try {
                // Read the generated PDF file
                const pdfBuffer = fs.readFileSync(pdfPath);
                
                // Extract invoice number from the path
                const invoiceNumberMatch = pdfPath.match(/invoice_(.+)\.pdf$/i);
                const invoiceNumber = invoiceNumberMatch ? invoiceNumberMatch[1] : `INV-${Date.now()}`;
                
                return {
                    pdfBuffer,
                    invoiceNumber,
                    invoiceDate: new Date().toISOString().split('T')[0],
                    total: orderData.total
                };
            } catch (error) {
                console.error('Error reading generated PDF:', error);
                throw new Error('Failed to read generated invoice: ' + error.message);
            }
        } catch (error) {
            console.error('Error in generateInvoice:', error);
            throw new Error(`Failed to generate invoice: ${error.message}`);
        }
    }
}

module.exports = new InvoiceService();
