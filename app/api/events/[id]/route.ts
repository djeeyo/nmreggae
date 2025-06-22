import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// -----------------------------------------------------------------------------
// GET /api/events/:id
// -----------------------------------------------------------------------------
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  const event = await prisma.event.findUnique({ where: { id: params.id } });

  if (!event)
    return NextResponse.json({ error: "Event not found" }, { status: 404 });

  return NextResponse.json({ event });
}

// -----------------------------------------------------------------------------
// PUT /api/events/:id         (JSON body)
// -----------------------------------------------------------------------------
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const data  = await req.json();
  const event = await prisma.event.update({
    where: { id: params.id },
    data,
  });

  return NextResponse.json({ event });
}

// -----------------------------------------------------------------------------
// DELETE /api/events/:id
// -----------------------------------------------------------------------------
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  await prisma.event.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}

