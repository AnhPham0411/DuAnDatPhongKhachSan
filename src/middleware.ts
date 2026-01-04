import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAuthRoute = req.nextUrl.pathname.startsWith("/login") || req.nextUrl.pathname.startsWith("/register");
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

  // Nếu đã login mà vào trang login -> đẩy về trang chủ
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Nếu chưa login hoặc không phải admin mà vào trang admin -> đẩy về login
  if (isAdminRoute) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login", req.url));
    
    // --- SỬA DÒNG NÀY (Thêm dấu ? trước .role) ---
    if (req.auth?.user?.role !== "ADMIN") { 
        return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};