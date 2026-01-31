import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { MOCK_USERS } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const netId = searchParams.get('netId')

  if (!netId) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  const mockUser = MOCK_USERS.find(u => u.netId === netId)
  if (!mockUser) {
    return NextResponse.redirect(new URL('/?error=invalid_user', req.url))
  }

  // Create or get user from database
  try {
    let dbUser = await prisma.user.findUnique({
      where: { netId },
    })

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          id: mockUser.id,
          netId: mockUser.netId,
          email: mockUser.email,
          name: mockUser.name,
        },
      })
    }

    // Set session cookie
    const session = {
      userId: dbUser.id,
      netId: dbUser.netId,
      name: dbUser.name,
      email: dbUser.email,
    }

    const response = NextResponse.redirect(new URL('/dashboard', req.url))
    response.cookies.set('mock_session', JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    return response
  } catch (error) {
    console.error('Login error:', error)
    // Fallback: set cookie without database
    const session = {
      userId: mockUser.id,
      netId: mockUser.netId,
      name: mockUser.name,
      email: mockUser.email,
    }

    const response = NextResponse.redirect(new URL('/dashboard', req.url))
    response.cookies.set('mock_session', JSON.stringify(session), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    })

    return response
  }
}
