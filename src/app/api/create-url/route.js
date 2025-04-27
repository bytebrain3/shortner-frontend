import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import axiosInstance from "@/lib/axiosInstance";

export async function POST(request) {
  try {
    const jsonPayload = await request.json();
    
    if (!jsonPayload) {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const cookieStore = cookies();
    const sessionCookie = cookieStore.get("token");

    if (!sessionCookie) {
      return NextResponse.json({ error: "No session found" }, { status: 401 });
    }

    const jwtSecret = process.env.JWT_TOKEN;
    if (!jwtSecret) {
      return NextResponse.json(
        { error: "JWT Secret missing" },
        { status: 500 }
      );
    }

    const { payload } = await jwtVerify(
      sessionCookie.value,
      new TextEncoder().encode(jwtSecret)
    );

    if (!payload || !payload.userID) {
      return NextResponse.json(
        { error: "Invalid token payload" },
        { status: 401 }
      );
    }

    const res = await axiosInstance.post(`/create-short-url/`, {
      ...jsonPayload,
      user_id: payload.userID
    });

    if (res.status !== 200) {
      return NextResponse.json(
        { error: "Failed to create shortened URL" },
        { status: 500 }
      );
    }

    return NextResponse.json(res.data, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error creating shortened URL:", error);
    return NextResponse.json(
      { error: "Failed to create shortened URL" },
      { status: 500 }
    );
  }
}
