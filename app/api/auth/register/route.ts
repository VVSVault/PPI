import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { createWelcomeNotification } from '@/lib/notifications'
import { checkRateLimit, rateLimitPresets } from '@/lib/rate-limit'

// Password validation rules
const PASSWORD_MIN_LENGTH = 8
const PASSWORD_REGEX = {
  hasUppercase: /[A-Z]/,
  hasLowercase: /[a-z]/,
  hasNumber: /[0-9]/,
}

function validatePassword(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (password.length < PASSWORD_MIN_LENGTH) {
    errors.push(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`)
  }

  if (!PASSWORD_REGEX.hasUppercase.test(password)) {
    errors.push('Password must contain at least one uppercase letter')
  }

  if (!PASSWORD_REGEX.hasLowercase.test(password)) {
    errors.push('Password must contain at least one lowercase letter')
  }

  if (!PASSWORD_REGEX.hasNumber.test(password)) {
    errors.push('Password must contain at least one number')
  }

  return { valid: errors.length === 0, errors }
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export async function POST(request: NextRequest) {
  // Apply rate limiting - 5 registration attempts per 15 minutes
  const rateLimitResponse = checkRateLimit(request, rateLimitPresets.auth)
  if (rateLimitResponse) {
    return rateLimitResponse
  }

  try {
    const body = await request.json()
    const { email, password, fullName, phone, company } = body

    // Validate required fields
    if (!email || !password || !fullName) {
      return NextResponse.json(
        { error: 'Email, password, and full name are required' },
        { status: 400 }
      )
    }

    // Validate email format
    if (!validateEmail(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address' },
        { status: 400 }
      )
    }

    // Validate password strength
    const passwordValidation = validatePassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.json(
        { error: passwordValidation.errors.join('. ') },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user (store email in lowercase for consistency)
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        fullName,
        name: fullName,
        phone,
        company,
        role: 'customer',
      },
    })

    // Create welcome notification
    try {
      await createWelcomeNotification(user.id, fullName)
    } catch (notifError) {
      console.error('Error creating welcome notification:', notifError)
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Failed to create account' },
      { status: 500 }
    )
  }
}
