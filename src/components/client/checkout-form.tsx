
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createBooking } from "@/actions/client/booking"; // Import file bạn vừa gửi
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner"; // Hiển thị thông báo
import { Loader2 } from "lucide-react";

interface CheckoutFormProps {
  userId: string;
  roomId: string;
  checkIn: string; // Truyền xuống dạng string ISO
  checkOut: string;
  totalPrice: number;
  initialName: string;
  initialEmail: string;
  initialPhone: string;
}

export const CheckoutForm = ({
  userId,
  roomId,
  checkIn,
  checkOut,
  totalPrice,
  initialName,
  initialEmail,
  initialPhone,
}: CheckoutFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // State cho các input
  const [formData, setFormData] = useState({
    guestName: initialName || "",
    guestEmail: initialEmail || "",
    guestPhone: initialPhone || "",
    note: "",
  });

  const onSubmit = () => {
    if (!formData.guestName || !formData.guestPhone || !formData.guestEmail) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    startTransition(async () => {
      // Gọi Server Action
      const result = await createBooking({
        roomId,
        userId,
        checkIn: new Date(checkIn), // Convert string sang Date object cho Zod
        checkOut: new Date(checkOut), // Convert string sang Date object cho Zod
        totalPrice,
        guestName: formData.guestName,
        guestEmail: formData.guestEmail,
        guestPhone: formData.guestPhone,
        note: formData.note,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(result.success);
        // Chuyển hướng về trang quản lý đơn
        router.push("/my-bookings");
      }
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Họ và tên người nhận phòng</Label>
        <Input 
          value={formData.guestName}
          onChange={(e) => setFormData({...formData, guestName: e.target.value})}
          placeholder="Nguyễn Văn A"
        />
      </div>

      <div className="space-y-2">
        <Label>Email liên hệ</Label>
        <Input 
          type="email"
          value={formData.guestEmail}
          onChange={(e) => setFormData({...formData, guestEmail: e.target.value})}
          placeholder="email@example.com"
        />
      </div>

      <div className="space-y-2">
        <Label>Số điện thoại</Label>
        <Input 
          value={formData.guestPhone}
          onChange={(e) => setFormData({...formData, guestPhone: e.target.value})}
          placeholder="0987..."
        />
      </div>

      <div className="space-y-2">
        <Label>Ghi chú (Tùy chọn)</Label>
        <Textarea 
          value={formData.note}
          onChange={(e) => setFormData({...formData, note: e.target.value})}
          placeholder="Ví dụ: Tôi muốn check-in sớm..." 
        />
      </div>

      <div className="pt-4">
        <Button 
          onClick={onSubmit} 
          disabled={isPending} 
          className="w-full text-lg" 
          size="lg"
        >
          {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Xác nhận đặt phòng
        </Button>
        <p className="text-xs text-center text-muted-foreground mt-2">
          Bằng việc xác nhận, bạn đồng ý với chính sách hủy phòng của chúng tôi.
        </p>
      </div>
    </div>
  );
};