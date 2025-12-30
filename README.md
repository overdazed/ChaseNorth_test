# ChaseNorth E-Commerce Website
#### Video Demo:  <URL HERE>

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

__________________________________________________________________________________

with pip install -r requirements.txt you can install all the required packages in /frontend/ and /backend/

In backend run node seeder.js to seed all the products and reset.

### Home: 

So the Website begins with a custom loading screen. You are greeted with a video hero and a Action Button that leads to
/collection/all page.

Scrolling further, a scolling text comes and reveals "ChaseNorth" and it's zoomed into dark or light point, depending on
the light or dark mode.

Then comes a Bento grid Layout which leads to the according collections when you click it.

Followed by a snipped of a Blog Post, Discover Weekly is following.
There when you hover you see a sneak peak, it's with intention that it's covered first, because it should sence a 
surprise effect. 

After that section a Explore New Arrivals section, it shows the last 10 items uploaded in the last 14 days.

A parralax effect is leading to best seller section.

In the Best Seller Section I can see the rating of the Best seller and can click and Add to Cart. 
I can also Like the Item.
Under the main picture I see the 8 last previously viewed items and can scroll back and forth.
In Product Details I can see the Product Information from the Database.

I also can Write a review. I can select rating which later get's updated with the bars.
I can upload images and instantly also remove them. The imaged get's uploaded to a "reviews" bucket in supabase.
After I wrote a review, I can Edit it. Upload or delete images and reset rating. 
I can also delete the Review and If I want to like another review an other user made, it is also possible.

In Newsletter, I can enter my email and then get greeted shortly after with a discount code.

In Footer are the Links to FAQ and other informational pages.
On the right side on the top there are social media links.
On the bottom left corner, there is a Bug Report Button, when someone finds a bug, they can report it.
When they click submit, they get an "Thank you for the help" and an email get's send with the previously visited site
and the discription.

On top right I can toggle between light and dark mode.

When I click the cart and check out, I get to the Checkout screen.
The fields are with patterns: 
- only letters in first name, last name, city
- the first letter is automatically uppercase
- Address must be street + number
- postalcode is 7 characters, because netherlands has this pattern: 1234 AB
- Phone should match the country

A dicount can be added and is automatically subtracted from the subtotal (example: SAVE20) (FREESHIPPING)

When I paid, I get redirected to the Order confirmation page, an invoice is automatically created in the background and
is stored in supabase.

When I click in "Account" I see all my orders and can click on it.
In the Order Details page, I see the statuses and can Download the invoice and report a problem when there is one.
Downloading Invoice will create an invoice pdf from html template with python.

Reporing a problem will send a email with the report with images.

In the Admin panel I can see the stats.
When I click on the "Users" Tab I can Add new users or delete and edit the existing ones.

In Product Tab I can Edit or delete the product.

In Order Management I can edit the Status of the orders and can mark them as delivered.

In Report Tab is a little Ticket System, I see all the Reports and Status, when I click on it I see the sender, problem,
images and can make notes and change Status.

When I click "Shop" I get back.

In collection I can sort the items and Filter based on Category, Gender, Material, Brand, Color, Size and Price.

In a collection midway I have Tinder-like swiping, which will land instantly in wishlist.

In Wishlist when I click the counter get's updated and the i