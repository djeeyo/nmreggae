
import { PrismaClient } from '@prisma/client'
import reggaeEventsData from '../data/reggae-events.json'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting database seed...')

  // Clear existing events
  await prisma.event.deleteMany()
  console.log('Cleared existing events')

  // Process each month's events
  const events = []
  
  for (const [monthName, monthData] of Object.entries(reggaeEventsData.events_by_month)) {
    console.log(`Processing ${monthName}...`)
    
    for (const [cityName, cityData] of Object.entries(monthData.cities)) {
      for (const event of cityData.events) {
        events.push({
          date: new Date(event.date),
          original_date: event.original_date,
          day_of_week: event.day_of_week,
          venue: event.venue,
          event_name: event.event_name,
          type: event.type,
          tickets_url: event.tickets_url,
          city: cityName,
          state: event.state,
          country: event.country,
        })
      }
    }
  }

  // Insert all events
  const result = await prisma.event.createMany({
    data: events,
  })

  console.log(`✅ Seeded ${result.count} events to the database`)
  
  // Verify the data
  const count = await prisma.event.count()
  console.log(`📊 Total events in database: ${count}`)
  
  const eventsByCity = await prisma.event.groupBy({
    by: ['city'],
    _count: {
      city: true,
    },
  })
  
  console.log('📍 Events by city:')
  eventsByCity.forEach(({ city, _count }) => {
    console.log(`  ${city}: ${_count.city} events`)
  })
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
