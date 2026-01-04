"use client";

import { useState } from "react";
import { RoomWithDetails } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar"; // Cần cài shadcn calendar
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format, differenceInDays } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { createBooking } from "@/actions/create-booking"; // Sẽ tạo ở dưới
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface BookingWidgetProps {
  room: RoomWithDetails;
}

export const BookingWidget = ({ room }: BookingWidgetProps) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [date, setDate] = useState<{ from: Date; to: Date } | undefined>();
  const [loading, setLoading] = useState(false);

  // Tính toán số đêm và tổng tiền
  const days = date?.from && date?.to ? differenceInDays(date.to, date.from) : 0;
  const totalPrice = days * room.roomType.basePrice;

  const onBooking = async () => {
    if (!session) {
      toast.error("Vui lòng đăng nhập để đặt phòng!");
      router.push("/login");
      return;
    }
    if (!date?.from || !date?.to || days < 1) {
      toast.error("Vui lòng chọn ngày hợp lệ");
      return;
    }

    setLoading(true);
    const result = await createBooking({
      roomId: room.id,
      checkIn: date.from,
      checkOut: date.to,
      totalPrice: totalPrice,
    });

    setLoading(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Đặt phòng thành công!");
      router.push("/bookings"); // Trang xem lịch sử đặt phòng (User)
    }
  };

  return (
    <Card className="sticky top-20 shadow-xl border-blue-100">
      <CardHeader className="bg-slate-50 border-b">
        <CardTitle className="flex justify-between items-center text-lg">
          <span>Giá mỗi đêm</span>
          <span className="text-blue-600 font-bold">
            {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(room.roomType.basePrice)}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {/* Bộ chọn ngày */}
        <div className="space-y-2">
            <label className="text-sm font-medium">Chọn ngày nghỉ</label>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date?.from ? (
                            date.to ? (
                                <>{format(date.from, "dd/MM/yyyy")} - {format(date.to, "dd/MM/yyyy")}</>
                            ) : (
                                format(date.from, "dd/MM/yyyy")
                            )
                        ) : (
                            <span>Chọn ngày Check-in / Check-out</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date as any} // Ép kiểu tạm
                        onSelect={(range: any) => setDate(range)}
                        numberOfMonths={2}
                        disabled={(date) => date < new Date()} // Không cho chọn ngày quá khứ
                    />
                </PopoverContent>
            </Popover>
        </div>

        {/* Tạm tính */}
        {days > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg space-y-2 text-sm">
                <div className="flex justify-between">
                    <span>Thời gian</span>
                    <span className="font-medium">{days} đêm</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-blue-700 border-t border-blue-200 pt-2">
                    <span>Tổng tiền</span>
                    <span>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(totalPrice)}</span>
                </div>
            </div>
        )}

        <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700" onClick={onBooking} disabled={loading || days < 1}>
            {loading ? "Đang xử lý..." : "Xác nhận đặt phòng"}
        </Button>
      </CardContent>
    </Card>
  );
};