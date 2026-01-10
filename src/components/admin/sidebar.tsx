"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  BedDouble,
  DoorOpen,
  CalendarDays, // Dùng cho Đặt phòng (List)
  CalendarRange, // 👇 Import thêm icon này cho Lịch biểu (Gantt)
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
  },
  {
    label: "Lịch biểu", // 👇 MỚI: Thêm mục này
    icon: CalendarRange,
    href: "/admin/calendar",
    color: "text-indigo-600",
  },
  {
    label: "Đặt phòng", // Dạng danh sách
    icon: CalendarDays,
    href: "/admin/bookings",
    color: "text-green-700",
  },
  {
    label: "Quản lý Phòng",
    icon: DoorOpen,
    href: "/admin/rooms",
    color: "text-violet-500",
  },
  {
    label: "Loại phòng",
    icon: BedDouble,
    href: "/admin/categories",
    color: "text-pink-700",
  },
  {
    label: "Chi nhánh", // Hoặc để là "Địa điểm"
    icon: MapPin,       // Sửa BedDouble -> MapPin
    href: "/admin/location",
    color: "text-orange-700", // Đổi màu cam hoặc xanh cho khác biệt với màu phòng
},
  {
    label: "Tiện nghi",
    icon: ListOrdered,
    href: "/admin/amenities",
    color: "text-orange-700",
  },
  {
    label: "Người dùng",
    icon: Users,
    href: "/admin/users",
    color: "text-blue-700",
  },
  {
    label: "Đánh giá",
    icon: Star,
    href: "/admin/reviews",
    color: "text-yellow-600",
  },
  {
    label: "Cài đặt",
    icon: Settings,
    href: "/admin/settings",
    color: "text-gray-500",
  },
];

export const AdminSidebar = () => {
  const pathname = usePathname();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-slate-900 text-white w-64 border-r border-slate-800">
      <div className="px-3 py-2 flex-1">
        <Link href="/admin" className="flex items-center pl-3 mb-14">
          <h1 className="text-2xl font-bold text-white">
            Hotel Admin
          </h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href || pathname.startsWith(route.href + "/") 
                  ? "text-white bg-white/10" 
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
    </div>
  );
};