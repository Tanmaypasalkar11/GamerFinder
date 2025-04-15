import { validateSession } from "@/app/lib/authentication";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

interface ListingInput {
  game: string;
  title: string;
  description: string;
  pricePerHour: number;
  availability: string;
  images?: string[];
  voiceIntroUrl?: string | null;
  tags?: string[];
}

export async function POST(req: Request) {
  try {
    const session = await validateSession();
    if (!session.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(session.user.id); // session.user.id should be typed as string in your next-auth.d.ts

    if (!userId || isNaN(userId)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found. Please log in again." },
        { status: 404 }
      );
    }

    const data: ListingInput = await req.json();

    const listing = await prisma.listing.create({
      data: {
        userId,
        game: data.game,
        title: data.title,
        description: data.description,
        pricePerHour: data.pricePerHour,
        availability: data.availability,
        images: data.images || [],
        voiceIntroUrl: data.voiceIntroUrl || null,
        tags: data.tags || [],
      },
    });

    return NextResponse.json(listing, { status: 201 });
  } catch (error) {
    console.error("POST /api/listings error:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const game = searchParams.get("game");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const tags = searchParams.getAll("tag");
  const sortBy = searchParams.get("sortBy"); // e.g., "pricePerHour"
  const order = searchParams.get("order") as "asc" | "desc"; // e.g., "desc"

  try {
    const listings = await prisma.listing.findMany({
      where: {
        AND: [
          game ? { game } : {},
          minPrice ? { pricePerHour: { gte: parseFloat(minPrice) } } : {},
          maxPrice ? { pricePerHour: { lte: parseFloat(maxPrice) } } : {},
          tags.length ? { tags: { hasSome: tags } } : {},
        ],
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            isOnline: true,
          },
        },
      },
      orderBy: sortBy && order ? { [sortBy]: order } : undefined,
    });

    return NextResponse.json(listings);
  } catch (error) {
    console.error("Error fetching listings:", error);
    return NextResponse.json({ message: "Failed to fetch listings" }, { status: 500 });
  }
}