"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react"; // 1. Import useSession
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BedDouble,
  DoorOpen,
  CalendarDays,
  CalendarRange,
  Users,
  Settings,
  Star,
  MapPin,
  ListOrdered
} from "lucide-react";

const routes = [
  {
    label: "Tổng quan",
    icon: LayoutDashboard,
    href: "/admin",
    color: "text-sky-500",
    roles: ["ADMIN", "STAFF"], // 2. Thêm quyền được phép xem
  },
  {
    label: "Lịch biểu",
    icon: CalendarRange,
    href: "/admin/calendar",
    color: "text-indigo-600",
    roles: ["ADMIN", "STAFF"],
  },
  {
    label: "Đặt phòng",
    icon: CalendarDays,
    href: "/admin/bookings",
    color: "text-green-700",
    roles: ["ADMIN", "STAFF"],
  },
  {
    label: "Quản lý Phòng",
    icon: DoorOpen,
    href: "/admin/rooms",
    color: "text-violet-500",
    roles: ["ADMIN", "STAFF"],
  },
  {
    label: "Loại phòng",
    icon: BedDouble,
    href: "/admin/categories",
    color: "text-pink-700",
    roles: ["ADMIN"], // Chỉ Admin mới được cấu hình loại phòng
  },
  {
    label: "Chi nhánh",
    icon: MapPin,
    href: "/admin/locations",
    color: "text-orange-700",
    roles: ["ADMIN"], // Chỉ Admin mới được cấu hình chi nhánh
  },
  {
    label: "Tiện nghi",
    icon: ListOrdered,
    href: "/admin/amenities",
    color: "text-orange-700",
    roles: ["ADMIN"],
  },
  {
    label: "Người dùng",
    icon: Users,
    href: "/admin/users",
    color: "text-blue-700",
    roles: ["ADMIN"], // Chỉ Admin mới quản lý nhân sự
  },
  {
    label: "Đánh giá",
    icon: Star,
    href: "/admin/reviews",
    color: "text-yellow-600",
    roles: ["ADMIN", "STAFF"],
  },
  {
    label: "Cài đặt",
    icon: Settings,
    href: "/admin/settings",
    color: "text-gray-500",
    roles: ["ADMIN"],
  },
];

export const AdminSidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession(); // 3. Lấy dữ liệu session
  const userRole = session?.user?.role;

  // 4. Lọc các route dựa trên role của user
  const filteredRoutes = routes.filter((route) => 
    userRole ? route.roles.includes(userRole) : false
  );

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-slate-900 text-white w-64 border-r border-slate-800">
      <div className="px-3 py-2 flex-1">
        <Link href="/admin" className="flex items-center pl-3 mb-10">
          <div className="relative w-8 h-8 mr-4">
             {/* Bạn có thể đặt Logo ở đây */}
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Hotel Manager
          </h1>
        </Link>
        <div className="space-y-1">
          {filteredRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href || pathname.startsWith(route.href + "/") 
                  ? "text-white bg-white/10 shadow-sm" 
                  : "text-zinc-400"
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
      
      {/* 5. Tùy chọn: Hiển thị thông tin User ở dưới cùng Sidebar */}
      <div className="px-6 py-4 border-t border-slate-800">
        <div className="flex flex-col gap-y-1">
          <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Tài khoản</p>
          <p className="text-sm font-medium text-zinc-300 truncate">{session?.user?.name}</p>
          <span className="text-[10px] bg-white/10 text-zinc-400 px-2 py-0.5 rounded-full w-fit">
            {userRole}
          </span>
        </div>
      </div>
    </div>
  );
};