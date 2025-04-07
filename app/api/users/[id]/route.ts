import { validateSession } from "@/app/lib/authentication";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

interface Params {
  params:{
    id:number
  };
}

export async function GET(req:Request,{params}:Params){
  try{
    //validate kar bhau
    const session =await validateSession();
    //cross check kar bhau
    if (!session.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const user=prisma.user.findUnique({
      where:{
        id:params.id
      },select:{
        id: true,
        name: true,
        image: true,
        bio: true,
        languages: true,
        games: true,
        hourlyRate: true,
        isOnline: true,
        createdAt: true,
      },
    });
    if(!user){
      return NextResponse.json({message:"User not found"},{status:404})
    };

    return NextResponse.json(user);

  }catch(error){
    console.error("GET /api/users/[id] error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
