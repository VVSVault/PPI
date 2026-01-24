import { prisma } from '@/lib/prisma'

type NotificationType =
  | 'order_confirmed'
  | 'order_scheduled'
  | 'order_in_progress'
  | 'order_completed'
  | 'order_cancelled'
  | 'service_request_acknowledged'
  | 'service_request_scheduled'
  | 'service_request_completed'
  | 'removal_reminder'
  | 'welcome'

interface CreateNotificationParams {
  userId: string
  type: NotificationType
  title: string
  message: string
  link?: string
}

export async function createNotification({
  userId,
  type,
  title,
  message,
  link,
}: CreateNotificationParams) {
  return prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      link,
    },
  })
}

export async function createOrderNotification(
  userId: string,
  orderNumber: string,
  orderId: string,
  status: string
) {
  const notificationConfig: Record<string, { title: string; message: string; type: NotificationType }> = {
    confirmed: {
      type: 'order_confirmed',
      title: 'Order Confirmed',
      message: `Your order ${orderNumber} has been confirmed and is being processed.`,
    },
    scheduled: {
      type: 'order_scheduled',
      title: 'Installation Scheduled',
      message: `Your order ${orderNumber} has been scheduled for installation.`,
    },
    in_progress: {
      type: 'order_in_progress',
      title: 'Installation In Progress',
      message: `Your order ${orderNumber} installation is now in progress.`,
    },
    completed: {
      type: 'order_completed',
      title: 'Installation Complete',
      message: `Great news! Your order ${orderNumber} installation is complete.`,
    },
    cancelled: {
      type: 'order_cancelled',
      title: 'Order Cancelled',
      message: `Your order ${orderNumber} has been cancelled.`,
    },
  }

  const config = notificationConfig[status]
  if (!config) return null

  return createNotification({
    userId,
    type: config.type,
    title: config.title,
    message: config.message,
    link: `/dashboard/orders/${orderId}`,
  })
}

export async function createServiceRequestNotification(
  userId: string,
  installationAddress: string,
  status: string
) {
  const notificationConfig: Record<string, { title: string; message: string; type: NotificationType }> = {
    acknowledged: {
      type: 'service_request_acknowledged',
      title: 'Service Request Received',
      message: `Your service request for ${installationAddress} has been acknowledged.`,
    },
    scheduled: {
      type: 'service_request_scheduled',
      title: 'Service Scheduled',
      message: `Your service request for ${installationAddress} has been scheduled.`,
    },
    completed: {
      type: 'service_request_completed',
      title: 'Service Completed',
      message: `Your service request for ${installationAddress} has been completed.`,
    },
  }

  const config = notificationConfig[status]
  if (!config) return null

  return createNotification({
    userId,
    type: config.type,
    title: config.title,
    message: config.message,
    link: '/dashboard',
  })
}

export async function createWelcomeNotification(userId: string, userName: string) {
  return createNotification({
    userId,
    type: 'welcome',
    title: 'Welcome to Pink Post!',
    message: `Hi ${userName}! Thanks for joining Pink Post Installations. Ready to place your first order?`,
    link: '/dashboard/place-order',
  })
}

export async function createRemovalReminderNotification(
  userId: string,
  address: string,
  removalDate: Date
) {
  const formattedDate = removalDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

  return createNotification({
    userId,
    type: 'removal_reminder',
    title: 'Upcoming Sign Removal',
    message: `Reminder: Sign removal at ${address} is scheduled for ${formattedDate}.`,
    link: '/dashboard',
  })
}
