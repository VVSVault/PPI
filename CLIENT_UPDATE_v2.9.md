# Pink Posts Installations - Platform Update Summary

**Version:** 2.9.x
**Date:** February 2026

This document summarizes the recent updates made to the Pink Posts Installations platform, including new features, UI improvements, security enhancements, and payment integration.

---

## Table of Contents

1. [Branding Updates](#branding-updates)
2. [User Interface Updates](#user-interface-updates)
3. [Rider Options Updates](#rider-options-updates)
4. [New Pages](#new-pages)
5. [New Customer Features](#new-customer-features)
6. [Admin Improvements](#admin-improvements)
7. [Security Enhancements](#security-enhancements)
8. [Stripe Payment Integration](#stripe-payment-integration)
9. [Stripe Setup Instructions](#stripe-setup-instructions)

---

## Branding Updates

### Company Name
- Changed branding from "Pink Post" to "Pink Posts" throughout the entire platform
- Updated in:
  - Logo text display
  - Page titles and metadata
  - Email templates (order confirmation, password reset, installation complete)
  - Footer copyright
  - Sign-up page
  - Notifications
  - All terms and conditions references

---

## User Interface Updates

### New Logo & Branding
- Updated logo to the new vectored pink bird mascot throughout the application
- Logo appears in the favicon (browser tab icon), navigation bar, and dashboard sidebar
- Clicking the logo in the sidebar now returns users to the homepage

### Dashboard Sidebar Redesign
- Changed sidebar from dark pink to light pink (`bg-pink-50`) for better contrast with the new logo
- Improved text readability with darker text colors
- Added "Service Requests" navigation link for easier access

### Homepage Navigation
- When a user is signed in and visits the homepage, the "Sign In" button now displays as "Dashboard" for quick access

---

## Rider Options Updates

### New Riders Added
| Rider | Category |
|-------|----------|
| SOLD | Status |
| Under Contract, Taking Backups | Status |
| Huge Backyard | Property Features |
| Furnished | Property Features |
| Pool/Spa | Property Features |
| Golf Course | Property Features |
| Waterfront | Property Features |
| Neighborhood Specialist | Special |
| Car Garage (Custom) | Custom |

### Riders Removed
- Open House
- Back on the Market
- No HOA
- For Lease

### Riders Changed
- "Lake Front" renamed to "Waterfront"

### Custom Riders
Two custom rider options now available with number input:
1. **Custom Acres** - Enter any acreage (e.g., "5 Acres", "10 Acres")
2. **Car Garage** - Enter garage size (e.g., "2 Car Garage", "3 Car Garage")

Both custom options now have improved styling with better visibility in the order form.

---

## New Pages

### Terms and Conditions (`/terms`)
New page covering:
- **Order Processing**: Orders before 4pm EST receive next business day installation
- **Business Days**: Monday through Saturday (Sunday closed)
- **HOA Notice**: Customer responsibility to inform of HOA restrictions
- **Kentucky 811**: Utility line marking information and liability disclaimers
- **PVC Water Lines**: Risk disclosure for undetectable water lines
- **Rider Rental Terms**: Property ownership and return requirements

### Privacy Policy (`/privacy`)
New page covering:
- No data sales commitment
- Information we collect (contact info, addresses, order history, payments)
- How information is used
- Payment security via Stripe
- Contact information for privacy questions

---

## New Customer Features

### Order History (Enhanced)
- **Location:** Dashboard → Order History
- Now displays real order data from the database (previously showed placeholder data)
- Includes pagination for customers with many orders
- Shows order status, property address, scheduled date, and pricing breakdown

### Order Details Page (New)
- **Location:** Dashboard → Order History → Click any order
- Full order details including:
  - Visual status timeline showing order progress
  - Complete item breakdown with pricing
  - Payment status indicator
  - Property information
- Accessible via notification links when order status changes

### Service Requests Page (New)
- **Location:** Dashboard → Service Requests
- Customers can now view all their submitted service requests
- Summary cards showing counts by status (Pending, Acknowledged, Scheduled, etc.)
- Filterable tabs: All, Active, Completed
- Each request shows:
  - Request type (Removal, Service, Repair, Replacement)
  - Current status with visual indicator
  - Associated property address
  - Admin notes (when provided)
  - Submission and completion dates

### Billing Page (Enhanced)
- **Location:** Dashboard → Billing
- Now has two tabs:
  1. **Payment Methods** - Add, view, and manage saved credit/debit cards
  2. **Payment History** - View past payments (unchanged)
- Customers can:
  - Add new payment cards securely via Stripe
  - Set a default card for automatic billing
  - Remove saved cards
  - View card details (brand, last 4 digits, expiration)

---

## Admin Improvements

### Order Completion Flow
- When an admin marks an order as "Completed":
  1. System automatically creates installation records
  2. Riders and lockboxes from the order are tracked on the installation
  3. Customer's default payment method is automatically charged
  4. Customer receives a notification and email confirmation

### Service Request Management
- Admin can view and manage all customer service requests
- Update request status with admin notes
- Customers are notified of status changes

---

## Security Enhancements

### Authentication & Authorization
- Enhanced middleware protection for all dashboard and admin routes
- Role-based access control (customers vs admins)
- Session validation on protected API endpoints

### Rate Limiting
- API endpoints are protected against abuse
- Prevents automated attacks and excessive requests

### Password Security
- Strong password requirements enforced during registration
- Secure password reset flow via email

### Data Protection
- All payment card data handled by Stripe (PCI compliant)
- Only card references stored in database, never actual card numbers
- HTTPS required for all transactions

---

## Stripe Payment Integration

### How It Works

1. **Customer Saves Card**
   - Customer goes to Dashboard → Billing → Payment Methods
   - Clicks "Add Card" and enters card details in the secure Stripe form
   - Card is securely stored by Stripe (we only store a reference ID)

2. **Customer Places Order**
   - Customer submits an order through the normal order flow
   - Order is created with "Pending" payment status

3. **Admin Completes Order**
   - Admin reviews and marks the order as "Completed"
   - System automatically charges the customer's default payment method
   - Payment status updates to "Succeeded" or "Failed"

4. **Customer Receives Confirmation**
   - Email notification sent upon successful payment
   - Payment appears in Billing → Payment History

### What Customers See

| Page | Feature |
|------|---------|
| Billing → Payment Methods | Add/remove cards, set default |
| Billing → Payment History | View all past payments |
| Order Details | Payment status (Pending/Succeeded/Failed) |

### What Admins See

| Action | Result |
|--------|--------|
| Mark order "Completed" | Auto-charges customer's default card |
| View order | See payment status and Stripe payment ID |

---

## Stripe Setup Instructions

To enable payment processing, you'll need to create a Stripe account and configure the API keys.

### Step 1: Create Stripe Account

1. Go to [stripe.com](https://stripe.com) and click "Start now"
2. Complete the registration process
3. Verify your email address

### Step 2: Get Your API Keys

1. Log into the [Stripe Dashboard](https://dashboard.stripe.com)
2. Click **Developers** in the left sidebar
3. Click **API keys**
4. You'll see two keys:
   - **Publishable key** - Starts with `pk_test_` (test) or `pk_live_` (production)
   - **Secret key** - Starts with `sk_test_` (test) or `sk_live_` (production)
5. Click "Reveal" to see the Secret key and copy both

### Step 3: Configure Environment Variables

Add these to your `.env.local` file (or hosting environment variables):

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxxx
```

**Important:**
- Use `pk_test_` and `sk_test_` keys for testing
- Switch to `pk_live_` and `sk_live_` keys when going to production
- Never share or commit the Secret key to version control

### Step 4: Set Up Webhooks (Production)

Webhooks allow Stripe to notify your application about payment events.

1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Enter your endpoint URL:
   ```
   https://yourdomain.com/api/stripe/webhook
   ```
4. Select events to listen for:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_`)
7. Add to your environment variables:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx
   ```

### Step 5: Test the Integration

1. Use Stripe's test card numbers:
   - **Success:** `4242 4242 4242 4242`
   - **Decline:** `4000 0000 0000 0002`
   - Any future expiry date and any 3-digit CVC

2. Test flow:
   - Log in as a customer
   - Go to Dashboard → Billing → Payment Methods
   - Click "Add Card" and enter test card details
   - Place a test order
   - Log in as admin and mark the order "Completed"
   - Verify the payment appears in Stripe Dashboard

### Step 6: Go Live

1. Complete Stripe account activation (verify business details)
2. Replace test keys with live keys in environment variables
3. Update webhook endpoint to use live signing secret
4. Test with a real card (you can refund immediately)

---

## Technical Reference

### New API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/stripe/setup-intent` | POST | Create SetupIntent for adding cards |
| `/api/stripe/payment-methods` | GET | List saved payment methods |
| `/api/stripe/payment-methods` | POST | Save a new payment method |
| `/api/stripe/payment-methods/[id]` | DELETE | Remove a payment method |
| `/api/stripe/payment-methods/[id]` | PATCH | Set as default payment method |
| `/api/stripe/webhook` | POST | Handle Stripe webhook events |
| `/api/service-requests` | GET | List customer's service requests |
| `/api/orders/[id]` | GET | Get order details |

### Database Changes

- `PaymentMethod` table stores card references (not actual card data)
- `User.stripeCustomerId` links users to Stripe customers
- `Order.paymentIntentId` tracks Stripe payment references
- `Order.paidAt` records payment timestamp

---

## Support

For questions or concerns, contact us at **859-395-8188**

**Test Mode:** Remember that test mode transactions don't process real money. Always verify you're using live keys before accepting real payments.
