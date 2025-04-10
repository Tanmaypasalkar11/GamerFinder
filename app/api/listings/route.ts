import { validateSession } from "@/app/lib/authentication";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

//non filter method
// export async function GET(req:Request){
//   try{
//     const listing=await prisma.listing.findMany({
//       include:{
//         user:{
//           select:{
//             id:true,
//             name:true,
//             image:true,
//           }
//         }
//       }
//     });
//     return NextResponse.json(listing)
//   }catch(error){
//     console.error("GET /api/listings error:", error);
//     return NextResponse.json({ message: "Server error" }, { status: 500 });
//   }
// }

export async function POST(req: Request) {
  try {
    const session =await validateSession();
    if (!session.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const userId = parseInt(session.user?.id); // Ensure it's an integer

    if (!userId || isNaN(userId)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Ensure user exists in DB
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found. Please log in again." },
        { status: 404 }
      );
    }

    const data = await req.json();

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
  } catch (error: any) {
    console.error("POST /api/listings error:", error);
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

  // this is filter method
  export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
  const game = searchParams.get("game");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const tags = searchParams.getAll("tag"); // support multiple ?tag=Chill&tag=Tryhard

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
    });

    return NextResponse.json(listings);
  } catch (error) {
    console.error("Error fetching listings:", error);
    return NextResponse.json({ message: "Failed to fetch listings" }, { status: 500 });
  }
}