# ChaseNorth E-Commerce Website
#### Video Demo:  https://youtu.be/8_QRJsE1tAY

## Why?
I wanted to start with an online store and since I was doing this course and
didn't wanted to use Shopify, I thought I'd make my own.

## What?
I created a website from an [tutorial video](https://invidious.nerdvpn.de/watch?v=hpgh2BTtac8) and
changed/added components which I got also from the internet, modified or build my own.

## How?
I used MongoDB, Express, React, Node.js, Tailwind CSS, Framer Motion, Redux Toolkit and Supabase to create the website.

## Future Plans?
I plan to add more features to the website:

- Chat Bot
- Automatic Email at Order with invoice

## Functions
cd frontend > npm run dev <br>
cd backend > npm run dev
______________________________________________________________________________________

with pip install -r requirements.txt you can install all the required packages in /frontend/ and /backend/

In backend run node seeder.js to seed all the products and reset.

The website opens with a custom loading screen, followed by a full-width video hero section.
A clear call-to-action button immediately leads users to the /collection/all page.

As the user scrolls, a scrolling text animation reveals the brand name “ChaseNorth,” zooming into either
a light or dark focal point depending on the active theme. Light and dark mode are fully supported and can be
toggled at any time from the top-right corner.

Next comes a bento-style grid layout. Each tile links directly to its corresponding product collection,
offering quick visual navigation.

Below that, a featured blog snippet introduces “Discover Weekly.” On hover, the content reveals a sneak peek.
The section is intentionally partially covered at first to create a sense of surprise and curiosity.

An “Explore New Arrivals” section follows, displaying the latest ten products uploaded within the past 14 days.

A parallax transition then leads into the Best Sellers section. Here, users can see product ratings, like items,
and add them directly to the cart. Beneath the main product image, the last eight previously viewed items are
displayed in a horizontally scrollable carousel.

On the product detail page, users can view all product information pulled directly from the database.
Reviews are fully interactive: users can write, edit, or delete their own reviews, select a rating that
dynamically updates rating bars, and upload or remove images instantly. Review images are stored in a dedicated
Supabase “reviews” bucket. Users can also like reviews written by others.

The newsletter section allows users to enter their email address and, shortly afterward, receive a discount code.

The footer contains links to FAQs and other informational pages. Social media links are placed at the top-right
of the site for visibility.

In the bottom-left corner, a bug report button allows users to report issues. Upon submission, they receive a
thank-you message, and an email is automatically sent containing the previously visited page and the bug description.

Clicking the cart icon leads to the checkout screen. All input fields are validated with strict patterns:

- First name, last name, and city accept letters only, with automatic capitalization of the first letter
- Address must include street name and number
- Postal code follows the Dutch format (1234 AB)
- Phone numbers are validated based on country

Discount codes (e.g. SAVE20, FREESHIPPING) can be applied and are automatically deducted from the subtotal.

After payment, users are redirected to an order confirmation page. An invoice is generated in the background
and stored in Supabase.

In the Account section, users can view all past orders and access detailed order pages. Each order shows its current
status, allows invoice download, and includes an option to report a problem. Invoices are generated as PDFs from
HTML templates using Python. Problem reports can include images and are sent via email.

The admin panel provides full system oversight. It includes:

- A dashboard with key statistics
- User management (add, edit, delete users)
- Product management (edit or delete products)
- Order management (update order status, mark orders as delivered)
- A report/ticket system showing all submitted reports, including sender details, descriptions, images,
  internal notes, and status updates

Clicking “Shop” returns the admin to the storefront.

Collection pages support sorting and filtering by category, gender, material, brand, color, size, and price.
Midway through collections, a Tinder-style swipe interaction allows users to instantly add items to their wishlist.
The New Badge is only visable on products when they are less than 14 days uploaded.

The wishlist updates in real time, including item count and content changes.

The system is not fully polished yet, but the core architecture and functionality are in place.
