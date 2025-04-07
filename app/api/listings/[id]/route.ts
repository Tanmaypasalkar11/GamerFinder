// app/api/listings/[id]/route.ts
import { validateSession } from "@/app/lib/authentication";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";


interface Params {
  params: { id: string };
}

export async function GET(req: Request, { params }: Params) {
  try {
    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    if (!listing) {
      return NextResponse.json({ message: "Listing not found" }, { status: 404 });
    }

    return NextResponse.json(listing);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching listing" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    const session = await validateSession();
    const data = await req.json();

    const existing = await prisma.listing.findUnique({ where: { id: params.id } });

    if (!existing || existing.userId !== session.user.id.toString()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const updated = await prisma.listing.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ message: "Failed to update listing" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    const session = await validateSession();
    const listing = await prisma.listing.findUnique({ where: { id: params.id } });

    if (!listing || listing.userId !== session.user.id.toString()) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    await prisma.listing.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Listing deleted" });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete listing" }, { status: 500 });
  }
}
