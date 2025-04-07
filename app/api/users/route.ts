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

export async function PUT(req:Request){
  try{
    const session=await validateSession();
    const email=session.user?.email;

    if(!email){
      return NextResponse.json({message:"Unauthorized"},{status:401})
    }
    const data=await req.json();

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

  }catch(error){
    return NextResponse.json({message:"Error updating user" }, { status: 400 });
  }
}

export async function DELETE(req:Request){
  try{
    const session=await validateSession();
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
  } catch (error) {
    console.error("DELETE /api/users/me error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}


//done with filter method 
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const game = searchParams.get("game");
  const language = searchParams.get("language");

  try {
    const users = await prisma.user.findMany({
      where: {
        AND: [
          {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { bio: { contains: search, mode: "insensitive" } },
            ],
          },
          game ? { games: { has: game } } : {},
          language ? { languages: { has: language } } : {},
        ],
      },
      select: {
        id: true,
        name: true,
        image: true,
        bio: true,
        languages: true,
        games: true,
        hourlyRate: true,
        isOnline: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching users" }, { status: 500 });
  }
}
