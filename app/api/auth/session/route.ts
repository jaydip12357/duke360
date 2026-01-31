import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('mock_session')

  if (!sessionCookie) {
    return NextResponse.json({ user: null }, { status: 401 })
  }

  try {
    const session = JSON.parse(sessionCookie.value)
    return NextResponse.json({
      user: {
        id: session.userId,
        netId: session.netId,
        name: session.name,
        email: session.email,
      },
    })
  } catch {
    return NextResponse.json({ user: null }, { status: 401 })
  }
}
