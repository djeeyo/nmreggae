
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Get events with rolling 6-month filter
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Default to next 6 months from today
    const today = new Date()
    const sixMonthsFromNow = new Date()
    sixMonthsFromNow.setMonth(today.getMonth() + 6)

    const events = await prisma.event.findMany({
      where: {
        date: {
          gte: startDate ? new Date(startDate) : today,
          lte: endDate ? new Date(endDate) : sixMonthsFromNow,
        },
      },
      orderBy: [
        { date: 'asc' },
        { city: 'asc' },
      ],
    })

    return NextResponse.json({ events })
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

// Create new event
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      date,
      original_date,
      day_of_week,
      venue,
      event_name,
      type,
      tickets_url,
      city,
      state,
      country,
    } = body

    const event = await prisma.event.create({
      data: {
        date: new Date(date),
        original_date,
        day_of_week,
        venue,
        event_name,
        type,
        tickets_url,
        city,
        state,
        country,
      },
    })

    return NextResponse.json({ event }, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
}
