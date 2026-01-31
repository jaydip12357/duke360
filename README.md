# DukeReuse 360

**Smart Reusable Dining System with RFID Tracking**

Skip the line, save the planet. Duke's smart reusable container system with RFID tracking.

## Climate & Sustainability Make-A-Thon 2026

This project was developed for Duke University's Climate & Sustainability Make-A-Thon 2026.

## Features

- **Pre-booking System**: Reserve containers before arriving
- **Time-slot Pickup**: No lines, grab-and-go
- **RFID Tracking**: Automatic check-out/return
- **Gamification**: Rewards for consistent use
- **Real-time Stats**: Environmental impact tracking
- **Admin Dashboard**: Operations monitoring

## Tech Stack

- **Frontend**: Next.js 14, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Railway
- **UI Components**: shadcn/ui, Radix UI

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or Railway PostgreSQL)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd dukereuse360
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your database URL
```

4. Generate Prisma client:
```bash
npx prisma generate
```

5. Push database schema (development):
```bash
npx prisma db push
```

6. Seed the database:
```bash
npm run db:seed
```

7. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Demo Accounts

For the hackathon demo, use these accounts:

- **Student**: `js123` (John Smith)
- **Student**: `em456` (Emma Lee)
- **Admin**: `admin` (Admin User)

Login via: `/api/auth/login?netId=js123`

## Project Structure

```
dukereuse360/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Home page
│   ├── book/              # Booking flow
│   ├── dashboard/         # User dashboard
│   ├── admin/             # Admin dashboard
│   ├── impact/            # Environmental impact
│   └── api/               # API routes
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                   # Utilities
│   ├── prisma.ts         # Prisma client
│   ├── auth.ts           # Authentication
│   └── utils.ts          # Helpers
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed data
└── public/               # Static assets
```

## API Endpoints

### Authentication
- `GET /api/auth/login?netId=<netId>` - Mock login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/session` - Get current session

### Containers
- `GET /api/containers` - List all containers
- `PATCH /api/containers/:id/status` - Update status

### Checkouts
- `POST /api/checkouts` - Create reservation
- `GET /api/checkouts?userId=<id>` - User's checkouts
- `DELETE /api/checkouts/:id` - Cancel reservation
- `PATCH /api/checkouts/:id/pickup` - Mark picked up
- `PATCH /api/checkouts/:id/return` - Mark returned

### Locations
- `GET /api/locations` - All dining locations
- `GET /api/locations/:id/timeslots` - Available time slots

### User
- `GET /api/user/profile` - User profile and stats

### Admin
- `GET /api/admin/stats/daily` - Daily statistics
- `GET /api/admin/stats/environmental` - Impact metrics

## Deployment

### Railway

1. Create a new Railway project
2. Add PostgreSQL service
3. Connect your GitHub repository
4. Set environment variables:
   - `DATABASE_URL` (auto-set by Railway)
   - `NEXTAUTH_SECRET`
   - `NEXT_PUBLIC_APP_URL`

5. Deploy!

### Environment Variables

```env
DATABASE_URL=postgresql://...
NEXT_PUBLIC_APP_URL=https://your-app.railway.app
NEXTAUTH_URL=https://your-app.railway.app
NEXTAUTH_SECRET=your-secret-key
ENABLE_MOCK_AUTH=true
```

## Environmental Impact Calculations

Per container use:
- Disposables saved: 2 items (container + lid)
- CO2 saved: 50g
- Water saved: 4 liters
- Waste saved: 24g

## Team

**Project Lead**: Jaideep
**Competition**: Duke Climate & Sustainability Make-A-Thon 2026

## License

MIT License - See LICENSE file for details.
