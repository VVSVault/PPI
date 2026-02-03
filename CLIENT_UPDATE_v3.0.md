# Pink Posts Installations - Platform Update Summary

**Version:** 3.0
**Date:** February 2026

This document summarizes the updates made to the Pink Posts Installations platform in version 3.0.

---

## Table of Contents

1. [Contact Information Updates](#contact-information-updates)
2. [Footer Updates](#footer-updates)
3. [New Pages](#new-pages)
4. [Customer Inventory System](#customer-inventory-system)
5. [Lockbox Services Updates](#lockbox-services-updates)
6. [Brochure Box Updates](#brochure-box-updates)
7. [Pricing Changes](#pricing-changes)

---

## Contact Information Updates

Updated contact information throughout the platform:

| Field | New Value |
|-------|-----------|
| **Address** | 110 Winding View Trail, Georgetown, KY 40324 |
| **Phone** | 859-395-8188 |
| **Email** | Contact@PinkPosts.com |

Contact information has been updated in:
- Footer on all pages
- Contact page
- Constants file (for future references)

---

## Footer Updates

### Links Updated

| Change | Before | After |
|--------|--------|-------|
| Lockboxes link | `/dashboard/lockbox-options` (required login) | `/lockboxes` (public page) |
| Help Center | Linked to `/help` (404) | **Removed** |

### Contact Information
The footer now displays:
- Full street address (110 Winding View Trail, Georgetown, KY 40324)
- Phone number (859-395-8188)
- Email (Contact@PinkPosts.com)

---

## New Pages

### Contact Page (`/contact`)

New public contact page with:
- **Contact Information**: Phone, email, and address with clickable links
- **Business Hours**: Monday-Saturday open, Sunday closed
- **Next Day Installation Notice**: Orders before 4pm EST
- **Service Area Map**: Lists all serviced counties (Fayette, Scott, Woodford, Jessamine, Clark, Madison, Bourbon, Franklin)

### Public Lockboxes Page (`/lockboxes`)

New marketing page showcasing lockbox services. Replaces the dashboard-only view that required login. Includes:
- Three lockbox options with descriptions
- Feature lists for each option
- Pricing information
- Call-to-action to create an account

### Customer Inventory Page (`/dashboard/inventory`)

New dashboard page allowing customers to view items stored with Pink Posts Installations. Accessible via new "My Inventory" link in the sidebar.

---

## Customer Inventory System

### Overview

The platform supports customer inventory management, allowing the business owner to store items for customers between installations. Customers can view their stored items and select them when placing new orders.

### Inventory Types

| Type | Description | How It's Used |
|------|-------------|---------------|
| **Signs** | Customer-owned real estate signs | Selected during order: "Use stored sign" option |
| **Riders** | Status tags (Open House, Pending, etc.) | Selected during order: shows owned riders with quantities |
| **Lockboxes** | Customer-owned lockboxes with codes | Selected during order: choose from stored lockboxes |
| **Brochure Boxes** | Brochure box containers | Quantity tracked in storage |

### New "My Inventory" Dashboard Page

A new page has been added to the customer dashboard at `/dashboard/inventory`:

**Features:**
- View all items currently stored by Pink Posts Installations
- See quantities of each item type
- Organized into four categories: Signs, Riders, Lockboxes, Brochure Boxes
- Informational banner explaining how inventory works
- "How Inventory Works" section with step-by-step explanation

**Sidebar Update:**
- New "My Inventory" link added to dashboard sidebar (with Package icon)
- Located between "Dashboard" and "Post Options"

### Using Inventory in Orders

When placing an order, customers can select stored items:

1. **Signs Step**: Option to "Use a sign from storage" with dropdown of stored signs
2. **Riders Step**: Shows owned riders grouped by type with quantity counts
3. **Lockbox Step**: Can select from stored lockboxes
4. **Brochure Box Step**: Currently uses purchase/install options (storage option removed in v3.0)

### How Inventory Gets Added

Items are added to customer inventory by the business owner through the admin panel:
- Navigate to Admin → Customers → [Customer] → Inventory tab
- Add signs, riders, lockboxes, or brochure boxes
- Items marked "in storage" appear in customer's inventory view

---

## Lockbox Services Updates

### Updated Options and Pricing

| Option | Description | Price |
|--------|-------------|-------|
| **Realtor Bluetooth Lockbox** | Install your SentriLock or Bluetooth-enabled lockbox | $5 install |
| **Mechanical Lockbox (Your Own)** | Install your own mechanical combination lockbox | $5 install |
| **Mechanical Lockbox (Rental)** | We provide AND install a mechanical lockbox | $10 total |

### Key Changes

1. **Renamed**: "SentriLock" option renamed to "Realtor Bluetooth Lockbox"
2. **Pricing Updated**: Mechanical rental changed from $15 to $10
3. **No Separate Rental Fee**: The $10 for rental includes both the lockbox AND installation
4. **Clearer Descriptions**: Updated descriptions to emphasize what's included

### Updated Messaging

- Order form note: "Install your own lockbox (Bluetooth or mechanical) for $5, or rent and install our mechanical lockbox for $10 (includes lockbox + installation)."
- Dashboard lockbox options page updated with new pricing, descriptions, and images
- Public lockboxes page created with consistent information and images
- Homepage now features a dedicated lockbox section with images

### Lockbox Images Added

Three lockbox images have been added to showcase the options:

| Image | Location | Description |
|-------|----------|-------------|
| `bluetooth-lockbox.png` | `/images/lockboxes/` | Realtor Bluetooth/SentriLock lockbox |
| `mechanical-lockbox.png` | `/images/lockboxes/` | Mechanical combination lockbox |
| `rental-lockbox.png` | `/images/lockboxes/` | Rental mechanical lockbox on red door |

Images are displayed on:
- Homepage lockbox section
- Dashboard lockbox options page
- Public `/lockboxes` marketing page

---

## Brochure Box Updates

### New Options (Order Form)

| Option | Description | Price |
|--------|-------------|-------|
| **Purchase a brochure box** | We provide and install a brochure box for you to keep | $23 (includes $2 install) |
| **Install my own** | Bring your own brochure box and we'll install it | $2 install fee |
| **No brochure box** | Skip brochure box for this installation | $0 |

### Key Changes

1. **Removed Rental Option**: No longer offering brochure box rental
2. **New Purchase Option**: Customers can now purchase a brochure box for $23 (keeps it)
3. **Install Your Own**: Reduced from $3 to $2 install fee
4. **Removed Storage Option**: No longer pulling from customer storage inventory

---

## Pricing Changes

### Brochure Box Pricing

| Item | Old Price | New Price |
|------|-----------|-----------|
| Purchase brochure box (includes install) | N/A | **$23** |
| Install your own brochure box | $3 | **$2** |
| Brochure box rental | $5 | **Removed** |

### Lockbox Pricing

| Item | Old Price | New Price |
|------|-----------|-----------|
| Install your lockbox (Bluetooth/SentriLock) | $5 | $5 (no change) |
| Install your mechanical lockbox | $5 | $5 (no change) |
| Rent + Install mechanical lockbox | $15 | **$10** |

**Important**: The rental option now clearly states it includes both the lockbox AND installation - there is no separate rental fee.

---

## Technical Changes

### Files Modified

| File | Change |
|------|--------|
| `components/marketing/footer.tsx` | Updated contact info, removed Help Center link, updated Lockboxes href |
| `lib/constants.ts` | Updated CONTACT object, lockbox pricing, and brochure box pricing |
| `app/dashboard/lockbox-options/page.tsx` | Updated pricing, descriptions, and added lockbox images |
| `app/(marketing)/page.tsx` | Added LockboxSection component to homepage |
| `components/order-flow/steps/lockbox-step.tsx` | Updated note text |
| `components/order-flow/steps/brochure-box-step.tsx` | New options: purchase ($23) and install own ($2) |
| `components/order-flow/steps/review-step.tsx` | Updated brochure box pricing logic |
| `components/order-flow/types.ts` | Updated brochure_option types and pricing |
| `supabase/schema.sql` | Updated rental_price from 15.00 to 10.00 |
| `prisma/seed.ts` | Updated rentalPrice from 15.00 to 10.00 |
| `components/dashboard/sidebar.tsx` | Added "My Inventory" link with Package icon |

### New Files

| File | Description |
|------|-------------|
| `app/(marketing)/contact/page.tsx` | New Contact Us page |
| `app/(marketing)/lockboxes/page.tsx` | New public Lockboxes page |
| `components/marketing/lockbox-section.tsx` | Homepage lockbox showcase section |
| `public/images/lockboxes/bluetooth-lockbox.png` | Bluetooth/SentriLock lockbox image |
| `public/images/lockboxes/mechanical-lockbox.png` | Mechanical combination lockbox image |
| `public/images/lockboxes/rental-lockbox.png` | Rental mechanical lockbox image |
| `app/dashboard/inventory/page.tsx` | Customer inventory viewing page |

---

## Summary of Changes

| Change | Details |
|--------|---------|
| Contact Us link shows 404 | Created `/contact` page |
| Help Center link shows 404 | Removed link from footer |
| Lockboxes requires login to view | Created public `/lockboxes` page |
| $15 lockbox rental fee | Updated to $10 across all files |
| Incorrect contact information | Updated to correct address, phone, and email |
| Brochure box options | New: Purchase $23, Install own $2 (removed rental option) |
| Homepage lockbox section | Added "We Can Install Your Lockboxes" section with images |
| Lockbox images | Added product images to homepage, dashboard, and lockboxes page |
| Customer inventory page | New `/dashboard/inventory` page to view stored items |
| Inventory sidebar link | Added "My Inventory" to dashboard navigation |

---

## Support

For questions or concerns, contact us at:

**Phone:** 859-395-8188
**Email:** Contact@PinkPosts.com
**Address:** 110 Winding View Trail, Georgetown, KY 40324
