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

I