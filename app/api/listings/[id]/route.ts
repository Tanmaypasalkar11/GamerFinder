// app/api/listings/[id]/route.ts
import { validateSession } from "@/app/lib/authentication";
import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// Params is now always async — must be awaited
export async function GET(req: Request, { params }: { params: { id: string } }) {
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

export async function PUT(req: Request, context: { params: { id: string } }) {
  try {
    const session = await validateSession();
    const { id } = context.params;
    const data = await req.json();

    const existing = await prisma.listing.findUnique({ where: { id } });

    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 });
    }

    const updated = await prisma.listing.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ message: "Failed to update listing" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const listingId = decodeURIComponent(params.id).trim();
    // 🧼 Trim to remove any accidental newline/space
    console.log("Listing ID:", listingId);

    const session = await validateSession();
    const sessionUserId = parseInt(session.user?.id);
    if (!sessionUserId || isNaN(sessionUserId)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ Actually fetch from database
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });
    
    const allListings = await prisma.listing.findMany();
    console.log("All listings:", allListings);
    
    console.log("Fetched listing:", listing);
    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    if (listing.userId !== sessionUserId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    await prisma.listing.delete({
      where: { id: listingId },
    });

    return NextResponse.json({ message: "Listing deleted successfully" });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


