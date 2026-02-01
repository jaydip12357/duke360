import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create dining locations
  const locations = [
    {
      id: 'broadhead',
      name: 'Broadhead',
      shortName: 'BH',
      address: '705 Broad St, Durham, NC 27705',
      totalContainers: 100,
      availableNow: 67,
      openTime: '07:00',
      closeTime: '21:00',
      slotDuration: 15,
      slotsPerZone: 20,
    },
    {
      id: 'west-union',
      name: 'West Union',
      shortName: 'WU',
      address: '308 Research Dr, Durham, NC 27708',
      totalContainers: 80,
      availableNow: 45,
      openTime: '07:00',
      closeTime: '22:00',
      slotDuration: 15,
      slotsPerZone: 15,
    },
    {
      id: 'marketplace',
      name: 'Marketplace',
      shortName: 'MP',
      address: '1600 Science Dr, Durham, NC 27708',
      totalContainers: 60,
      availableNow: 32,
      openTime: '07:30',
      closeTime: '20:00',
      slotDuration: 15,
      slotsPerZone: 12,
    },
  ]

  for (const location of locations) {
    await prisma.diningLocation.upsert({
      where: { id: location.id },
      update: location,
      create: location,
    })
  }
  console.log('Created dining locations')

  // Create achievements
  const achievements = [
    { name: 'First Steps', description: 'Complete your first checkout', icon: 'seedling', points: 10, requirement: 'checkouts', threshold: 1, badgeColor: '#4CAF50' },
    { name: 'Getting Started', description: '5 checkouts completed', icon: 'leaf', points: 25, requirement: 'checkouts', threshold: 5, badgeColor: '#8BC34A' },
    { name: 'Eco Warrior', description: '25 checkouts completed', icon: 'tree', points: 100, requirement: 'checkouts', threshold: 25, badgeColor: '#2E7D32' },
    { name: 'On a Roll', description: '5-day return streak', icon: 'fire', points: 50, requirement: 'streak', threshold: 5, badgeColor: '#FF9800' },
    { name: 'Unstoppable', description: '15-day return streak', icon: 'lightning', points: 150, requirement: 'streak', threshold: 15, badgeColor: '#FFC107' },
    { name: 'Perfect Month', description: '30 checkouts in 30 days', icon: 'trophy', points: 300, requirement: 'monthly', threshold: 30, badgeColor: '#FFD700' },
    { name: 'Early Bird', description: '10 early returns', icon: 'bird', points: 75, requirement: 'early_returns', threshold: 10, badgeColor: '#03A9F4' },
    { name: 'Zero Waste Hero', description: 'Save 100 disposables', icon: 'recycle', points: 200, requirement: 'disposables', threshold: 100, badgeColor: '#4CAF50' },
  ]

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { name: achievement.name },
      update: achievement,
      create: achievement,
    })
  }
  console.log('Created achievements')

  // Create demo users
  const users = [
    { id: 'demo-user-1', netId: 'js123', email: 'john.smith@duke.edu', name: 'John Smith', points: 420, totalCheckouts: 42, totalReturns: 40, onTimeReturns: 38, currentStreak: 12, longestStreak: 15 },
    { id: 'demo-user-2', netId: 'em456', email: 'emma.lee@duke.edu', name: 'Emma Lee', points: 380, totalCheckouts: 38, totalReturns: 36, onTimeReturns: 34, currentStreak: 8, longestStreak: 10 },
    { id: 'demo-user', netId: 'jp789', email: 'jaideep@duke.edu', name: 'Jaideep', points: 847, totalCheckouts: 89, totalReturns: 87, onTimeReturns: 85, currentStreak: 7, longestStreak: 14 },
    { id: 'demo-admin', netId: 'admin', email: 'admin@duke.edu', name: 'Admin User', points: 0, totalCheckouts: 0, totalReturns: 0, onTimeReturns: 0, currentStreak: 0, longestStreak: 0 },
  ]

  for (const user of users) {
    await prisma.user.upsert({
      where: { netId: user.netId },
      update: user,
      create: user,
    })
  }
  console.log('Created demo users')

  // Create containers
  const containerLocations = ['Broadhead', 'West Union', 'Marketplace']
  const containerStatuses = ['available', 'checked_out', 'washing', 'maintenance']

  for (let i = 1; i <= 100; i++) {
    const id = `DU-2026-${String(i).padStart(3, '0')}`
    let status: string
    if (i <= 67) status = 'available'
    else if (i <= 90) status = 'checked_out'
    else if (i <= 95) status = 'washing'
    else status = 'maintenance'

    await prisma.container.upsert({
      where: { id },
      update: {
        status,
        totalUses: Math.floor(Math.random() * 100),
      },
      create: {
        id,
        rfidTag: `RFID${String(i).padStart(4, '0')}`,
        status,
        totalUses: Math.floor(Math.random() * 100),
        currentLocation: containerLocations[i % 3],
        manufacturedDate: new Date('2026-01-01'),
        lastWashDate: status === 'available' ? new Date() : null,
      },
    })
  }
  console.log('Created 100 containers')

  // Create some sample checkouts for demo users
  const sampleCheckouts = [
    {
      userId: 'demo-user-1',
      pickupLocation: 'Broadhead',
      pickupZone: 'A',
      pickupTimeSlot: new Date(Date.now() - 172800000), // 2 days ago
      expectedReturnDate: new Date(Date.now() - 86400000), // 1 day ago
      actualPickupTime: new Date(Date.now() - 172800000),
      actualReturnDate: new Date(Date.now() - 90000000), // 25 hours ago
      status: 'returned',
      isLate: false,
      containerId: 'DU-2026-038',
    },
    {
      userId: 'demo-user-1',
      pickupLocation: 'West Union',
      pickupZone: 'B',
      pickupTimeSlot: new Date(Date.now() - 259200000), // 3 days ago
      expectedReturnDate: new Date(Date.now() - 172800000), // 2 days ago
      actualPickupTime: new Date(Date.now() - 259200000),
      actualReturnDate: new Date(Date.now() - 176400000), // 49 hours ago
      status: 'returned',
      isLate: false,
      containerId: 'DU-2026-025',
    },
  ]

  for (const checkout of sampleCheckouts) {
    await prisma.checkout.create({
      data: checkout,
    })
  }
  console.log('Created sample checkouts')

  // Award achievements to demo users
  const firstStepsAchievement = await prisma.achievement.findUnique({ where: { name: 'First Steps' } })
  const gettingStartedAchievement = await prisma.achievement.findUnique({ where: { name: 'Getting Started' } })
  const onARollAchievement = await prisma.achievement.findUnique({ where: { name: 'On a Roll' } })

  if (firstStepsAchievement) {
    await prisma.userAchievement.upsert({
      where: { userId_achievementId: { userId: 'demo-user-1', achievementId: firstStepsAchievement.id } },
      update: {},
      create: { userId: 'demo-user-1', achievementId: firstStepsAchievement.id },
    })
  }
  if (gettingStartedAchievement) {
    await prisma.userAchievement.upsert({
      where: { userId_achievementId: { userId: 'demo-user-1', achievementId: gettingStartedAchievement.id } },
      update: {},
      create: { userId: 'demo-user-1', achievementId: gettingStartedAchievement.id },
    })
  }
  if (onARollAchievement) {
    await prisma.userAchievement.upsert({
      where: { userId_achievementId: { userId: 'demo-user-1', achievementId: onARollAchievement.id } },
      update: {},
      create: { userId: 'demo-user-1', achievementId: onARollAchievement.id },
    })
  }
  console.log('Awarded achievements to demo users')

  console.log('Database seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
