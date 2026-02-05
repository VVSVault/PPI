import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-utils'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: customerId } = await params
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const { type, ...data } = body

    if (!type) {
      return NextResponse.json({ error: 'Type is required' }, { status: 400 })
    }

    let result
    switch (type) {
      case 'sign': {
        result = await prisma.customerSign.create({
          data: {
            userId: customerId,
            description: data.description,
            imageUrl: data.image_url,
            inStorage: data.in_storage ?? true,
          },
        })
        break
      }
      case 'rider': {
        // Look up or create rider by name/type
        let riderId = data.rider_id
        if (!riderId && data.rider_type) {
          // Find or create the rider in the catalog
          let rider = await prisma.riderCatalog.findFirst({
            where: { name: { equals: data.rider_type, mode: 'insensitive' } },
          })
          if (!rider) {
            rider = await prisma.riderCatalog.create({
              data: {
                name: data.rider_type,
                rentalPrice: 5.00,
              },
            })
          }
          riderId = rider.id
        }
        result = await prisma.customerRider.create({
          data: {
            userId: customerId,
            riderId: riderId,
            isOwned: data.is_owned ?? true,
            inStorage: data.in_storage ?? true,
          },
        })
        break
      }
      case 'lockbox': {
        // Look up lockbox type by name if ID not provided
        let lockboxTypeId = data.lockbox_type_id
        if (!lockboxTypeId && data.lockbox_type) {
          const lockboxType = await prisma.lockboxType.findFirst({
            where: { name: { equals: data.lockbox_type, mode: 'insensitive' } },
          })
          if (lockboxType) {
            lockboxTypeId = lockboxType.id
          } else {
            return NextResponse.json({ error: 'Invalid lockbox type' }, { status: 400 })
          }
        }
        result = await prisma.customerLockbox.create({
          data: {
            userId: customerId,
            lockboxTypeId: lockboxTypeId,
            serialNumber: data.serial_number,
            code: data.lockbox_code || data.code,
            isOwned: data.is_owned ?? true,
            inStorage: data.in_storage ?? true,
          },
        })
        break
      }
      case 'brochure_box': {
        result = await prisma.customerBrochureBox.create({
          data: {
            userId: customerId,
            description: data.description,
            inStorage: data.in_storage ?? true,
          },
        })
        break
      }
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    return NextResponse.json({ item: result }, { status: 201 })
  } catch (error) {
    console.error('Error adding inventory:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: customerId } = await params
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const itemId = searchParams.get('item_id')

    if (!type || !itemId) {
      return NextResponse.json(
        { error: 'Type and item_id are required' },
        { status: 400 }
      )
    }

    switch (type) {
      case 'sign':
        await prisma.customerSign.delete({
          where: { id: itemId, userId: customerId },
        })
        break
      case 'rider':
        await prisma.customerRider.delete({
          where: { id: itemId, userId: customerId },
        })
        break
      case 'lockbox':
        await prisma.customerLockbox.delete({
          where: { id: itemId, userId: customerId },
        })
        break
      case 'brochure_box':
        await prisma.customerBrochureBox.delete({
          where: { id: itemId, userId: customerId },
        })
        break
      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting inventory:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
