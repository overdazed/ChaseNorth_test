const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const invoiceService = require('./invoiceService');

// Ensure invoices directory exists
const INVOICES_DIR = path.join(__dirname, '../invoices');

async function ensureInvoicesDir() {
  try {
    await fs.mkdir(INVOICES_DIR, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

async function saveInvoice(pdfBuffer, orderId) {
  await ensureInvoicesDir();
  const fileName = `invoice_${orderId}.pdf`;
  const filePath = path.join(INVOICES_DIR, fileName);
  
  try {
    await fs.writeFile(filePath, pdfBuffer);
    return filePath;
  } catch (error) {
    console.error('Error saving invoice:', error);
    throw new Error('Failed to save invoice');
  }
}

async function generateAndSaveInvoice(order, companyData, customerData) {
  try {
    const { pdfBuffer, invoiceNumber } = await invoiceService.generateInvoice(
      order,
      companyData,
      customerData
    );

    const savedPath = await saveInvoice(pdfBuffer, order.orderId);
    return {
      invoiceNumber,
      invoicePath: savedPath
    };
  } catch (error) {
    console.error('Error in generateAndSaveInvoice:', error);
    throw error;
  }
}

module.exports = {
  saveInvoice,
  generateAndSaveInvoice
};
