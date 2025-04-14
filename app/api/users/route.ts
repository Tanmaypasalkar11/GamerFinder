import { validateSession } from "@/app/lib/authentication";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

//non filter method
// export async function GET(req:Request){
//   try{
//     const session=await validateSession();
//     const email=session.user?.email;

//     if(!email){
//       return NextResponse.json({message:"Unauthorized"},{status:401})
//     }
//   const user=await prisma.user.findUnique({
//     where:{email},
//     select:{
//       id: true,
//       name: true,
//       image: true,
//       bio: true,
//       languages: true,
//       games: true,
//       hourlyRate: true,
//       isOnline: true,
//       createdAt: true
//     }
//   })

//   if(!user){
//     return NextResponse.json({messgae:"User Not Found"},{status:404})
//   }
//   return NextResponse.json(user)
//   }catch(error){
//     console.log(error)
//     return NextResponse.json({message:"Server Error"},{status:500})
//   }
// }

interface UserData {
  id?: string;
  name?: string;
  bio?: string;
  image?: string;
  email?: string;
  languages?: string[];
  games?: string[];
  hourlyRate?: number;
  isOnline?: boolean;
  createdAt?: Date;
}

export async function PUT(req:Request){
  try{
    const session = await validateSession();
    const email=session.user?.email;

    if(!email){
      return NextResponse.json({message:"Unauthorized"},{status:401})
    }

   //partial is used means fakta kay kay feild update kar
    const data: Partial<UserData> = await req.json();

    const updatedUser = await prisma.user.update({
      where: { email },
      data: {
        name: data.name,
        bio: data.bio,
        image: data.image,
        languages: data.languages,
        games: data.games,
        hourlyRate: data.hourlyRate,
      },
    });
    return NextResponse.json(updatedUser)

  }catch (error) {
    console.error("PUT /api/users error:", error);
    return NextResponse.json({ message: "Error updating user" }, { status: 400 });
  }  
}

export async function DELETE(){
  try{
    const session = await validateSession();   
    const email=session.user?.email;

    if(!email){
      return NextResponse.json({message:"Unauthorized"},{status:401})
    }

    const deletedUser=await prisma.user.delete({
      where:{email},
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json({
      message: "User deleted successfully",
      deletedUser,
    });
  }catch (error) {
    console.error("DELETE /api/users error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }  
}


//done with filter method 
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const game = searchParams.get("game");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const tags = searchParams.getAll("tag");
  const sortBy = searchParams.get("sortBy");
  const order = searchParams.get("order") as "asc" | "desc";

  const take = parseInt(searchParams.get("take") || "10"); // default 10
  const skip = parseInt(searchParams.get("skip") || "0");  // default 0

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
      take,
      skip,
    });

    const totalCount = await prisma.listing.count({
      where: {
        AND: [
          game ? { game } : {},
          minPrice ? { pricePerHour: { gte: parseFloat(minPrice) } } : {},
          maxPrice ? { pricePerHour: { lte: parseFloat(maxPrice) } } : {},
          tags.length ? { tags: { hasSome: tags } } : {},
        ],
      },
    });

    return NextResponse.json({
      listings,
      totalCount,
      pageInfo: {
        take,
        skip,
        hasMore: skip + take < totalCount,
      },
    });
  } catch (error) {
    console.error("Error fetching listings:", error);
    return NextResponse.json({ message: "Failed to fetch listings" }, { status: 500 });
  }
}

