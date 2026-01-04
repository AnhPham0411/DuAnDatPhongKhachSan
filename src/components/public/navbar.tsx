"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
// 1. Import hook lấy session và hàm đăng xuất
import { useSession, signOut } from "next-auth/react"; 

export const Navbar = () => {
  // 2. Lấy dữ liệu session (data) và trạng thái (status)
  const { data: session, status } = useSession();

  return (
    <div className="fixed top-0 w-full h-16 z-50 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-bold text-2xl text-blue-600">
          MyHotel.
        </Link>

        {/* Menu chính */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/" className="text-sm font-medium hover:text-blue-600">
            Trang chủ
          </Link>
          <Link href="/rooms" className="text-sm font-medium hover:text-blue-600">
            Phòng nghỉ
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-blue-600">
            Giới thiệu
          </Link>
        </div>

        {/* Khu vực hành động (Login/Logout) */}
        <div className="flex items-center space-x-2">
          
          {/* TRƯỜNG HỢP 1: Đang tải (chưa biết đã đăng nhập hay chưa) */}
          {status === "loading" && (
             <div className="animate-pulse w-20 h-8 bg-slate-200 rounded"></div>
          )}

          {/* TRƯỜNG HỢP 2: Đã đăng nhập */}
          {status === "authenticated" && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">
                Hi, {session?.user?.name || "Bạn"}
              </span>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => signOut({ callbackUrl: "/" })} // Đăng xuất xong về trang chủ
              >
                Đăng xuất
              </Button>
            </div>
          )}

          {/* TRƯỜNG HỢP 3: Chưa đăng nhập */}
          {status === "unauthenticated" && (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Đăng ký</Button>
              </Link>
            </>
          )}
          
        </div>
      </div>
    </div>
  );
};