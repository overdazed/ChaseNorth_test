import sys
import json
from pathlib import Path

# Add the invoice_generator directory to the Python path
sys.path.append(str(Path(__file__).parent))

from invoice_generator.invoice_generator import InvoiceGenerator

def test_invoice_generation():
    # Initialize the invoice generator
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
    print(f"Invoice generated successfully at: {result['pdf_path']}")
    print(f"Invoice Number: {result['invoice_number']}")
    print(f"Total Amount: ${result['total']:.2f}")

if __name__ == "__main__":
    test_invoice_generation()
