import os
import json
import uuid
import io
from datetime import datetime
from jinja2 import Environment, FileSystemLoader
from xhtml2pdf import pisa
from dateutil.relativedelta import relativedelta

class InvoiceGenerator:
    def __init__(self, output_dir='invoices'):
        """
        Initialize the InvoiceGenerator with output directory
        
        Args:
            output_dir (str): Directory to save generated PDF invoices
        """
        self.env = Environment(loader=FileSystemLoader(os.path.join(os.path.dirname(__file__), 'templates')))
        self.output_dir = output_dir
        
        # Create output directory if it doesn't exist
        os.makedirs(self.output_dir, exist_ok=True)
    
    def generate_invoice_number(self):
        """Generate a unique invoice number"""
        return f"INV-{datetime.now().strftime('%Y%m%d')}-{str(uuid.uuid4())[:8].upper()}"
    
    def calculate_totals(self, items, tax_rate=15.0):
        """
        Calculate subtotal, tax, and total
        
        Args:
            items (list): List of items with price and quantity
            tax_rate (float): Tax rate in percentage
            
        Returns:
            dict: Dictionary containing subtotal, tax, and total
        """
        subtotal = sum(item['price'] * item['quantity'] for item in items)
        tax = subtotal * (tax_rate / 100)
        total = subtotal + tax
        
        return {
            'subtotal': round(subtotal, 2),
            'tax': round(tax, 2),
            'total': round(total, 2),
            'tax_rate': tax_rate
        }
    
    def generate_invoice(self, order_data, company_data, customer_data):
        """
        Generate an invoice PDF
        
        Args:
            order_data (dict): Order details including items
            company_data (dict): Company information
            customer_data (dict): Customer information
            
        Returns:
            str: Path to the generated PDF file
        """
        # Calculate invoice totals
        totals = self.calculate_totals(order_data['items'], company_data.get('tax_rate', 15.0))
        
        # Prepare context for template with all required variables
        context = {
            # Invoice metadata
            'invoice_number': self.generate_invoice_number(),
            'invoice_date': datetime.now().strftime('%B %d, %Y'),
            'due_date': (datetime.now() + relativedelta(days=30)).strftime('%B %d, %Y'),
            
            # Order data
            'order_data': order_data,
            'company_data': company_data,
            'customer_data': customer_data,
            
            # Items and totals
            'items': order_data.get('items', []),
            'subtotal': order_data.get('subtotal', 0),
            'tax': order_data.get('tax', 0),
            'shipping': order_data.get('shipping', 0),
            'total': order_data.get('total', 0),
            'tax_rate': company_data.get('tax_rate', 15.0),
            'notes': order_data.get('notes', ''),
            
            # Company information
            'company_name': company_data.get('name', ''),
            'company_address': company_data.get('address', ''),
            'company_city': company_data.get('city', ''),
            'company_zip': company_data.get('zip', ''),
            'company_country': company_data.get('country', ''),
            'company_email': company_data.get('email', ''),
            'company_phone': company_data.get('phone', ''),
            'company_website': company_data.get('website', ''),
            
            # Customer information
            'customer_name': customer_data.get('name', ''),
            'customer_address': customer_data.get('address', ''),
            'customer_city': customer_data.get('city', ''),
            'customer_zip': customer_data.get('zip', customer_data.get('postalCode', '')),
            'customer_country': customer_data.get('country', ''),
            'customer_email': customer_data.get('email', ''),
            'customer_phone': customer_data.get('phone', '')
        }
        
        # Render the template
        template = self.env.get_template('invoice_template.html')
        html_content = template.render(**context)
        
        # Generate PDF
        pdf_filename = f"invoice_{context['invoice_number']}.pdf".replace(" ", "_")
        pdf_path = os.path.join(self.output_dir, pdf_filename)
        
        # Create PDF from HTML
        with open(pdf_path, 'wb') as output_file:
            pisa_status = pisa.CreatePDF(
                html_content,
                dest=output_file,
                encoding='UTF-8'
            )
        
        # Check for errors
        if pisa_status.err:
            raise Exception(f'Error generating PDF: {pisa_status.err}')
        
        # Read the generated PDF and encode as base64
        with open(pdf_path, 'rb') as pdf_file:
            pdf_content = pdf_file.read()
        
        # Convert to base64 for JSON serialization
        import base64
        pdf_base64 = base64.b64encode(pdf_content).decode('utf-8')
        
        # Keep the PDF file for now (comment out the deletion for testing)
        # try:
        #     os.remove(pdf_path)
        # except Exception as e:
        #     print(f"Warning: Could not delete temporary file {pdf_path}: {e}")
        
        return {
            'pdf_path': pdf_path,
            'pdf_content': pdf_base64,
            'invoice_number': context['invoice_number'],
            'invoice_date': context['invoice_date'],
            'total': context['total']
        }

def main():
    # Example usage
    invoice_gen = InvoiceGenerator()
    
    # Example data
    company_data = {
        'name': 'Adventure Store',
        'address': '123 Adventure St',
        'city': 'Adventure City',
        'zip': '12345',
        'country': 'Adventureland',
        'email': 'billing@adventurestore.com',
        'phone': '+1 (555) 123-4567',
        'website': 'www.adventurestore.com',
        'tax_rate': 15.0
    }
    
    customer_data = {
        'name': 'John Doe',
        'address': '456 Customer Ave',
        'city': 'Customer City',
        'zip': '54321',
        'country': 'Customerland',
        'email': 'john.doe@example.com',
        'phone': '+1 (555) 987-6543'
    }
    
    order_data = {
        'items': [
            {'name': 'Adventure Gear', 'description': 'Premium quality adventure gear', 'quantity': 2, 'price': 99.99},
            {'name': 'Camping Tent', 'description': '4-person all-weather tent', 'quantity': 1, 'price': 199.99},
            {'name': 'Hiking Boots', 'description': 'Waterproof hiking boots', 'quantity': 1, 'price': 129.99}
        ],
        'notes': 'Thank you for your order!'
    }
    
    # Generate invoice
    result = invoice_gen.generate_invoice(order_data, company_data, customer_data)
    print(f"Invoice generated: {result['pdf_path']}")
    print(f"Invoice Number: {result['invoice_number']}")
    print(f"Total Amount: ${result['total']:.2f}")

if __name__ == "__main__":
    main()
