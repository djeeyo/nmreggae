# New Mexico Reggae Events Data Analysis Summary

## Overview
Successfully analyzed the CSV file `Reggae_Events_Jun-Oct_2025.csv` and created a structured JSON dataset for the New Mexico Reggae Calendar web application.

## Data Structure Analysis

### Original CSV Structure
- **Format**: Comma-separated values
- **Columns**: Date, Month, City, Venue, Event, Type, Tickets, State, Country
- **Total Records**: 12 events

### Data Quality Observations
- All events are located in New Mexico (NM), USA
- Date format: MM/DD/YY (e.g., 07/15/25)
- Some events have ticket URLs, one event has no ticket link (free outdoor show)
- Event types are primarily "Live Show" with one "Free Outdoor Show"

## Event Distribution

### By City
- **Albuquerque**: 6 events (50% of total)
- **Santa Fe**: 3 events (25% of total)
- **Las Vegas**: 2 events (16.7% of total)
- **Rio Rancho**: 1 event (8.3% of total)

### By Month
- **July**: 5 events (41.7% of total)
- **August**: 4 events (33.3% of total)
- **September**: 2 events (16.7% of total)
- **October**: 1 event (8.3% of total)

### Date Range
- **Start**: July 15, 2025
- **End**: October 2, 2025
- **Duration**: ~2.5 months

## Venues
1. **Rio Rancho Events Center** (Rio Rancho)
2. **The Bridge at Santa Fe Brewing Company** (Santa Fe) - 2 events
3. **Sandia Amphitheater** (Albuquerque)
4. **Old Town Plaza** (Albuquerque) - Free outdoor venue
5. **El Rialto Restaurant** (Las Vegas) - 2 events
6. **Revel** (Albuquerque) - 2 events
7. **Sunshine Theater** (Albuquerque)
8. **Lobo Theater** (Albuquerque)

## Notable Artists/Events
- **311** (Unity Tour 2025) - Major headliner
- **Iration** - Popular reggae band
- **Dirty Heads** - Reggae rock band
- **Maoli** - Hawaiian reggae
- **Collie Buddz** - Bermudian reggae artist
- **Michael Franti & Spearhead** - Reggae/hip-hop fusion
- **Tribal Seeds** - California reggae
- **Fortunate Youth** - California reggae
- **Nahko and Medicine for the People** - World music/reggae

## JSON Output Structure

The processed data is saved as `/home/ubuntu/reggae_events_data.json` with the following structure:

```json
{
  "metadata": {
    "title": "New Mexico Reggae Events Calendar",
    "description": "Reggae and related music events in New Mexico from June to October 2025",
    "last_updated": "timestamp",
    "data_source": "original filename"
  },
  "summary": {
    "total_events": 12,
    "date_range": {"start": "2025-07-15", "end": "2025-10-02"},
    "cities": ["Rio Rancho", "Santa Fe", "Albuquerque", "Las Vegas"],
    "venues": ["venue1", "venue2", ...],
    "months_covered": ["July", "August", "September", "October"],
    "events_by_city": {"city": count, ...},
    "events_by_month": {"month": count, ...}
  },
  "events_by_month": {
    "July": {
      "month_name": "July",
      "cities": {
        "CityName": {
          "city_name": "CityName",
          "events": [
            {
              "date": "2025-07-15",
              "original_date": "07/15/25",
              "day_of_week": "Tuesday",
              "venue": "Venue Name",
              "event_name": "Artist/Event Name",
              "type": "Live Show",
              "tickets_url": "URL or null",
              "state": "NM",
              "country": "USA"
            }
          ]
        }
      },
      "total_events": 5
    }
  }
}
```

## Web Application Considerations

### Advantages of This Structure
1. **Easy Month Navigation**: Events organized by month for calendar view
2. **City Filtering**: Events grouped by city within each month
3. **Rich Event Details**: Includes venue, date, day of week, ticket links
4. **Summary Statistics**: Quick overview data for dashboard widgets
5. **Flexible Display**: Can easily create month views, city views, or chronological lists

### Recommended Features for Web App
1. **Calendar View**: Monthly calendar with event markers
2. **List View**: Chronological or filtered event listings
3. **City Filter**: Filter events by city
4. **Venue Information**: Clickable venue details
5. **Ticket Integration**: Direct links to ticket purchasing
6. **Mobile Responsive**: Touch-friendly interface for mobile users
7. **Event Details**: Expandable event cards with full information

## Data Ready for Web Development
The JSON file is now ready to be consumed by the New Mexico Reggae Calendar web application. The structure supports multiple view types and provides all necessary data for a comprehensive event calendar experience.
