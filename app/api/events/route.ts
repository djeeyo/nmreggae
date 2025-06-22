export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// -----------------------------------------------------------------------------
// GET  /api/events            ?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
// -----------------------------------------------------------------------------
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate   = searchParams.get("endDate");

    const today            = new Date();
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(today.getMonth() + 6);

    const events = await prisma.event.findMany({
      where: {
        date: {
          gte: startDate ? new Date(startDate) : today,
          lte: endDate   ? new Date(endDate)   : sixMonthsFromNow,
        },
      },
      orderBy: [{ date: "asc" }, { city: "asc" }],
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 },
    );
  }
}

// -----------------------------------------------------------------------------
// POST /api/events           (JSON body)
// -----------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const event = await prisma.event.create({
      data: {
        date:         new Date(body.date),
        original_date: body.original_date,
        day_of_week:   body.day_of_week,
        venue:         body.venue,
        event_name:    body.event_name,
        type:          body.type,
        tickets_url:   body.tickets_url,
        city:          body.city,
        state:         body.state,
        country:       body.country,
      },
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 },
    );
  }
}
