import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'
import { prisma } from '@/lib/prisma'

// GET /api/containers/[id]/qr - Generate QR code for a container
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Verify container exists
    const container = await prisma.container.findUnique({
      where: { id }
    })

    if (!container) {
      return NextResponse.json(
        { error: 'Container not found' },
        { status: 404 }
      )
    }

    // QR code data format: DUKE-REUSE:{containerId}
    const qrData = `DUKE-REUSE:${container.id}`

    // Check if SVG format requested
    const format = request.nextUrl.searchParams.get('format')

    if (format === 'svg') {
      const svg = await QRCode.toString(qrData, {
        type: 'svg',
        width: 300,
        margin: 2,
        color: {
          dark: '#001A57', // Duke blue
          light: '#FFFFFF'
        }
      })
      return new NextResponse(svg, {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'public, max-age=31536000'
        }
      })
    }

    // Default: return as PNG data URL
    const qrDataUrl = await QRCode.toDataURL(qrData, {
      width: 300,
      margin: 2,
      color: {
        dark: '#001A57',
        light: '#FFFFFF'
      }
    })

    return NextResponse.json({
      containerId: container.id,
      qrCode: qrDataUrl,
      qrData: qrData,
      status: container.status
    })

  } catch (error) {
    console.error('QR generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    )
  }
}
