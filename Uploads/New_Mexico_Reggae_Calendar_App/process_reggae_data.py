import pandas as pd
import json
from datetime import datetime
import numpy as np

# Read the CSV file
df = pd.read_csv('/home/ubuntu/Uploads/Reggae_Events_Jun-Oct_2025.csv')

# Clean column names (remove extra spaces)
df.columns = df.columns.str.strip()

# Clean data in each column
for col in df.columns:
    if df[col].dtype == 'object':
        df[col] = df[col].astype(str).str.strip()

# Replace 'nan' strings with None
df = df.replace('nan', None)

# Convert date to proper datetime format
df['Date'] = pd.to_datetime(df['Date'], format='%m/%d/%y')
df['formatted_date'] = df['Date'].dt.strftime('%Y-%m-%d')
df['day_of_week'] = df['Date'].dt.strftime('%A')

# Create a structured JSON format
events_by_month = {}

for _, row in df.iterrows():
    month = row['Month']
    
    if month not in events_by_month:
        events_by_month[month] = {
            'month_name': month,
            'cities': {},
            'total_events': 0
        }
    
    city = row['City']
    if city not in events_by_month[month]['cities']:
        events_by_month[month]['cities'][city] = {
            'city_name': city,
            'events': []
        }
    
    # Create event object
    event = {
        'date': row['formatted_date'],
        'original_date': row['Date'].strftime('%m/%d/%y'),
        'day_of_week': row['day_of_week'],
        'venue': row['Venue'],
        'event_name': row['Event'],
        'type': row['Type'],
        'tickets_url': row['Tickets'] if row['Tickets'] and row['Tickets'] != 'None' else None,
        'state': row['State'],
        'country': row['Country']
    }
    
    events_by_month[month]['cities'][city]['events'].append(event)
    events_by_month[month]['total_events'] += 1

# Create summary statistics
summary = {
    'total_events': len(df),
    'date_range': {
        'start': df['Date'].min().strftime('%Y-%m-%d'),
        'end': df['Date'].max().strftime('%Y-%m-%d')
    },
    'cities': df['City'].unique().tolist(),
    'venues': df['Venue'].unique().tolist(),
    'months_covered': list(events_by_month.keys()),
    'events_by_city': df['City'].value_counts().to_dict(),
    'events_by_month': {month: data['total_events'] for month, data in events_by_month.items()}
}

# Final JSON structure
reggae_calendar_data = {
    'metadata': {
        'title': 'New Mexico Reggae Events Calendar',
        'description': 'Reggae and related music events in New Mexico from June to October 2025',
        'last_updated': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'data_source': 'Reggae_Events_Jun-Oct_2025.csv'
    },
    'summary': summary,
    'events_by_month': events_by_month
}

# Save to JSON file
with open('/home/ubuntu/reggae_events_data.json', 'w') as f:
    json.dump(reggae_calendar_data, f, indent=2, default=str)

print("Data Analysis Summary:")
print("=" * 50)
print(f"Total Events: {summary['total_events']}")
print(f"Date Range: {summary['date_range']['start']} to {summary['date_range']['end']}")
print(f"Cities: {', '.join(summary['cities'])}")
print(f"Months: {', '.join(summary['months_covered'])}")
print("\nEvents by City:")
for city, count in summary['events_by_city'].items():
    print(f"  {city}: {count} events")
print("\nEvents by Month:")
for month, count in summary['events_by_month'].items():
    print(f"  {month}: {count} events")
print("\nVenues:")
for venue in summary['venues']:
    print(f"  - {venue}")
print(f"\nJSON data saved to: /home/ubuntu/reggae_events_data.json")
