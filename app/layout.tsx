import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "DukeReuse 360 - Smart Reusable Dining System",
  description: "Skip the line, save the planet. Duke's smart reusable container system with RFID tracking.",
  keywords: ["Duke University", "sustainability", "reusable containers", "RFID", "dining"],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "DukeReuse 360",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#001a57",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans bg-gray-50">
        {children}
      </body>
    </html>
  )
}
