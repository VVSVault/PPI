'use client'

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Badge,
  Button,
} from '@/components/ui'
import { formatDate, formatCurrency } from '@/lib/utils'
import { Download, FileText } from 'lucide-react'

interface InvoiceItem {
  id: string
  date: string
  description: string
  itemType?: string
  belongsTo?: string
  amount: number
  balance: number
  isChild?: boolean
  parentId?: string
}

interface Invoice {
  id: string
  invoiceNumber: string
  date: string
  status: 'pending' | 'paid' | 'overdue'
  total: number
  items: InvoiceItem[]
}

interface InvoiceTableProps {
  invoices: Invoice[]
  expandedInvoiceId?: string
  onToggleExpand?: (id: string) => void
}

const statusConfig = {
  pending: { label: 'Pending', variant: 'warning' as const },
  paid: { label: 'Paid', variant: 'success' as const },
  overdue: { label: 'Overdue', variant: 'error' as const },
}

const InvoiceTable = ({ invoices }: InvoiceTableProps) => {
  return (
    <div className="space-y-6">
      {/* Account Balance Summary */}
      <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-pink-100 text-sm">Account Balance</p>
            <p className="text-3xl font-bold mt-1">
              {formatCurrency(
                invoices
                  .filter((i) => i.status !== 'paid')
                  .reduce((sum, i) => sum + i.total, 0)
              )}
            </p>
          </div>
          <Button className="bg-white text-pink-600 hover:bg-pink-50">
            Pay Now
          </Button>
        </div>
      </div>

      {/* Invoice List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.flatMap((invoice) => [
                // Invoice header row
                <TableRow key={invoice.id} className="bg-gray-50">
                  <TableCell className="font-medium">
                    {formatDate(invoice.date)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-gray-400" />
                      <div>
                        <p className="font-semibold text-gray-900">
                          Invoice #{invoice.invoiceNumber}
                        </p>
                        <Badge
                          variant={statusConfig[invoice.status].variant}
                          className="mt-1"
                        >
                          {statusConfig[invoice.status].label}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(invoice.total)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>,
                // Invoice line items
                ...invoice.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-gray-500 text-sm">
                      {item.date ? formatDate(item.date) : ''}
                    </TableCell>
                    <TableCell>
                      <div className={item.isChild ? 'pl-8' : ''}>
                        <p
                          className={
                            item.isChild
                              ? 'text-sm text-gray-600'
                              : 'font-medium text-gray-900'
                          }
                        >
                          {item.isChild && '├─ '}
                          {item.description}
                        </p>
                        {item.belongsTo && (
                          <p className="text-xs text-gray-400">
                            (belongs to {item.belongsTo})
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell
                      className={`text-right ${
                        item.amount < 0 ? 'text-green-600' : ''
                      }`}
                    >
                      {formatCurrency(item.amount)}
                    </TableCell>
                    <TableCell className="text-right text-gray-500">
                      {formatCurrency(item.balance)}
                    </TableCell>
                  </TableRow>
                )),
              ])}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Export Options */}
      <div className="flex gap-4">
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </Button>
        <Button variant="outline" size="sm">
          <FileText className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>
    </div>
  )
}

export { InvoiceTable }
export type { Invoice, InvoiceItem }
