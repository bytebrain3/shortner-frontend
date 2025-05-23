import { cookies } from "next/headers";
import { NextResponse } from "next/server"; // Proper import
import { jwtVerify } from "jose";
import axiosInstance from "@/lib/axiosInstance";

export async function GET(request) {
  try {
    const cookieStore = await cookies();
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

    const res = await axiosInstance.get(`/get-all-urls/${payload.userID}`);
    if (res.status !== 200) {
      return NextResponse.json(
        { error: "Failed to fetch URLs" },
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
    console.error("Error verifying token or fetching data:", error);
    return NextResponse.json(
      { error: "Authentication or Fetching failed" },
      { status: 500 }
    );
  }
}
