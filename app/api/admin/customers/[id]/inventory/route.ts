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
        result = await prisma.customerRider.create({
          data: {
            userId: customerId,
            riderId: data.rider_id,
            isOwned: data.is_owned ?? true,
            inStorage: data.in_storage ?? true,
          },
        })
        break
      }
      case 'lockbox': {
        result = await prisma.customerLockbox.create({
          data: {
            userId: customerId,
            lockboxTypeId: data.lockbox_type_id,
            serialNumber: data.serial_number,
            code: data.code,
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
