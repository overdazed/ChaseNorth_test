const { exec } = require('child_process');
const path = require('path');
const { promisify } = require('util');
const fs = require('fs');
const os = require('os');
const { v4: uuidv4 } = require('uuid');

const execAsync = promisify(exec);
const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);

class InvoiceService {
    constructor() {
        this.pythonPath = process.env.PYTHON_PATH || 'py';
        this.scriptPath = path.join(__dirname, '../invoice_generator/invoice_generator.py');
    }

    // In invoiceService.js, update the generateInvoice method
    async generateInvoice(orderData, companyData, customerData, invoiceNumber = null) {
        const tempFile = path.join(os.tmpdir(), `invoice_${uuidv4()}.json`);

        try {
            // Prepare the data to send to Python script
            const data = {
                order_data: {
                    ...orderData,
                    invoiceNumber: invoiceNumber || orderData.invoiceNumber // Use provided invoiceNumber or fall back to orderData.invoiceNumber
                },
                company_data: companyData
            };

            // Rest of the method remains the same
            console.log('Sending order data to invoice generator:', JSON.stringify(data, null, 2));
            await writeFileAsync(tempFile, JSON.stringify(data), 'utf8');

            // Execute the Python script with the temp file path
            const command = `"${this.pythonPath}" "${this.scriptPath}" "${tempFile}"`;

            const { stdout, stderr } = await execAsync(command, {
                maxBuffer: 1024 * 1024 * 10, // 10MB buffer for larger PDFs
                encoding: 'utf8'
            });

            // Rest of the method remains the same
            if (stderr) {
                console.error('Python script stderr:', stderr);
                if (!stdout) {
                    throw new Error('Error generating invoice: ' + stderr);
                }
            }

            // Parse the response
            let result;
            try {
                result = JSON.parse(stdout.trim());
            } catch (parseError) {
                console.error('Failed to parse Python output:', stdout);
                throw new Error('Invalid JSON response from Python script');
            }

            if (result.error) {
                throw new Error(`Python error: ${result.error} (${result.type || 'Unknown'})`);
            }

            if (!result.pdf_content) {
                throw new Error('No PDF content received from generator');
            }

            return {
                pdfBuffer: Buffer.from(result.pdf_content, 'base64'),
                invoiceNumber: result.invoice_number || invoiceNumber || orderData.invoiceNumber,
                invoiceDate: result.invoice_date,
                total: result.total
            };
        } catch (error) {
            console.error('Error in generateInvoice:', error);
            throw new Error(`Failed to generate invoice: ${error.message}`);
        } finally {
            // Clean up the temporary file
            try {
                await unlinkAsync(tempFile);
            } catch (cleanupError) {
                console.error('Error cleaning up temporary file:', cleanupError);
            }
        }
    }
}

module.exports = new InvoiceService();