import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function middleware(request) {
  console.log("Middleware run");

  // Correct: Await cookies()
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("token");

  const { pathname } = request.nextUrl;

  if (sessionCookie && sessionCookie.value) {
    try {
      const jwtSecret = process.env.JWT_TOKEN;
      if (!jwtSecret) {
        console.error("JWT Secret is not defined!");
        return NextResponse.redirect(new URL("/", request.url));
      }

      const { payload } = await jwtVerify(
        sessionCookie.value,
        new TextEncoder().encode(jwtSecret)
      );

      if (payload) {
        console.log("JWT Payload:", payload);

        const response = NextResponse.next();
        response.headers.set("x-user-id", payload.userID); // Notice your payload has `userID`, not `userId`
        response.headers.set("x-user-username", payload.username);

        if (pathname === "/") {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }

        return response;
      } else {
        console.error("Invalid token payload");
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (error) {
      console.error("JWT Verification failed:", error);
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  if (pathname.startsWith("/dashboard")) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/") {
    console.log("No session cookie found, allowing access to root");
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/"],
};
