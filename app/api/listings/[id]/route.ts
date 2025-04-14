import { validateSession } from "@/app/lib/authentication";
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Helper to get the ID from the URL
function getListingId(req: NextRequest): string {
  return req.nextUrl.pathname.split("/").pop() || "";
}

// ✅ GET /api/listings/[id]
export async function GET(req: NextRequest) {
  try {
    const id = getListingId(req);

    const listing = await prisma.listing.findUnique({
      where: { id },
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

// ✅ PUT /api/listings/[id]
export async function PUT(req: NextRequest) {
  try {
    const session = await validateSession();
    const listingId = getListingId(req);
    const data = await req.json();

    const userId = Number(session.user?.id);
    if (!userId || isNaN(userId)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const existing = await prisma.listing.findUnique({ where: { id: listingId } });

    if (!existing) {
      return NextResponse.json({ message: "Listing not found" }, { status: 404 });
    }

    if (existing.userId !== userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const updated = await prisma.listing.update({
      where: { id: listingId },
      data,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ message: "Failed to update listing" }, { status: 500 });
  }
}

// ✅ DELETE /api/listings/[id]
export async function DELETE(req: NextRequest) {
  try {
    const listingId = decodeURIComponent(getListingId(req)).trim();
    const session = await validateSession();
    const sessionUserId = Number(session.user?.id);

    if (!sessionUserId || isNaN(sessionUserId)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const listing = await prisma.listing.findUnique({ where: { id: listingId } });

    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    if (listing.userId !== sessionUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.listing.delete({ where: { id: listingId } });

    return NextResponse.json({ message: "Listing deleted successfully" });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}