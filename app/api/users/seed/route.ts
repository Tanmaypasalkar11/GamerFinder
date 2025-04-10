// app/api/users/seed/route.ts
import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const user = await prisma.user.create({
      data: {
        name: "Test User",
        email: "testuser@gmail.com",
        image: "https://example.com/test.jpg",
        bio: "I love games!",
        languages: ["English"],
        games: ["Valorant"],
        hourlyRate: 10,
        isOnline: true,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json({ message: "Failed to seed user" }, { status: 500 });
  }
}
