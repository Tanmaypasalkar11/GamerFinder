import { validateSession } from "@/app/lib/authentication";
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

interface Params {
  params: {
    id: string; // dynamic route param
  };
}

export async function GET(req: Request, { params }: Params) {
  try {
    const session = await validateSession();

    if (!session.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(params.id);
    if (isNaN(userId)) {
      return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
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

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("GET /api/users/[id] error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}


