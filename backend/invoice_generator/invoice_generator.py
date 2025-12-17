def main():
    import json
    import sys

    if len(sys.argv) > 1:
        try:
            # Parse the input data
            data = json.loads(sys.argv[1])
            order_data = data.get('order_data', {})
            company_data = data.get('company_data', {})
            customer_data = data.get('customer_data', {})

            # Create the invoice generator
            invoice_gen = InvoiceGenerator()

            # Generate the invoice
            result = invoice_gen.generate_invoice(order_data, company_data)

            # Print the result as JSON
            print(json.dumps(result))
            return
        except Exception as e:
            print(f"Error: {str(e)}", file=sys.stderr)
            sys.exit(1)
    else:
        # Default test data if no arguments provided
        invoice_gen = InvoiceGenerator()

        # Example company data
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

        # Example order data
        order = {
            '_id': '5f8d7a6e4b5c4a3d2e1f0a9b',
            'createdAt': datetime.now().isoformat(),
            'status': 'Processing',
            'paymentMethod': 'credit_card',
            'isPaid': True,
            'paidAt': datetime.now().isoformat(),
            'totalPrice': 429.97,
            'orderItems': [
                {
                    'name': 'Adventure Gear',
                    'price': 99.99,
                    'quantity': 2,
                    'size': 'M',
                    'color': 'Blue'
                }
            ],
            'shippingAddress': {
                'address': '456 Customer Ave',
                'city': 'Customer City',
                'postalCode': '54321',
                'country': 'Customerland'
            }
        }

        # Generate invoice with test data
        result = invoice_gen.generate_invoice(order, company_data)
        print(json.dumps(result))

if __name__ == "__main__":
    main()

def generate_invoice(self, order, company_data):
    """
    Generate an invoice PDF from an Order model

    Args:
        order (dict): Order model data
        company_data (dict): Company information

    Returns:
        dict: Contains PDF path, base64 content, and invoice details
    """
    # Add format_date filter to the environment
    self.env.filters['format_date'] = self.format_date

    # Ensure order has required fields
    if not isinstance(order, dict):
        raise ValueError("Order must be a dictionary")

    # Prepare order items
    order_items = order.get('items', [])
    if not order_items and 'orderItems' in order:
        order_items = order['orderItems']
        order['items'] = order_items

    # Calculate totals if not provided
    if 'totalPrice' not in order:
        subtotal = sum(item.get('price', 0) * item.get('quantity', 0) for item in order_items)
        tax_rate = company_data.get('tax_rate', 0) / 100
        tax = subtotal * tax_rate
        order['totalPrice'] = subtotal + tax

    # Prepare context for template
    context = {
        # Pass the order object
        'order': order,

        # Company information - pass as individual variables
        'company_name': company_data.get('name', ''),
        'company_address': company_data.get('address', ''),
        'company_city': company_data.get('city', ''),
        'company_zip': company_data.get('zip', ''),
        'company_country': company_data.get('country', ''),
        'company_email': company_data.get('email', ''),
        'company_phone': company_data.get('phone', ''),
        'company_website': company_data.get('website', ''),

        # Invoice metadata
        'invoice_number': self.generate_invoice_number(),
        'invoice_date': datetime.now().strftime('%B %d, %Y'),
        'due_date': (datetime.now() + relativedelta(days=30)).strftime('%B %d, %Y'),

        # Add total to context
        'total': order.get('totalPrice', 0)
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
    pdf_base64 = base64.b64encode(pdf_content).decode('utf-8')

    # Return result
    result = {
        'pdf_path': pdf_path,
        'pdf_content': pdf_base64,
        'invoice_number': context['invoice_number'],
        'invoice_date': context['invoice_date'],
        'total': context['total']
    }

    return result