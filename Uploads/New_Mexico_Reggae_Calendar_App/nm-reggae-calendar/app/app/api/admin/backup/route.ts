
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Simple password authentication
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'nmreggae2025'

// Define the Event type based on Prisma model
type Event = {
  id: string;
  date: Date;
  original_date: string | null;
  day_of_week: string;
  venue: string;
  event_name: string;
  type: string;
  tickets_url: string | null;
  city: string;
  state: string;
  country: string;
  created_at: Date;
  updated_at: Date;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const password = searchParams.get('password')

    // Check authentication
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    const events = await prisma.event.findMany({
      orderBy: [
        { date: 'asc' },
        { city: 'asc' },
      ],
    })

    // Format as CSV
    const csvHeader = 'date,original_date,day_of_week,venue,event_name,type,tickets_url,city,state,country\n'
    const csvData = events.map((event: Event) => {
      const formattedDate = event.date.toISOString().split('T')[0] // YYYY-MM-DD
      return [
        formattedDate,
        event.original_date || '',
        event.day_of_week,
        event.venue,
        `"${event.event_name}"`,
        event.type,
        event.tickets_url || '',
        event.city,
        event.state,
        event.country,
      ].join(',')
    }).join('\n')

    const csv = csvHeader + csvData

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="reggae-events-backup-${new Date().toISOString().split('T')[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error('Backup error:', error)
    return NextResponse.json(
      { error: 'Failed to create backup' },
      { status: 500 }
    )
  }
}

