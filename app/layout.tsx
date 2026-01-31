import type { Metadata } from "next"
import { cookies } from "next/headers"
import { Navbar } from "@/components/Navbar"
import "./globals.css"

export const metadata: Metadata = {
  title: "DukeReuse 360 - Smart Reusable Dining System",
  description: "Skip the line, save the planet. Duke's smart reusable container system with RFID tracking.",
  keywords: ["Duke University", "sustainability", "reusable containers", "RFID", "dining"],
}

async function getUser() {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('mock_session')
  if (!sessionCookie) return null

  try {
    const session = JSON.parse(sessionCookie.value)
    return {
      name: session.name,
      netId: session.netId,
      isAdmin: session.netId === 'admin',
    }
  } catch {
    return null
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const user = await getUser()

  return (
    <html lang="en">
      <body className="antialiased min-h-screen font-sans">
        <Navbar user={user} />
        <main>{children}</main>
        <footer className="bg-duke-navy text-white py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="font-bold text-lg mb-4">DukeReuse 360</h3>
                <p className="text-gray-300 text-sm">
                  Smart reusable dining system for Duke University.
                  Skip the line, save the planet.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4">Quick Links</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><a href="/book" className="hover:text-white">Book a Container</a></li>
                  <li><a href="/dashboard" className="hover:text-white">My Dashboard</a></li>
                  <li><a href="/impact" className="hover:text-white">Environmental Impact</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-4">Contact</h3>
                <p className="text-gray-300 text-sm">
                  Duke Dining Services<br />
                  sustainability@duke.edu
                </p>
              </div>
            </div>
            <div className="border-t border-white/20 mt-8 pt-8 text-center text-sm text-gray-300">
              <p>Climate & Sustainability Make-A-Thon 2026</p>
              <p className="mt-1">Built with Next.js, PostgreSQL, and RFID Technology</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
