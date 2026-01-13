import os
import json
import base64
import uuid
import sys
from datetime import datetime
from jinja2 import Environment, FileSystemLoader
from xhtml2pdf import pisa
from dateutil.relativedelta import relativedelta
import traceback
import sys


class InvoiceGenerator:
    def __init__(self, output_dir='invoices'):
        self.env = Environment(loader=FileSystemLoader(os.path.join(os.path.dirname(__file__), 'templates')))
        self.output_dir = output_dir
        os.makedirs(self.output_dir, exist_ok=True)

    def generate_invoice_number(self):
        current_date = datetime.now()
        date_str = current_date.strftime('%Y%m%d')

        # Reset counter if it's a new day
        invoice_number = f"INV-{current_date}-{str(uuid.uuid4())[:8].upper()}"
        return invoice_number

    def format_date(self, value, format='%B %d, %Y'):
        if isinstance(value, str):
            try:
                value = datetime.fromisoformat(value.replace('Z', '+00:00'))
            except (ValueError, AttributeError):
                return value
        elif value is None:
            return 'N/A'
        return value.strftime(format)

    def generate_invoice(self, order, company_data):
            try:
                # Add format_date filter to the environment
                self.env.filters['format_date'] = self.format_date

                # Replace all print statements with sys.stderr.write()
                sys.stderr.write("=== Received data from Node.js ===\n")
                sys.stderr.write(f"Order data: {json.dumps(order, indent=2)}\n")
                sys.stderr.write(f"Company data: {json.dumps(company_data, indent=2)}\n")
                sys.stderr.write("================================\n")

                # Ensure order is a dictionary
                if not isinstance(order, dict):
                    order = order.to_dict() if hasattr(order, 'to_dict') else dict(order)

                # Ensure shipping address exists
                if 'shippingAddress' not in order:
                    order['shippingAddress'] = {}

#                 order['shippingAddress'] = {
#                     'firstName': order.get('shippingAddress', {}).get('firstName', '') or order.get('shippingAddress_firstName', ''),
#                     # 'firstName': order.get('shippingAddress', {}).get('firstName', '')
#                     'lastName': order.get('shippingAddress_lastName', ''),
#                     'address': order.get('shippingAddress_address', ''),
#                     'city': order.get('shippingAddress_city', ''),
#                     'postalCode': order.get('shippingAddress_postalCode', ''),
#                     'country': order.get('shippingAddress_country', '')
#                 }

                # Ensure all address fields exist with empty string as default
                order['shippingAddress'].update({
                    'firstName': order['shippingAddress'].get('firstName', '') or '',
                    'lastName': order['shippingAddress'].get('lastName', '') or '',
                    'address': order['shippingAddress'].get('address', '') or '',
                    'city': order['shippingAddress'].get('city', '') or '',
                    'postalCode': order['shippingAddress'].get('postalCode', '') or order['shippingAddress'].get('postal_code', ''),
                    'country': order['shippingAddress'].get('country', '') or ''
                })

                # Ensure orderItems exists
                if 'orderItems' not in order and 'items' in order:
                    order['orderItems'] = order['items']

                # Prepare context for template
                context = {
                    'order': {
                            **order,  # Spread all order fields
                            'total': order.get('totalPrice', 0)  # Add total field that the template expects
                        },
                    'company_name': company_data.get('name', ''),
                    'company_contact_name': company_data.get('contact_name', ''),
                    'company_vat': company_data.get('vat', ''),
                    'company_address': company_data.get('address', ''),
                    'company_city': company_data.get('city', ''),
                    'company_zip': company_data.get('zip', ''),
                    'company_country': company_data.get('country', ''),
                    'company_email': company_data.get('email', ''),
                    'company_phone': company_data.get('phone', ''),
                    'company_website': company_data.get('website', ''),
                    'invoice_number': order.get('invoiceNumber') or self.generate_invoice_number(),
                    'invoice_date': datetime.now().strftime('%B %d, %Y'),
                    'due_date': (datetime.now() + relativedelta(days=30)).strftime('%B %d, %Y'),
                    'total': order.get('totalPrice', 0)
                }

                # And later in the code:
                sys.stderr.write("=== Processed shipping address ===\n")
                sys.stderr.write(f"{json.dumps(order.get('shippingAddress', {}), indent=2)}\n")
                sys.stderr.write("================================\n")

                # Rest of the method remains the same...
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

                if pisa_status.err:
                    raise Exception(f'Error generating PDF: {pisa_status.err}')

                # Read the generated PDF and encode as base64
                with open(pdf_path, 'rb') as pdf_file:
                    pdf_content = pdf_file.read()

                # Clean up the PDF file
                try:
                    os.remove(pdf_path)
                except:
                    pass

                # Return result as a dictionary
                result = {
                    'pdf_content': base64.b64encode(pdf_content).decode('utf-8'),
                    'invoice_number': context['invoice_number'],
                    'invoice_date': context['invoice_date'],
                    'total': context['total']
                }

                return json.dumps(result)

            except Exception as e:
                return json.dumps({
                    'error': str(e),
                    'type': type(e).__name__,
                    'traceback': traceback.format_exc()
                })

                # Make sure the final output is the only thing printed to stdout
                print(json.dumps({
                    'pdf_content': base64.b64encode(pdf_content).decode('utf-8'),
                    'invoice_number': context['invoice_number'],
                    'invoice_date': context['invoice_date'],
                    'total': context['total']
                }))
#     def generate_invoice(self, order, company_data):
#         try:
#             # Add format_date filter to the environment
#             self.env.filters['format_date'] = self.format_date
#
#             # Ensure order has required fields
#             if not isinstance(order, dict):
#                 raise ValueError("Order must be a dictionary")
#
#             # Prepare order items
#             order_items = order.get('items', [])
#             if not order_items and 'orderItems' in order:
#                 order_items = order['orderItems']
#                 order['items'] = order_items
#
#             # Calculate totals if not provided
#             if 'totalPrice' not in order:
#                 subtotal = sum(item.get('price', 0) * item.get('quantity', 0) for item in order_items)
#                 tax_rate = company_data.get('tax_rate', 0) / 100
#                 tax = subtotal * tax_rate
#                 order['totalPrice'] = subtotal + tax
#
#             # Prepare context for template
#             context = {
#                 'order': order,
#                 'company_name': company_data.get('name', ''),
#                 'company_address': company_data.get('address', ''),
#                 'company_city': company_data.get('city', ''),
#                 'company_zip': company_data.get('zip', ''),
#                 'company_country': company_data.get('country', ''),
#                 'company_email': company_data.get('email', ''),
#                 'company_phone': company_data.get('phone', ''),
#                 'company_website': company_data.get('website', ''),
#                 'invoice_number': self.generate_invoice_number(),
#                 'invoice_date': datetime.now().strftime('%B %d, %Y'),
#                 'due_date': (datetime.now() + relativedelta(days=30)).strftime('%B %d, %Y'),
#                 'total': order.get('totalPrice', 0)
#             }
#
#             # Render the template
#             template = self.env.get_template('invoice_template.html')
#             html_content = template.render(**context)
#
#             # Generate PDF
#             pdf_filename = f"invoice_{context['invoice_number']}.pdf".replace(" ", "_")
#             pdf_path = os.path.join(self.output_dir, pdf_filename)
#
#             # Create PDF from HTML
#             with open(pdf_path, 'wb') as output_file:
#                 pisa_status = pisa.CreatePDF(
#                     html_content,
#                     dest=output_file,
#                     encoding='UTF-8'
#                 )
#
#             if pisa_status.err:
#                 raise Exception(f'Error generating PDF: {pisa_status.err}')
#
#             # Read the generated PDF and encode as base64
#             with open(pdf_path, 'rb') as pdf_file:
#                 pdf_content = pdf_file.read()
#
#             # Clean up the PDF file
#             try:
#                 os.remove(pdf_path)
#             except:
#                 pass
#
#             # Return result as a dictionary
#             result = {
#                 'pdf_content': base64.b64encode(pdf_content).decode('utf-8'),
#                 'invoice_number': context['invoice_number'],
#                 'invoice_date': context['invoice_date'],
#                 'total': context['total']
#             }
#
#             return json.dumps(result)
#
#         except Exception as e:
#             return json.dumps({
#                 'error': str(e),
#                 'type': type(e).__name__
#             })


def read_input_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception as e:
        return {
            'error': f'Failed to read input file: {str(e)}',
            'type': type(e).__name__
        }

def main():
    try:
        if len(sys.argv) > 1:
            try:
                # Read input from file
                input_file = sys.argv[1]
                if not os.path.exists(input_file):
                    raise FileNotFoundError(f"Input file not found: {input_file}")

                # Read and parse the input data
                data = read_input_file(input_file)
                if 'error' in data:
                    print(json.dumps(data))
                    sys.exit(1)

                order_data = data.get('order_data', {})
                company_data = data.get('company_data', {})

                # Create the invoice generator
                invoice_gen = InvoiceGenerator()

                # Generate the invoice and print the result
                result = invoice_gen.generate_invoice(order_data, company_data)
                print(result)

            except Exception as e:
                error_msg = {
                    'error': str(e),
                    'type': type(e).__name__
                }
                print(json.dumps(error_msg))
                sys.exit(1)
        else:
            # Test with sample data if no arguments provided
            invoice_gen = InvoiceGenerator()
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
            order = {
                '_id': 'test_' + str(uuid.uuid4()),
                'createdAt': datetime.now().isoformat(),
                'status': 'Processing',
                'paymentMethod': 'credit_card',
                'isPaid': True,
                'paidAt': datetime.now().isoformat(),
                'totalPrice': 429.97,
                'orderItems': [
                    {
                        'name': 'Test Item',
                        'price': 99.99,
                        'quantity': 2,
                        'size': 'M',
                        'color': 'Blue'
                    }
                ],
                'shippingAddress': {
                    'address': '123 Test St',
                    'city': 'Test City',
                    'postalCode': '12345',
                    'country': 'Testland'
                }
            }
            result = invoice_gen.generate_invoice(order, company_data)
            print(result)

    except Exception as e:
        print(json.dumps({
            'error': str(e),
            'type': type(e).__name__
        }))
        sys.exit(1)

if __name__ == "__main__":
    main()