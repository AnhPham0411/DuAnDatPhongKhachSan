"use client";

import { useState } from "react";
import { Calendar, dateFnsLocalizer, View, Views } from "react-big-calendar";
import format from "date-fns/format";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import getDay from "date-fns/getDay";
import { vi } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css"; // Import CSS gốc

import { Booking, Room, User } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Clock, User as UserIcon, Bed, CalendarDays } from "lucide-react";

// 1. Cấu hình Localizer cho tiếng Việt
const locales = {
  vi: vi,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Định nghĩa kiểu dữ liệu sự kiện
interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: Booking & { room: Room; user: User }; // Dữ liệu gốc để hiển thị chi tiết
}

interface CalendarClientProps {
  initialEvents: CalendarEvent[];
}

export const CalendarClient = ({ initialEvents }: CalendarClientProps) => {
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState(new Date());
  
  // State cho Modal chi tiết
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // 2. Xử lý click vào sự kiện
  const onSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsOpen(true);
  };

  // 3. Tùy chỉnh màu sắc sự kiện dựa trên trạng thái Booking
  const eventPropGetter = (event: CalendarEvent) => {
    const status = event.resource.status;
    let className = "";

    switch (status) {
      case "CONFIRMED":
        className = "bg-blue-600 border-blue-700 text-white";
        break;
      case "CHECKED_IN":
        className = "bg-emerald-600 border-emerald-700 text-white";
        break;
      case "CHECKED_OUT":
        className = "bg-slate-500 border-slate-600 text-white opacity-70";
        break;
      case "PENDING":
        className = "bg-yellow-500 border-yellow-600 text-white";
        break;
      default:
        className = "bg-gray-500 text-white";
    }

    return { className: `rounded-md px-2 text-xs font-medium border ${className}` };
  };

  return (
    <>
      <div className="h-full w-full bg-white rounded-xl shadow-sm border p-4">
        <Calendar
          localizer={localizer}
          events={initialEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }} // Quan trọng để lịch hiện full chiều cao
          culture="vi"
          views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
          view={view}
          date={date}
          onView={(view) => setView(view)}
          onNavigate={(date) => setDate(date)}
          onSelectEvent={onSelectEvent}
          eventPropGetter={eventPropGetter}
          messages={{
            next: "Sau",
            previous: "Trước",
            today: "Hôm nay",
            month: "Tháng",
            week: "Tuần",
            day: "Ngày",
            agenda: "Lịch trình",
            date: "Ngày",
            time: "Thời gian",
            event: "Sự kiện",
            noEventsInRange: "Không có sự kiện nào trong khoảng thời gian này.",
          }}
        />
      </div>

      {/* Modal Chi tiết Đặt phòng */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chi tiết Đặt phòng</DialogTitle>
            <DialogDescription>Mã đơn: <span className="font-mono">{selectedEvent?.id.slice(-6).toUpperCase()}</span></DialogDescription>
          </DialogHeader>
          
          {selectedEvent && (
            <div className="space-y-4">
               {/* Thông tin phòng */}
               <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border">
                  <div className="flex items-center gap-3">
                     <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center border shadow-sm">
                        <Bed className="h-5 w-5 text-indigo-600" />
                     </div>
                     <div>
                        <p className="font-medium text-sm">Phòng</p>
                        <p className="font-bold text-lg">{selectedEvent.resource.room.name}</p>
                     </div>
                  </div>
                  <Badge variant="secondary">{selectedEvent.resource.status}</Badge>
               </div>

               {/* Thông tin khách & Thời gian */}
               <div className="grid grid-cols-2 gap-4">
                  <Card className="p-3 space-y-1 shadow-none border-dashed">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs">
                         <UserIcon className="h-3 w-3" /> Khách hàng
                      </div>
                      <p className="font-medium truncate">
                         {selectedEvent.resource.guestName || selectedEvent.resource.user.name}
                      </p>
                  </Card>
                  
                  <Card className="p-3 space-y-1 shadow-none border-dashed">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs">
                         <Clock className="h-3 w-3" /> Tổng tiền
                      </div>
                      <p className="font-medium text-green-600">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(selectedEvent.resource.totalPrice))}
                      </p>
                  </Card>
               </div>

               <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                     <CalendarDays className="h-4 w-4" /> Thời gian lưu trú
                  </div>
                  <div className="grid grid-cols-2 text-center divide-x border rounded-md py-2">
                      <div>
                         <p className="text-xs text-muted-foreground">Check-in</p>
                         <p className="font-semibold text-sm">
                            {format(selectedEvent.start, "dd/MM/yyyy HH:mm")}
                         </p>
                      </div>
                      <div>
                         <p className="text-xs text-muted-foreground">Check-out</p>
                         <p className="font-semibold text-sm">
                            {format(selectedEvent.end, "dd/MM/yyyy HH:mm")}
                         </p>
                      </div>
                  </div>
               </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};