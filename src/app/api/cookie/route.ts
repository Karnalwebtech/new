import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"

// Set a cookie
export async function POST(req: NextRequest) {
  const { token } = await req.json();
  const response = NextResponse.json({ success: true });

  response.cookies.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    sameSite: "strict"
  });

  return response;
}
// Delete a cookie
export async function DELETE() {
  // Get the cookies store
  const cookieStore = await cookies()
  
  // Delete the token cookie
  cookieStore.delete("token")
  
  return NextResponse.json({ success: true, message: "Token deleted" }, { status: 200 })
}