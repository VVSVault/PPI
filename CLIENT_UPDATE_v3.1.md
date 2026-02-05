# Pink Posts Installations - Platform Update Summary

**Version:** 3.1
**Date:** February 2026

This document summarizes the updates made to the Pink Posts Installations platform in version 3.1.

---

## Table of Contents

1. [Pricing Updates](#pricing-updates)
2. [Service Area Expansion](#service-area-expansion)
3. [Navigation Updates](#navigation-updates)
4. [Sales Tax Implementation](#sales-tax-implementation)
5. [Stripe Tax Integration](#stripe-tax-integration)
6. [Promo Code System](#promo-code-system)
7. [Payment Method Entry](#payment-method-entry)
8. [Admin Order Management](#admin-order-management)
9. [Admin Inventory Management](#admin-inventory-management)
10. [Terms and Conditions Updates](#terms-and-conditions-updates)
11. [Bug Fixes](#bug-fixes)
12. [Email System Verification](#email-system-verification)

---

## Pricing Updates

### Expedite Fee

| Item | Old Price | New Price |
|------|-----------|-----------|
| Same-day expedited service | $25 | **$50** |

The expedite fee has been increased to $50 for same-day service requests. This change is reflected in:
- Order checkout flow
- Admin settings page
- Order API calculations

---

## Service Area Expansion

### Cincinnati, Ohio Added

Pink Posts Installations now serves the Greater Cincinnati area in addition to Central Kentucky.

**Kentucky Counties:**
- Fayette County
- Scott County
- Woodford County
- Jessamine County
- Clark County
- Madison County
- Bourbon County
- Franklin County

**Ohio Counties (NEW):**
- Hamilton County
- Butler County
- Warren County
- Clermont County

### Contact Page Updates

The Contact page (`/contact`) now displays service areas organized by state:
- **Kentucky** section with all KY counties listed
- **Ohio** section with all OH counties listed

### FAQ Updates

The FAQ section now correctly lists service areas:
- "We currently serve the greater Lexington, Central Kentucky, Louisville, Cincinnati, and surrounding areas!"
- Fixed duplicate "and" in the service area answer

---

## Navigation Updates

### Marketing Navbar

Added two new links to the main navigation menu:

| Link | Destination | Description |
|------|-------------|-------------|
| **Riders** | `/riders` | View available rider options |
| **Lockboxes** | `/lockboxes` | View lockbox services |

The navigation now includes: Posts, Riders, Lockboxes, FAQ

### Riders Page Layout

Updated the rider options display on `/dashboard/rider-options`:
- "Under Contract" and "Neighborhood Specialist" riders are now **centered**
- Changed from horizontal spread to vertical centered layout
- Better visual presentation for longer rider names

---

## Sales Tax Implementation

### Kentucky 6% Sales Tax

Sales tax is now calculated and displayed on all orders:

**Calculation:**
- Tax Rate: 6% (Kentucky state sales tax)
- Taxable Amount: Subtotal + Expedite Fee (fuel surcharge not taxed)
- Tax = Taxable Amount × 0.06

**Displayed In:**
- Checkout review page (before placing order)
- Order confirmation
- Order history details
- Admin order details

**Database:**
- New `tax` field added to orders table
- Tax amount stored with each order

---

## Stripe Tax Integration

### Automatic Tax Calculation

Sales tax is now calculated automatically using Stripe Tax based on the customer's property address.

**How It Works:**
1. During checkout, the system sends line items and property address to Stripe Tax API
2. Stripe calculates the appropriate tax based on:
   - Customer location (city, state, zip)
   - Product/service type
   - State and local tax rates
3. The calculated tax is displayed in the order summary and charged with the order

**Benefits:**
- Accurate tax rates for Kentucky AND Ohio customers
- Automatic compliance with different state tax requirements
- No manual rate updates needed when tax laws change
- Proper handling of different tax jurisdictions

**Fallback:**
If Stripe Tax is unavailable, the system falls back to 6% Kentucky rate to ensure orders can still be processed.

**Checkout Display:**
- Tax rate is shown dynamically (e.g., "Sales Tax (6.0%)")
- Loading indicator while tax is being calculated
- Tax updates automatically when address changes

---

## Payment Method Entry

### Inline Card Entry at Checkout

Customers can now add a payment method directly during checkout without losing their order.

**How It Works:**
1. If no saved payment method exists, a prominent "Add Payment Method" button is displayed
2. Clicking opens a secure Stripe-powered card entry modal
3. After adding a card, the checkout automatically refreshes and selects the new card
4. Order can then be completed immediately

**Features:**
- Secure card entry via Stripe Elements
- Card is automatically saved to customer's account
- Newly added card is auto-selected as payment method
- "Add Card" button also available when cards already exist (to add additional cards)
- Prevents order placement without a valid payment method

**User Experience:**
- No need to navigate away from checkout
- No risk of losing order information
- Clear messaging when no payment method is on file

---

## Promo Code System

### New Feature: Promotional Codes

Customers can now apply promo codes during checkout to receive discounts.

**How It Works:**
1. On the checkout review page, enter a promo code
2. Click "Apply" to validate the code
3. If valid, discount is applied and shown in order summary
4. Promo code is tracked with the order

**Promo Code Features:**
- Percentage-based discounts (e.g., 10% off)
- Fixed amount discounts (e.g., $5 off)
- Minimum order amount requirements
- Usage limits (max number of uses)
- Expiration dates
- Start dates (for future promotions)

**Admin Capabilities:**
- Promo codes can be created in the database
- Track usage counts
- Enable/disable codes
- Set time-limited promotions

**Order Summary Display:**
When a promo code is applied, the order summary shows:
- Subtotal
- **Discount (CODE)** - shown in green with amount saved
- Fuel Surcharge
- Expedite Fee (if applicable)
- Sales Tax (6%)
- **Total**

---

## Admin Order Management

### New Order Detail Page

Admins can now view full order details by clicking the **eye icon** on any order in the orders list.

**Features:**
- Customer information (name, email, phone)
- Property details (address, type, installation notes)
- Order items with pricing breakdown
- Order status management
- Payment status display

### Card Charging Functionality

Admins can now charge customer cards directly from the order detail page:

**How It Works:**
1. Navigate to Admin → Orders → Click eye icon on an order
2. In the Payment section, select a saved payment method
3. Click "Charge $XX.XX" button
4. Payment is processed via Stripe
5. Order payment status updates to "succeeded"
6. Confirmation emails are sent automatically

**Requirements:**
- Customer must have a saved payment method on file
- Order payment status must not already be "succeeded"

---

## Admin Inventory Management

### Fixed: Add Inventory for Customers

Resolved issues with adding inventory items to customer accounts:

**Riders:**
- Can now add riders by name (not just ID)
- System automatically looks up or creates rider catalog entries
- Supports: Under Contract, Sold, Coming Soon, Neighborhood Specialist, Open House, Pending, Price Reduced, and custom riders

**Lockboxes:**
- Can now add lockboxes by type name
- Lockbox code field properly saved
- Supports: SentriLock, Mechanical types

**Signs:**
- Signs can be added with description
- Properly stored in customer inventory

---

## Terms and Conditions Updates

### New Sections Added

Two important sections have been added to the Terms and Conditions page (`/terms`):

**Post Rental Terms:**
- Posts remain property of Pink Posts Installations
- After 6 months from order date, a **$18 post rental charge** is applied every 3 months
- Charge continues until pickup is requested and completed
- Fee automatically charged to the card on file from the original order

**Lost/Stolen/Damaged Items:**

Items not available for pickup will incur the following replacement fees:

| Item | Replacement Fee |
|------|-----------------|
| Posts | $100 |
| Riders | $15 |
| Brochure Box | $25 |
| Lockbox | $25 |

- Fees charged to the credit card that processed the original order
- Customers should notify immediately if items are missing or damaged

---

## Bug Fixes

### Payment Method Display

**Issue:** Saved payment methods were not displaying in the checkout payment selector.

**Cause:** API returned camelCase field names (`brand`, `last4`, `isDefault`) but frontend expected snake_case (`card_brand`, `card_last4`, `is_default`).

**Fix:** API now transforms payment method data to snake_case format.

### Order Placement Validation

**Issue:** Orders were failing validation during submission.

**Fixes:**
- Added `purchase` and `install` to valid `item_category` values (for brochure boxes)
- Added `house`, `construction`, `bare_land` to valid `property_type` values
- Validation schema now accepts all frontend-used values

### Admin Settings Display

Updated the Admin Settings page (`/admin/settings`) to show correct values:
- Expedite Fee: **$50.00** (was showing $25.00)
- Service Area: **Kentucky, Ohio** (was showing only Kentucky)
- Sales Tax: **6%** (new field added)

---

## Email System Verification

### Resend API Status

The email notification system has been verified as fully operational:

**Email Types:**
| Email | Trigger | Recipient |
|-------|---------|-----------|
| Order Confirmation | Order placed successfully | Customer |
| Admin Notification | New order received | Admin |
| Password Reset | Password reset requested | Customer |
| Installation Complete | Order marked complete | Customer |

**Admin Verification:**
- Navigate to Admin → Settings → Email Notifications
- Shows Resend API status (Configured/Not Configured)
- Shows Admin Email address
- **Send Test Email** button to verify delivery

---

## Technical Changes

### Database Schema Updates

New fields and models added:

**Order Model:**
```
tax               Decimal   @default(0)
discount          Decimal   @default(0)
promoCodeId       String?   (relation to PromoCode)
```

**New PromoCode Model:**
```
id              String    @id
code            String    @unique
description     String?
discountType    'percentage' | 'fixed'
discountValue   Decimal
minOrderAmount  Decimal?
maxUses         Int?
currentUses     Int       @default(0)
startsAt        DateTime?
expiresAt       DateTime?
isActive        Boolean   @default(true)
```

### Files Modified

| File | Change |
|------|--------|
| `prisma/schema.prisma` | Added tax, discount, promoCodeId to Order; Added PromoCode model |
| `app/api/orders/route.ts` | Stripe Tax calculation, promo code handling, fallback tax rate |
| `components/order-flow/types.ts` | Added tax_rate, promo code fields |
| `components/order-flow/steps/review-step.tsx` | Tax display, promo code UI, inline card entry, Stripe Tax API call |
| `components/marketing/faq-section.tsx` | Fixed duplicate "and" in service area |
| `components/shared/navbar.tsx` | Added Riders and Lockboxes links |
| `lib/constants.ts` | SERVICE_AREAS now includes Ohio counties |
| `lib/stripe/server.ts` | Added calculateTax() function for Stripe Tax API |
| `app/(marketing)/contact/page.tsx` | Service areas by state |
| `app/(marketing)/terms/page.tsx` | Added post rental terms and lost/damaged item fees |
| `app/dashboard/rider-options/page.tsx` | Centered rider items |
| `app/dashboard/orders/[id]/page.tsx` | Tax and discount display |
| `app/api/payments/methods/route.ts` | Snake_case transformation |
| `app/api/admin/customers/[id]/inventory/route.ts` | Fixed rider/lockbox name lookup |
| `lib/validations.ts` | Added purchase, install, house, construction, bare_land |
| `app/admin/settings/page.tsx` | Updated displayed values |

### New Files

| File | Description |
|------|-------------|
| `app/admin/orders/[id]/page.tsx` | Admin order detail page with card charging |
| `app/api/admin/orders/[id]/route.ts` | GET/PUT single order |
| `app/api/admin/orders/[id]/charge/route.ts` | POST charge customer card |
| `app/api/admin/customers/[id]/payment-methods/route.ts` | GET customer payment methods |
| `app/api/promo-codes/validate/route.ts` | POST validate promo code |
| `app/api/tax/calculate/route.ts` | POST calculate tax via Stripe Tax API |

### Migration Required

Run the following command to apply database changes:

```bash
npx prisma migrate dev --name "v3.1_tax_promo_codes"
```

---

## Summary of Changes

| Change | Details |
|--------|---------|
| Expedite fee | Increased from $25 to $50 |
| Service areas | Added Cincinnati/Ohio (4 counties) |
| Navigation | Added Riders and Lockboxes to navbar |
| Sales tax | 6% Kentucky tax now calculated and displayed |
| **Stripe Tax** | Automatic tax calculation based on customer address (KY/OH support) |
| Promo codes | New system for applying discounts at checkout |
| **Payment entry** | Add card inline during checkout without losing order |
| Admin orders | New detail page with card charging capability |
| Admin inventory | Fixed adding riders/lockboxes by name |
| Payment methods | Fixed display in checkout |
| Order validation | Fixed category and property type issues |
| Rider options | Centered Under Contract and Neighborhood Specialist |
| FAQ | Fixed duplicate "and" in service areas |
| **Terms & Conditions** | Added post rental fees ($18/3mo after 6mo) and lost item fees |
| Email system | Verified Resend API working correctly |

---

## Support

For questions or concerns, contact us at:

**Phone:** 859-395-8188
**Email:** Contact@PinkPosts.com
**Address:** 110 Winding View Trail, Georgetown, KY 40324
