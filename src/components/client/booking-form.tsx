"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format, differenceInCalendarDays, addDays } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import { toast } from "sonner"; // Giả sử bạn dùng sonner hoặc thư viện toast nào đó

interface BookingFormProps {
  roomId: string;
  basePrice: number;
  isAvailable: boolean;
}

export const BookingForm = ({ roomId, basePrice, isAvailable }: BookingFormProps) => {
  const router = useRouter();
  const [date, setDate] = useState<{ from: Date; to: Date } | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  // Tính tổng ngày và tổng tiền
  const { totalDays, totalPrice } = useMemo(() => {
    if (!date?.from || !date?.to) return { totalDays: 0, totalPrice: 0 };
    
    const days = differenceInCalendarDays(date.to, date.from);
    return {
      totalDays: days,
      totalPrice: days * basePrice
    };
  }, [date, basePrice]);

  const onBooking = async () => {
    if (!date?.from || !date?.to) return;
    setIsLoading(true);

    // Ở đây bạn sẽ gọi Server Action hoặc API để tạo Booking
    // Tạm thời mình giả lập redirect sang trang thanh toán
    try {
      const params = new URLSearchParams({
        roomId,
        checkIn: date.from.toISOString(),
        checkOut: date.to.toISOString(),
        totalPrice: totalPrice.toString(),
      });
      
      router.push(`/booking/checkout?${params.toString()}`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Chọn ngày nhận - trả phòng</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "dd/MM/yyyy")} - {format(date.to, "dd/MM/yyyy")}
                  </>
                ) : (
                  format(date.from, "dd/MM/yyyy")
                )
              ) : (
                <span>Chọn ngày</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date as any}
              onSelect={(range: any) => setDate(range)}
              numberOfMonths={2}
              disabled={(date) => date < new Date()} // Không cho chọn ngày quá khứ
            />
          </PopoverContent>
        </Popover>
      </div>

      {totalDays > 0 && (
        <div className="bg-slate-50 p-4 rounded-lg space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">{formatCurrency(basePrice)} x {totalDays} đêm</span>
            <span className="font-medium">{formatCurrency(totalPrice)}</span>
          </div>
          <div className="flex justify-between text-base font-bold pt-2 border-t">
            <span>Tổng cộng</span>
            <span className="text-primary">{formatCurrency(totalPrice)}</span>
          </div>
        </div>
      )}

      <Button 
        size="lg" 
        className="w-full text-lg" 
        onClick={onBooking}
        disabled={!isAvailable || !date?.from || !date?.to || isLoading}
      >
        {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
        {isAvailable ? "Đặt ngay" : "Tạm hết phòng"}
      </Button>
      
      {!isAvailable && (
        <p className="text-xs text-red-500 text-center">
          Phòng này hiện không khả dụng để đặt.
        </p>
      )}
    </div>
  );
};