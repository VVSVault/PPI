'use client'

import { useState } from 'react'
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
import { MoreVertical, Calendar, Wrench, Eye } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface Installation {
  id: string
  installDate: string
  address: string
  city: string
  state: string
  zip: string
  agentRef: string
  mlsNumber: string
  status: 'active' | 'scheduled' | 'removal_scheduled' | 'removed'
  postType: string
}

interface ActivePostsTableProps {
  installations: Installation[]
}

const statusConfig = {
  active: { label: 'Active', variant: 'success' as const },
  scheduled: { label: 'Scheduled', variant: 'info' as const },
  removal_scheduled: { label: 'Removal Scheduled', variant: 'warning' as const },
  removed: { label: 'Removed', variant: 'neutral' as const },
}

const ActivePostsTable = ({ installations }: ActivePostsTableProps) => {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Install Date</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Agent Ref</TableHead>
              <TableHead>MLS #</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-16">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {installations.map((installation) => (
              <TableRow key={installation.id}>
                <TableCell className="font-medium">
                  {formatDate(installation.installDate)}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium text-gray-900">
                      {installation.address}
                    </p>
                    <p className="text-sm text-gray-500">
                      {installation.city}, {installation.state} {installation.zip}
                    </p>
                  </div>
                </TableCell>
                <TableCell>{installation.agentRef || '—'}</TableCell>
                <TableCell>{installation.mlsNumber || '—'}</TableCell>
                <TableCell>
                  <Badge variant={statusConfig[installation.status].variant}>
                    {statusConfig[installation.status].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="relative">
                    <button
                      onClick={() =>
                        setOpenMenuId(
                          openMenuId === installation.id ? null : installation.id
                        )
                      }
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>

                    {/* Dropdown Menu */}
                    {openMenuId === installation.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setOpenMenuId(null)}
                        />
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20 py-1">
                          <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            <Eye className="w-4 h-4" />
                            View Details
                          </button>
                          <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            <Calendar className="w-4 h-4" />
                            Schedule Removal
                          </button>
                          <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            <Wrench className="w-4 h-4" />
                            Request Service
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {installations.length === 0 && (
        <div className="p-8 text-center">
          <p className="text-gray-500">No active installations found.</p>
          <Button variant="primary" className="mt-4">
            Place Your First Order
          </Button>
        </div>
      )}
    </div>
  )
}

export { ActivePostsTable }
export type { Installation }
