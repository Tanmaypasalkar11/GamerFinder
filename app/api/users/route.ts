import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import { validateSession } from "@/app/lib/Authentication";


export async function POST(req: Request) {
  try {
    // Get data from the request body
    const { email, name, password } = await req.json();

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 409 }
      );
    }
  
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating user"},
      { status: 400 }
    );
  }
}

export async function PUT(req:Request){
  try{

    const session=await validateSession();
    const {name,password}=await req.json();

    // Check if session is valid
    if (!session.user?.email) {
      return NextResponse.json({ message: "Invalid session" }, { status: 401 });
    }
    
    const updateUser=await prisma.user.update({
      where:{
        email:session.user.email || "",
      },
      data:{
        name,
        password,
      },
    })
    return NextResponse.json(updateUser)
  }catch(error){
    return NextResponse.json({message: "Unauthorized"}, { status: 401 });
  }
}

export async function GET(req:Request){
  try{
    const session=await validateSession();

    if(!session.user?.email){
      return NextResponse.json({message: "Invalid session"}, { status: 401 });
    }

    const user=await prisma.user.findUnique({
      where:{
        email:session.user.email || "",
        
      },
      select:{
        id:true,
        name:true,
        email:true,
        isOnline:true,
        createdAt:true,
        updatedAt:true,
      }
      
    })
    console.log("SESSION DEBUG:", session);
    if(!user){
      return NextResponse.json({message:"User not found"}, { status: 404 });
    }
    console.log("HEADERS:", req.headers);
    console.log("Fetching user with email:", session.user.email);

    return NextResponse.json(user); // Return user data
  }catch(error){
    return NextResponse.json({message:"Unauthorized"}, { status: 401 });
  }
}

export async function DELETE(req:Request){
  try{
    const session=await validateSession();
    if(!session.user?.email){
      return NextResponse.json({message: "Invalid session"}, { status: 401 });
    }

  const user=await prisma.user.delete({
    where:{
      email:session.user.email || "",
    },
    select:{
      id:true,
      name:true,
      email:true,
    },
  })
  if(!user){
    return NextResponse.json({message:"User Not Found"},{status:404});
  }
  return NextResponse.json(user);
  }catch(error){
    return NextResponse.json({message:"Unauthorized"}, { status: 401 });
  }
}