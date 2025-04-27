import { cookies } from "next/headers";
import { jwtVerify } from "jose";
import axiosInstance from "@/lib/axiosInstance";
export async function GET(request) {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get("token");

    if (!sessionCookie) {
      return Response.json({ error: "No session found" }, { status: 401 });
    }

    const jwtSecret = process.env.JWT_TOKEN;
    if (!jwtSecret) {
      return Response.json({ error: "JWT Secret missing" }, { status: 500 });
    }

    const { payload } = await jwtVerify(
      sessionCookie.value,
      new TextEncoder().encode(jwtSecret)
    );

    if (!payload) {
      return Response.json({ error: "Invalid Token" }, { status: 401 });
    }

    const res = await axiosInstance.get(`/get-all-urls/${payload.userID}`);
    if (res.status !== 200) {
      return Response.json({ error: "Failed to fetch URLs" }, { status: 500 });
    }
    return Response.json(res.data, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  } catch (error) {
    console.error("Error verifying token:", error);
    return Response.json({ error: "Authentication failed" }, { status: 500 });
  }
}
