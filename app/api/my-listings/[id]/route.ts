import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { validateSession } from "@/app/lib/authentication";

// ✅ GET listing by ID
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
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
    console.error("GET error:", error);
    return NextResponse.json({ message: "Error fetching listing" }, { status: 500 });
  }
}

// ✅ UPDATE listing by ID
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await validateSession();
    const sessionUserId = Number(session.user?.id);
    const body = await req.json();

    if (!sessionUserId || isNaN(sessionUserId)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const existing = await prisma.listing.findUnique({
      where: { id: params.id },
    });

    if (!existing) {
      return NextResponse.json({ message: "Listing not found" }, { status: 404 });
    }

    if (existing.userId !== sessionUserId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const updated = await prisma.listing.update({
      where: { id: params.id },
      data: {
        ...body,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ message: "Failed to update listing" }, { status: 500 });
  }
}

// ✅ DELETE listing by ID
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await validateSession();
    const sessionUserId = Number(session.user?.id);

    if (!sessionUserId || isNaN(sessionUserId)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const listing = await prisma.listing.findUnique({
      where: { id: params.id },
    });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    if (listing.userId !== sessionUserId) {
      console.warn("Unauthorized delete attempt:", {
        listingId: params.id,
        sessionUserId,
        listingOwnerId: listing.userId,
      });
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.listing.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Listing deleted successfully" });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
