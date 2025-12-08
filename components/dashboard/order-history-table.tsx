'use client'

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui'
import { formatDate, formatCurrency } from '@/lib/utils'

interface OrderItem {
  id: string
  date: string
  itemType: 'post' | 'rider' | 'lockbox' | 'service'
  description: string
  address: string
  amount: number
  belongsTo: string
}

interface OrderHistoryTableProps {
  items: OrderItem[]
}

const itemTypeConfig = {
  post: { label: 'POST', variant: 'info' as const },
  rider: { label: 'RIDER', variant: 'success' as const },
  lockbox: { label: 'LOCKBOX', variant: 'warning' as const },
  service: { label: 'SERVICE', variant: 'neutral' as const },
}

const OrderHistoryTable = ({ items }: OrderHistoryTableProps) => {
  const filterItems = (type: string | null) => {
    if (!type) return items
    return items.filter((item) => item.itemType === type)
  }

  const TableContent = ({ filteredItems }: { filteredItems: OrderItem[] }) => (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Belongs To</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="whitespace-nowrap">
                  {formatDate(item.date)}
                </TableCell>
                <TableCell>
                  <Badge variant={itemTypeConfig[item.itemType].variant}>
                    {itemTypeConfig[item.itemType].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-gray-900">{item.description}</p>
                    <p className="text-sm text-gray-500">{item.address}</p>
                  </div>
                </TableCell>
                <TableCell className="font-semibold">
                  {formatCurrency(item.amount)}
                </TableCell>
                <TableCell className="text-gray-600">{item.belongsTo}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredItems.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No items found.
        </div>
      )}
    </div>
  )

  return (
    <Tabs defaultValue="all" variant="pills">
      <TabsList className="mb-6">
        <TabsTrigger value="all">All Items</TabsTrigger>
        <TabsTrigger value="post">Signs</TabsTrigger>
        <TabsTrigger value="rider">Riders</TabsTrigger>
        <TabsTrigger value="lockbox">Lockboxes</TabsTrigger>
      </TabsList>

      <TabsContent value="all">
        <TableContent filteredItems={filterItems(null)} />
      </TabsContent>
      <TabsContent value="post">
        <TableContent filteredItems={filterItems('post')} />
      </TabsContent>
      <TabsContent value="rider">
        <TableContent filteredItems={filterItems('rider')} />
      </TabsContent>
      <TabsContent value="lockbox">
        <TableContent filteredItems={filterItems('lockbox')} />
      </TabsContent>
    </Tabs>
  )
}

export { OrderHistoryTable }
export type { OrderItem }
