import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export async function middleware(request) {
  console.log("Middleware run");

  // Get cookies
  const cookie = await cookies();
  let sessionCookie = cookie.get("token");

  // Get the pathname of the current request
  const { pathname } = request.nextUrl;

  // If the user is already logged in (session cookie is present), redirect to the dashboard
  if (sessionCookie && sessionCookie.value) {
    try {
      const jwtSecret = process.env.JWT_TOKEN; // Make sure this is set properly
      if (!jwtSecret) {
        console.error("JWT Secret is not defined!");
        return NextResponse.redirect(new URL("/", request.url));
      }

      // Verify the token if it's found in the cookie
      const { payload } = await jwtVerify(
        sessionCookie.value,
        new TextEncoder().encode(jwtSecret)
      );

      if (payload) {
        console.log("JWT Payload:", payload);

        // Attach user data (ID and Username) to the request headers
        const headers = new Headers(request.headers);
        headers.set("x-user-id", payload.userId); // Assuming 'userId' is in the payload
        headers.set("x-user-username", payload.username); // Assuming 'username' is in the payload

        // Create a new response with the modified headers
        const modifiedRequest = new Request(request.url, {
          method: request.method,
          headers: headers,
          body: request.body,
          redirect: "manual",
        });

        // If the user tries to access the root page ("/"), redirect them to the dashboard
        if (pathname === "/") {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }

        // Otherwise, allow access
        return NextResponse.next();
      } else {
        console.error("Invalid token payload");
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (error) {
      console.error("JWT Verification failed:", error);
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // If the session cookie is not found or it's invalid, proceed with the route logic
  // For protected routes like /dashboard, check if the session cookie exists
  if (pathname.startsWith("/dashboard")) {
    if (!sessionCookie) {
      // If not authenticated, redirect to login page.
      return NextResponse.redirect(new URL("/", request.url));
    }
    // If authenticated, allow access.
    return NextResponse.next();
  }

  // If the user is not authenticated and trying to access the root page ("/"), allow access
  if (pathname === "/") {
    console.log("No session cookie found, allowing access to root");
    return NextResponse.next();
  }

  // For any other routes, just allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/"], // Matches /dashboard and the root /
};
