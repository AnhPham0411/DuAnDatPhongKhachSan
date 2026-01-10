import { db } from "@/lib/db";
import { CalendarClient } from "@/components/admin/calendar-client";

export default async function CalendarPage() {
  // 1. Fetch dữ liệu: Chỉ lấy các đơn không bị hủy
  const bookings = await db.booking.findMany({
    where: {
      status: { not: "CANCELLED" }
    },
    include: {
      room: true,
      user: true
    }
  });

  // 2. Transform Data: Chuyển đổi sang format Calendar
  // Quan trọng: start và end phải là đối tượng Date (Prisma trả về Date rồi nên OK)
  const events = bookings.map((b) => ({
    id: b.id,
    title: `${b.room.name} - ${b.guestName || b.user.name}`,
    start: b.checkIn,
    end: b.checkOut,
    resource: b, // Truyền nguyên object booking xuống để Client dùng hiển thị chi tiết
  }));

  return (
    <div className="h-[calc(100vh-80px)] p-8 flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
           <h1 className="text-3xl font-bold tracking-tight">Lịch biểu</h1>
           <p className="text-muted-foreground">Theo dõi lịch đặt phòng theo thời gian thực.</p>
        </div>
      </div>
      
      {/* Container chứa lịch - Chiếm phần còn lại của màn hình */}
      <div className="flex-1 min-h-0"> 
        <CalendarClient initialEvents={events} />
      </div>
    </div>
  );
}