# Pink Posts Installations v3.1 - Video Walkthrough Script

**Duration:** ~8-10 minutes
**Purpose:** Walk client through all new features and changes

---

## INTRO (30 seconds)

**[Show: Homepage]**

> "Hey! I wanted to walk you through all the updates we've made to the Pink Posts platform in version 3.1. There's a lot of great new stuff here - better tax handling, promo codes, easier checkout, and some important terms updates. Let's dive in!"

---

## 1. SERVICE AREA EXPANSION (45 seconds)

**[Show: Contact page → /contact]**

> "First up - you're now serving Ohio! The contact page now shows your service areas organized by state."

**[Scroll to show both sections]**

> "We've got Kentucky counties here - Fayette, Scott, Woodford, and the others you were already serving. And now Ohio - Hamilton, Butler, Warren, and Clermont counties. So the greater Cincinnati area is covered."

**[Show: FAQ section]**

> "The FAQ has been updated too - it now mentions Lexington, Central Kentucky, Louisville, AND Cincinnati."

---

## 2. NAVIGATION UPDATES (30 seconds)

**[Show: Navbar on any page]**

> "Small but helpful change to the navigation - we've added direct links to Riders and Lockboxes right in the main menu."

**[Click through: Posts, Riders, Lockboxes, FAQ]**

> "So customers can quickly jump to learn about any of your services without hunting through pages."

---

## 3. STRIPE TAX INTEGRATION (1.5 minutes)

**[Show: Start a new order, get to the Review step]**

> "This is a big one - automatic tax calculation. Before, we were hardcoding 6% Kentucky tax for everyone. Now the system automatically calculates the correct tax based on the customer's property address."

**[Point to the tax line in order summary]**

> "See here where it says 'Sales Tax' with the percentage? That's being calculated in real-time by Stripe Tax. If this property was in Ohio, it would show Ohio's tax rate instead."

**[Show the loading spinner if visible]**

> "When the address changes, you'll see a little spinner while it recalculates. And if for some reason Stripe Tax isn't available, it falls back to 6% so orders can always go through."

> "This means you don't have to worry about tax compliance for different states - Stripe handles it automatically."

---

## 4. PROMO CODE SYSTEM (2 minutes)

### Customer View

**[Show: Review step of checkout]**

> "Customers can now use promo codes! Right here on the checkout page, there's a field to enter a code."

**[Type in a promo code if you have one set up, or just show the field]**

> "They type in the code, hit Apply, and if it's valid - boom - the discount shows up in green right in the order summary."

### Admin View

**[Navigate to: Admin → Settings, scroll to Promo Codes section]**

> "And here's where you manage promo codes. I added this right to your Settings page so everything's in one place."

**[Click "Add Code" button]**

> "To create a new code, click Add Code. You set the code name - it automatically uppercases it. Choose percentage or fixed dollar amount. Enter the value."

**[Show the form fields]**

> "You can add a description for your reference, set a maximum number of uses if you want to limit it, and set an expiration date."

**[Create a test code or show existing ones]**

> "Once created, you see all your codes in this table. You can see how many times each one has been used, when it expires, and whether it's active."

**[Show toggle and delete buttons]**

> "These buttons let you quickly activate or deactivate a code, or delete it entirely. If a code has been used on orders, it just gets deactivated instead of deleted so you keep the history."

---

## 5. PAYMENT METHOD ENTRY AT CHECKOUT (1 minute)

**[Show: Review step with no payment method, or describe the scenario]**

> "This was a pain point before - if a customer got all the way to checkout but didn't have a card on file, they had to leave, go add a card somewhere else, and come back. Now they can add a card right here."

**[Show the "Add Payment Method" button or describe it]**

> "If there's no card on file, they see a big 'Add Payment Method' button. Click it, a secure Stripe form pops up, they enter their card, and it's immediately saved and selected. No losing their order, no confusion."

> "And even if they already have a card, there's an 'Add Card' option if they want to use a different one."

---

## 6. ADMIN ORDER MANAGEMENT (1 minute)

**[Navigate to: Admin → Orders]**

> "You've got better tools for managing orders now. See this eye icon on each order?"

**[Click the eye icon on any order]**

> "This opens a full detail view - customer info, property details, all the line items with pricing."

**[Show the payment section if visible]**

> "And here's the big one - you can charge a customer's card directly from this page. Select their payment method, click Charge, and it processes right here. Great for if you need to collect payment after the fact."

---

## 7. TERMS AND CONDITIONS UPDATES (1 minute)

**[Navigate to: /terms]**

> "Important business updates on the Terms page. Scroll down..."

**[Scroll to Post Rental Terms section]**

> "Post Rental Terms - this makes clear that posts are your property and are rented. After 6 months, a $18 rental charge kicks in every 3 months until they request pickup. And it automatically charges the card on file."

**[Scroll to Lost/Stolen/Damaged section]**

> "And here's the replacement fee schedule for lost, stolen, or damaged items:
> - Posts: $100
> - Riders: $15
> - Brochure Box: $25
> - Lockbox: $25
>
> This is all spelled out clearly so customers know upfront."

---

## 8. EXPEDITE FEE UPDATE (15 seconds)

**[Show: Admin Settings or mention verbally]**

> "Quick pricing note - the expedite fee for same-day service is now $50, up from $25. That's reflected everywhere in the system."

---

## 9. EMAIL NOTIFICATIONS (45 seconds)

**[Navigate to: Admin → Settings → Email section]**

> "Let me show you the email setup. The system is configured to send automatic emails."

**[Point to the status indicators]**

> "When an order is placed and payment succeeds, two emails go out automatically:
> 1. The customer gets an order confirmation with all their details
> 2. You get a notification at your admin email with the order info"

**[Show the "Send Test Email" button]**

> "If you ever want to verify emails are working, hit this Test Email button and you'll get one at your admin address."

> "Note: If it says 'Not Configured' on your deployed site, let me know and I'll make sure the environment variables are set up on Railway."

---

## 10. RIDER OPTIONS DISPLAY (15 seconds)

**[Navigate to: /dashboard/rider-options or describe]**

> "Small visual improvement - the 'Under Contract' and 'Neighborhood Specialist' riders are now centered on the page instead of spread out horizontally. Just looks cleaner."

---

## WRAP UP (30 seconds)

**[Show: Homepage or any page]**

> "That's everything in v3.1! To recap the big stuff:
> - Ohio service area is live
> - Tax calculates automatically by state
> - Promo codes are ready to use
> - Customers can add cards during checkout
> - Terms are updated with rental and replacement fees
>
> Any questions, just let me know. Thanks!"

---

## NOTES FOR RECORDING

### Before Recording:
- [ ] Have a test order ready to show (don't submit it)
- [ ] Create at least one test promo code (e.g., TEST10 for 10% off)
- [ ] Make sure you're logged in as admin
- [ ] Have both the live site and admin panel ready in separate tabs

### Screen Recording Tips:
- Use 1920x1080 resolution
- Zoom browser to 100-125% for readability
- Move mouse smoothly, pause on important elements
- Record audio separately if possible for cleaner edit

### Timestamps for Chapters (if uploading to YouTube):
```
0:00 Intro
0:30 Service Area Expansion
1:15 Navigation Updates
1:45 Stripe Tax Integration
3:15 Promo Code System
5:15 Payment Method Entry
6:15 Admin Order Management
7:15 Terms and Conditions
8:15 Other Updates
8:45 Wrap Up
```
