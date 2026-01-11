import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Search, Bed, Users, X, MapPin, Building2 } from "lucide-react";
import { StatusBadge } from "@/components/admin/status-badge";
import { RoomActions } from "@/components/admin/room-actions";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Định nghĩa Interface cho Next.js 15 Props
// searchParams phải là một Promise
interface RoomsPageProps {
  searchParams: Promise<{ query?: string }>;
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};

export default async function RoomsPage({ searchParams }: RoomsPageProps) {
  // 1. Giải nén searchParams (Cần thiết cho Next.js 15)
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.query || "";

  // 2. Fetch dữ liệu từ DB
  // Lưu ý: Đã bỏ mode: "insensitive" vì SQLite không hỗ trợ
  const rooms = await db.room.findMany({
    where: {
      OR: [
        { name: { contains: query } },
        { roomType: { name: { contains: query } } },
        { roomType: { location: { name: { contains: query } } } },
      ],
    },
    include: { 
      roomType: {
        include: {
            location: true 
        }
      },
      images: true, 
    },
    orderBy: { createdAt: "desc" },
  });

  const totalRooms = rooms.length;
  const activeRooms = rooms.filter(r => r.isAvailable).length;

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex overflow-y-auto">
      
      {/* 1. HEADER SECTION */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Quản lý Phòng</h2>
          <p className="text-muted-foreground">
            Danh sách phòng trên toàn hệ thống chuỗi <span className="font-semibold text-foreground">Ha Long Stay</span>.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Link href="/admin/rooms/new">
            <Button size="sm" className="h-9">
              <Plus className="mr-2 h-4 w-4" /> Thêm phòng mới
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. TOOLBAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-1 rounded-lg">
        <div className="flex w-full sm:w-auto items-center space-x-2">
          <form className="relative w-full sm:w-[350px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              name="query"
              placeholder="Tìm theo tên phòng, loại phòng hoặc khách sạn..."
              className="pl-8 h-9"
              defaultValue={query}
            />
          </form>
          {query && (
            <Link href="/admin/rooms">
              <Button variant="ghost" size="sm" className="h-9 px-2 lg:px-3">
                Reset <X className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-100 px-3 py-1.5 rounded-md">
            <Building2 className="h-4 w-4" />
            <span>Tổng: <strong>{totalRooms}</strong> phòng</span>
            <span className="mx-1">|</span>
            <span className="text-green-600">Sẵn sàng: <strong>{activeRooms}</strong></span>
        </div>
      </div>

      {/* 3. DATA TABLE */}
      <div className="rounded-md border bg-white shadow-sm overflow-x-auto">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[80px]">Ảnh</TableHead>
              <TableHead className="min-w-[150px]">Tên phòng</TableHead>
              <TableHead className="min-w-[150px]">Chi nhánh</TableHead>
              <TableHead className="min-w-[150px]">Loại phòng</TableHead>
              <TableHead>Sức chứa</TableHead>
              <TableHead className="text-right">Giá / đêm</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rooms.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-[400px] text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                      <Bed className="h-10 w-10 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold">Không tìm thấy phòng nào</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                      {query 
                        ? `Không có kết quả nào cho "${query}".`
                        : "Hệ thống chưa có dữ liệu phòng."}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              rooms.map((room) => (
                <TableRow key={room.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell>
                    <Avatar className="h-10 w-10 rounded-lg border">
                        <AvatarImage src={room.images[0]?.url} className="object-cover" />
                        <AvatarFallback className="rounded-lg bg-slate-100 text-slate-400">
                            <Bed className="h-5 w-5" />
                        </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                        <span className="font-medium text-slate-900">{room.name}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">
                            ID: {room.id.slice(-4).toUpperCase()}
                        </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-blue-700 font-medium">
                        <MapPin className="h-3.5 w-3.5" />
                        {room.roomType.location?.name || "Chưa cập nhật"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-normal bg-slate-50 text-slate-600">
                      {room.roomType.name}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-slate-600 text-sm">
                      <Users className="h-3.5 w-3.5 text-slate-400" />
                      <span>{room.roomType.capacity} người</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-bold text-slate-900">
                    {formatPrice(Number(room.roomType.basePrice))}
                  </TableCell>
                  <TableCell>
                    <StatusBadge isAvailable={room.isAvailable} />
                  </TableCell>
                  <TableCell className="text-right">
                    <RoomActions id={room.id} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}