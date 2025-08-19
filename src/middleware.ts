import { type NextRequest, NextResponse } from "next/server";
// import { cookies } from "next/headers";

export async function middleware(request: NextRequest) {
  // const cookieStore = await cookies(); // Get cookies store
  // const token = cookieStore.get("token"); // Retrieve a specific cookie
  const token = request.cookies.get("token")?.value;

  const url = request.nextUrl.clone();
  const isAuthRoute = [
    "/auth/sign-in",
    "/auth/sign-up",
    "/auth/verify",
    "/auth/error",
    "/auth/forgot-password",
  ].includes(url.pathname);
  const isProtectedRoute =
    url.pathname === "/" || url.pathname.startsWith("/dashboard");

  // Prepare response early
  const res = NextResponse.next();

  // ✅ Add security headers
  res.headers.set("Cache-Control", "no-store, must-revalidate");
  res.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  res.headers.set("X-XSS-Protection", "1; mode=block");
  res.headers.set("X-Frame-Options", "SAMEORIGIN");

  // 🔐 No x-powered-by in client responses
  res.headers.delete("x-powered-by");

  // ✅ If token exists, validate it
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const isTokenExpired = payload.exp < Date.now() / 1000;

      if (isTokenExpired) {
        console.warn("Middleware - Token expired");

        // Expire the cookie immediately
        const expiredRes = NextResponse.redirect(
          new URL("/auth/sign-in", request.url)
        );
        expiredRes.cookies.set("token", "", {
          path: "/",
          expires: new Date(0),
        });
        return expiredRes;
      }

      // If user is logged in, redirect away from auth pages
      if (isAuthRoute) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    } catch (err) {
      console.error("Token decode failed:", err);
      return NextResponse.redirect(new URL("/auth/sign-in", request.url));
    }
  } else if (isProtectedRoute) {
    // 🛑 No token and accessing protected route
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  return res;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/",
    "/auth/sign-in",
    "/auth/sign-up",
    "/auth/forgot-password",
    "/auth/verify",
    "/dashboard/:path*",
    "/auth/error",
  ],
};

// import { type NextRequest, NextResponse } from "next/server";
// import { cookies } from "next/headers";

// export async function middleware(request: NextRequest) {
//   const cookieStore = await cookies(); // Get cookies store
//   const token = cookieStore.get("token"); // Retrieve a specific cookie

//   const url = request.nextUrl;
//   const res = NextResponse.next();
//   res.headers.set("Cache-Control", "no-store, must-revalidate");
//   res.headers.set(
//     "Strict-Transport-Security",
//     "max-age=63072000; includeSubDomains; preload"
//   );
//   res.headers.set("X-XSS-Protection", "1; mode=block");
//   res.headers.set("X-Frame-Options", "SAMEORIGIN");
//   res.headers.delete("x-powered-by"); // Remove "x-powered-by"

//   if (token) {
//     // ✅ Check if the token is expired
//     const isTokenExpired =
//       typeof token.value === "string" &&
//       JSON.parse(atob(token.value.split(".")[1])).exp < Date.now() / 1000; // Decode JWT and check expiration

//     if (isTokenExpired) {
//       console.warn("Middleware - Token expired:", token);

//       // ✅ Remove token by setting an empty value and expiry in the past
//       res.cookies.set("token", "", { expires: new Date(0), path: "/" });

//       return NextResponse.redirect(new URL("/auth/sign-in", request.url));
//     }

//     if (
//       [
//         "/auth/sign-in",
//         "/auth/sign-up",
//         "/auth/verify",
//         "/auth/error",
//         "/auth/forgot-password",
//       ].includes(url.pathname)
//     ) {
//       return NextResponse.redirect(new URL("/", request.url));
//     }
//   } else {
//     // If the user is not authenticated and trying to access dashboard routes, redirect to sign-in
//     if (
//       !token &&
//       (url.pathname === "/" || url.pathname.startsWith("/dashboard"))
//     ) {
//       return NextResponse.redirect(new URL("/auth/sign-in", request.url));
//     }
//   }

//   // For all other cases, allow the request to proceed
//   return NextResponse.next();
// }

// // See "Matching Paths" below to learn more
// export const config = {
//   matcher: [
//     "/",
//     "/auth/sign-in",
//     "/auth/sign-up",
//     "/auth/forgot-password",
//     "/auth/verify",
//     "/dashboard/:path*",
//     "/auth/error",
//   ],
// };