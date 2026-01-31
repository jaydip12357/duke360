import { prisma } from './prisma'

// Mock authentication for prototype
// In production, this would integrate with Duke NetID via SAML/OAuth

export interface MockUser {
  id: string
  netId: string
  email: string
  name: string
  isAdmin?: boolean
}

// Simulated users for demo
export const MOCK_USERS: MockUser[] = [
  {
    id: 'demo-user-1',
    netId: 'js123',
    email: 'john.smith@duke.edu',
    name: 'John Smith',
  },
  {
    id: 'demo-user-2',
    netId: 'em456',
    email: 'emma.lee@duke.edu',
    name: 'Emma Lee',
  },
  {
    id: 'demo-admin',
    netId: 'admin',
    email: 'admin@duke.edu',
    name: 'Admin User',
    isAdmin: true,
  },
]

export async function getMockUser(netId: string): Promise<MockUser | null> {
  const mockUser = MOCK_USERS.find(u => u.netId === netId)
  if (!mockUser) return null

  // Try to get from database, create if doesn't exist
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

  return {
    ...mockUser,
    id: dbUser.id,
  }
}

export async function getCurrentUser(cookies: { get: (name: string) => { value: string } | undefined }): Promise<MockUser | null> {
  const sessionCookie = cookies.get('mock_session')
  if (!sessionCookie) return null

  try {
    const session = JSON.parse(sessionCookie.value)
    return await getMockUser(session.netId)
  } catch {
    return null
  }
}
