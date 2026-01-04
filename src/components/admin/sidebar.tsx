"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  BedDouble, 
  CalendarCheck, 
  Settings, 
  Tags, 
  UtensilsCrossed, 
  Users, 
  BarChart3,
  CalendarDays,
  MessageSquare
} from "lucide-react";

const routes = [
  { 
    label: "Tổng quan (Dashboard)", 
    icon: LayoutDashboard, 
    href: "/admin/dashboard", 
    color: "text-sky-500" 
  },
  { 
    label: "Sơ đồ phòng (Calendar)", // Tính năng "Killer" bạn nhắc đến
    icon: CalendarDays, 
    href: "/admin/calendar", 
    color: "text-orange-500" 
  },
  { 
    label: "Quản lý Phòng", 
    icon: BedDouble, 
    href: "/admin/rooms", 
    color: "text-violet-500" 
  },
  { 
    label: "Loại phòng", // Cần cái này để phân loại (Single, Deluxe, Suite...)
    icon: Tags, 
    href: "/admin/categories", 
    color: "text-pink-500" 
  },
  { 
    label: "Tiện nghi", // Cần cái này để làm bộ lọc (Wifi, Hồ bơi...)
    icon: UtensilsCrossed, 
    href: "/admin/amenities", 
    color: "text-emerald-500" 
  },
  { 
    label: "Đơn đặt phòng", 
    icon: CalendarCheck, 
    href: "/admin/bookings", 
    color: "text-yellow-500" 
  },
  { 
    label: "Khách hàng", // Để xem lịch sử đặt phòng của user
    icon: Users, 
    href: "/admin/users", 
    color: "text-blue-500" 
  },
  { 
    label: "Đánh giá (Reviews)", // Quản lý bình luận
    icon: MessageSquare, 
    href: "/admin/reviews", 
    color: "text-indigo-500" 
  },
  { 
    label: "Cấu hình & Giá", // Quản lý giá linh động
    icon: Settings, 
    href: "/admin/settings", 
    color: "text-gray-400" 
  },
];

export const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/admin/dashboard" className="flex items-center pl-3 mb-14">
          <div className="relative w-8 h-8 mr-4">
             {/* Bạn có thể thêm Logo ảnh vào đây nếu muốn */}
             <div className="absolute bg-blue-600 rounded-full w-full h-full animate-pulse opacity-75"></div>
          </div>
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Nút đăng xuất hoặc thông tin Admin ở dưới đáy sidebar */}
      <div className="px-3 py-2">
         <div className="p-3 rounded-lg bg-white/5 border border-white/10">
            <p className="text-xs text-zinc-400 text-center">Version 1.0.0 (Dev)</p>
         </div>
      </div>
    </div>
  );
};