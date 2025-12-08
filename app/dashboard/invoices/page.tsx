'use client'

import { Header, InvoiceTable } from '@/components/dashboard'
import type { Invoice } from '@/components/dashboard/invoice-table'

// Mock data - replace with real data from Supabase
const mockInvoices: Invoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2025-001',
    date: '2025-11-29',
    status: 'paid',
    total: 66.29,
    items: [
      {
        id: 'item-1a',
        date: '2025-11-29',
        description: 'AMERICAN EXPRESS: ....1005',
        amount: -66.29,
        balance: 0,
      },
    ],
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-2025-002',
    date: '2025-11-20',
    status: 'pending',
    total: 64.56,
    items: [
      {
        id: 'item-2a',
        date: '2025-11-20',
        description: 'Installation: 1245 Richmond Rd, Lexington, KY 40502',
        amount: 0,
        balance: 0,
      },
      {
        id: 'item-2b',
        date: '',
        description: 'POST: White Wood',
        belongsTo: 'Champs',
        amount: 55,
        balance: 1.54,
        isChild: true,
        parentId: 'item-2a',
      },
      {
        id: 'item-2c',
        date: '',
        description: 'SIGN: RYAN RICHARDSON 859-555-0518 (SBY) 24X30 W/QR CODE ***#2***',
        belongsTo: 'RYAN RICHARDSON',
        amount: 3,
        balance: 0,
        isChild: true,
        parentId: 'item-2a',
      },
      {
        id: 'item-2d',
        date: '',
        description: 'RIDER: SOLD',
        belongsTo: 'Champs',
        amount: 5,
        balance: 0.14,
        isChild: true,
        parentId: 'item-2a',
      },
      {
        id: 'item-2e',
        date: '',
        description: 'Online order discount - 1245 Richmond Rd',
        amount: -2,
        balance: -0.05,
        isChild: true,
        parentId: 'item-2a',
      },
      {
        id: 'item-2f',
        date: '',
        description: 'Fuel Surcharge - 1245 Richmond Rd',
        amount: 3.56,
        balance: 0.1,
        isChild: true,
        parentId: 'item-2a',
      },
    ],
  },
  {
    id: 'inv-3',
    invoiceNumber: 'INV-2025-003',
    date: '2025-11-15',
    status: 'overdue',
    total: 95,
    items: [
      {
        id: 'item-3a',
        date: '2025-11-15',
        description: 'Installation: 456 Man O War Blvd, Lexington, KY 40509',
        amount: 0,
        balance: 0,
      },
      {
        id: 'item-3b',
        date: '',
        description: 'POST: Pink Signature',
        belongsTo: 'You',
        amount: 65,
        balance: 65,
        isChild: true,
        parentId: 'item-3a',
      },
      {
        id: 'item-3c',
        date: '',
        description: 'LOCKBOX: Supra eKey (Monthly)',
        belongsTo: 'You',
        amount: 25,
        balance: 25,
        isChild: true,
        parentId: 'item-3a',
      },
      {
        id: 'item-3d',
        date: '',
        description: 'RIDER: Coming Soon',
        belongsTo: 'You',
        amount: 5,
        balance: 5,
        isChild: true,
        parentId: 'item-3a',
      },
    ],
  },
]

export default function InvoicesPage() {
  return (
    <div>
      <Header title="Invoices & Billing" />

      <div className="p-6">
        <InvoiceTable invoices={mockInvoices} />
      </div>
    </div>
  )
}
