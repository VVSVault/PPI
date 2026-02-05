'use client'

import { useEffect, useState } from 'react'
import { Header } from '@/components/dashboard'
import { Card, CardContent, Badge, Tabs, TabsList, TabsTrigger, TabsContent, Button } from '@/components/ui'
import { ScheduleTripModal } from '@/components/dashboard/installation-modals'
import {
  Loader2,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Wrench,
  Trash2,
  RefreshCw,
  FileText,
  Truck,
} from 'lucide-react'

interface ServiceRequest {
  id: string
  type: 'removal' | 'service' | 'repair' | 'replacement'
  status: 'pending' | 'acknowledged' | 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
  description: string | null
  requestedDate: string | null
  notes: string | null
  adminNotes: string | null
  completedAt: string | null
  createdAt: string
  updatedAt: string
  installation: {
    id: string
    address: string
    status: string
  } | null
}

interface StatusCounts {
  pending: number
  acknowledged: number
  scheduled: number
  in_progress: number
  completed: number
  cancelled: number
  total: number
}

const statusConfig: Record<string, { label: string; variant: 'info' | 'success' | 'warning' | 'error' | 'neutral'; icon: typeof Clock }> = {
  pending: { label: 'Pending', variant: 'warning', icon: Clock },
  acknowledged: { label: 'Acknowledged', variant: 'info', icon: FileText },
  scheduled: { label: 'Scheduled', variant: 'info', icon: Calendar },
  in_progress: { label: 'In Progress', variant: 'info', icon: RefreshCw },
  completed: { label: 'Completed', variant: 'success', icon: CheckCircle },
  cancelled: { label: 'Cancelled', variant: 'error', icon: XCircle },
}

const typeConfig: Record<string, { label: string; icon: typeof Wrench }> = {
  removal: { label: 'Sign Removal', icon: Trash2 },
  service: { label: 'Service', icon: Wrench },
  repair: { label: 'Repair', icon: Wrench },
  replacement: { label: 'Replacement', icon: RefreshCw },
}

export default function ServiceRequestsPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [counts, setCounts] = useState<StatusCounts | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showTripModal, setShowTripModal] = useState(false)

  const fetchRequests = async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/service-requests')
      if (!res.ok) {
        throw new Error('Failed to fetch service requests')
      }

      const data = await res.json()
      setRequests(data.serviceRequests || [])
      setCounts(data.counts || null)
    } catch (err) {
      console.error('Error fetching service requests:', err)
      setError(err instanceof Error ? err.message : 'Failed to load service requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const filterRequests = (status: string | null) => {
    if (!status || status === 'all') return requests
    if (status === 'active') {
      return requests.filter((r) => !['completed', 'cancelled'].includes(r.status))
    }
    return requests.filter((r) => r.status === status)
  }

  const RequestCard = ({ request }: { request: ServiceRequest }) => {
    const statusCfg = statusConfig[request.status] || statusConfig.pending
    const typeCfg = typeConfig[request.type] || typeConfig.service
    const StatusIcon = statusCfg.icon
    const TypeIcon = typeCfg.icon

    return (
      <Card variant="bordered" className="mb-4">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              {/* Type and Status */}
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <TypeIcon className="w-4 h-4 text-gray-500" />
                  <span className="font-semibold text-gray-900">{typeCfg.label}</span>
                </div>
                <Badge variant={statusCfg.variant}>
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {statusCfg.label}
                </Badge>
              </div>

              {/* Address */}
              {request.installation && (
                <div className="flex items-start gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                  <p className="text-sm text-gray-600">{request.installation.address}</p>
                </div>
              )}

              {/* Description */}
              {request.description && (
                <p className="text-sm text-gray-700 mb-3">{request.description}</p>
              )}

              {/* Dates */}
              <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Created: {formatDate(request.createdAt)}</span>
                </div>
                {request.requestedDate && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Requested: {formatDate(request.requestedDate)}</span>
                  </div>
                )}
                {request.completedAt && (
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span>Completed: {formatDate(request.completedAt)}</span>
                  </div>
                )}
              </div>

              {/* Notes from admin */}
              {request.adminNotes && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Admin Notes:</p>
                  <p className="text-sm text-gray-700">{request.adminNotes}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <div>
        <Header title="Service Requests" />
        <div className="p-6 flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-pink-600" />
            <p className="text-gray-500">Loading service requests...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div>
        <Header title="Service Requests" />
        <div className="p-6">
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-6 text-center">
              <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
              <p className="text-red-700">{error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header title="Service Requests" />

      <div className="p-6">
        {/* Action Button */}
        <div className="flex justify-end mb-6">
          <Button onClick={() => setShowTripModal(true)}>
            <Truck className="w-4 h-4 mr-2" />
            Schedule a Trip
          </Button>
        </div>

        {/* Summary Cards */}
        {counts && counts.total > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <Card variant="bordered">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-pink-600">{counts.total}</p>
                <p className="text-sm text-gray-500">Total Requests</p>
              </CardContent>
            </Card>
            <Card variant="bordered">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {counts.pending + counts.acknowledged}
                </p>
                <p className="text-sm text-gray-500">Pending</p>
              </CardContent>
            </Card>
            <Card variant="bordered">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {counts.scheduled + counts.in_progress}
                </p>
                <p className="text-sm text-gray-500">In Progress</p>
              </CardContent>
            </Card>
            <Card variant="bordered">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-green-600">{counts.completed}</p>
                <p className="text-sm text-gray-500">Completed</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Requests List */}
        {requests.length === 0 ? (
          <Card variant="bordered">
            <CardContent className="p-8 text-center">
              <Wrench className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Service Requests</h3>
              <p className="text-gray-500">
                You haven&apos;t submitted any service requests yet. Service requests can be
                submitted from your installation details.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="all" variant="pills">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All ({requests.length})</TabsTrigger>
              <TabsTrigger value="active">
                Active ({filterRequests('active').length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({counts?.completed || 0})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              {filterRequests('all').map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </TabsContent>
            <TabsContent value="active">
              {filterRequests('active').length === 0 ? (
                <Card variant="bordered">
                  <CardContent className="p-6 text-center text-gray-500">
                    No active service requests
                  </CardContent>
                </Card>
              ) : (
                filterRequests('active').map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))
              )}
            </TabsContent>
            <TabsContent value="completed">
              {filterRequests('completed').length === 0 ? (
                <Card variant="bordered">
                  <CardContent className="p-6 text-center text-gray-500">
                    No completed service requests
                  </CardContent>
                </Card>
              ) : (
                filterRequests('completed').map((request) => (
                  <RequestCard key={request.id} request={request} />
                ))
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Schedule Trip Modal */}
      <ScheduleTripModal
        isOpen={showTripModal}
        onClose={() => setShowTripModal(false)}
        onSuccess={() => {
          setShowTripModal(false)
          fetchRequests()
        }}
      />
    </div>
  )
}
