
export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { parse } from 'csv'

const prisma = new PrismaClient()

// Simple password authentication
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'nmreggae2025'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const password = formData.get('password') as string
    const preview = formData.get('preview') === 'true'

    // Check authentication
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      )
    }

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    const csvText = await file.text()
    const events: any[] = []
    
    return new Promise<NextResponse>((resolve) => {
      parse(csvText, {
        columns: true,
        skip_empty_lines: true,
      }, async (err, records) => {
        if (err) {
          resolve(NextResponse.json(
            { error: 'Failed to parse CSV' },
            { status: 400 }
          ))
          return
        }

        // Transform CSV records to event format
        for (const record of records) {
          const dateStr = record.date || record.Date
          const eventDate = new Date(dateStr)
          
          if (isNaN(eventDate.getTime())) {
            continue // Skip invalid dates
          }

          const event = {
            date: eventDate,
            original_date: record.original_date || record.Original_Date || dateStr,
            day_of_week: record.day_of_week || record.Day_of_Week || eventDate.toLocaleDateString('en-US', { weekday: 'long' }),
            venue: record.venue || record.Venue || '',
            event_name: record.event_name || record.Event_Name || record.name || record.Name || '',
            type: record.type || record.Type || 'Live Show',
            tickets_url: record.tickets_url || record.Tickets_URL || record.url || record.URL || null,
            city: record.city || record.City || '',
            state: record.state || record.State || 'NM',
            country: record.country || record.Country || 'USA',
          }

          events.push(event)
        }

        if (preview) {
          // Return preview without saving
          resolve(NextResponse.json({ 
            events,
            count: events.length,
            preview: true 
          }))
        } else {
          try {
            // Backup current data
            const backup = await prisma.event.findMany()
            
            // Clear and insert new data
            await prisma.event.deleteMany()
            const result = await prisma.event.createMany({
              data: events,
            })

            resolve(NextResponse.json({ 
              success: true,
              count: result.count,
              backup: backup.length,
              message: `Successfully uploaded ${result.count} events` 
            }))
          } catch (error) {
            console.error('Database error:', error)
            resolve(NextResponse.json(
              { error: 'Failed to save events to database' },
              { status: 500 }
            ))
          }
        }
      })
    })
  } catch (error) {
    console.error('CSV upload error:', error)
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    )
  }
}
