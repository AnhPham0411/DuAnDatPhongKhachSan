"use client";

import { useState } from "react";
import { toast } from "sonner";
import { 
  MoreHorizontal, 
  CheckCircle2, 
  XCircle, 
  LogIn, 
  LogOut, 
  CreditCard,
  Trash2,
  Copy,
  QrCode // Import icon QR
} from "lucide-react";
import { BookingStatus, PaymentStatus } from "@prisma/client";
import { PaymentQRModal } from "@/components/admin/payment-qr-modal"; // Import Component QR
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"; // Import Dialog gốc nếu cần custom

import { updateBookingStatus, updatePaymentStatus, deleteBooking } from "@/actions/admin/bookings";

interface BookingActionsProps {
  id: string;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  totalPrice: number; // Cần thêm giá tiền để tạo QR
  guestName: string;  // Cần tên khách để hiển thị trên QR Modal
}

export const BookingActions = ({ id, status, paymentStatus, totalPrice, guestName }: BookingActionsProps) => {
  const [loading, setLoading] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false); // State điều khiển Modal QR

  const onCopy = () => {
    navigator.clipboard.writeText(id);
    toast.success("Đã copy mã đơn");
  };

  const onUpdateStatus = async (newStatus: BookingStatus) => {
    setLoading(true);
    const res = await updateBookingStatus(id, newStatus);
    if (res.error) toast.error(res.error);
    else toast.success(res.success);
    setLoading(false);
  };

  const onUpdatePayment = async (newStatus: PaymentStatus) => {
    setLoading(true);
    const res = await updatePaymentStatus(id, newStatus);
    if (res.error) toast.error(res.error);
    else toast.success(res.success);
    setLoading(false);
  };

  const onDelete = async () => {
    if (!confirm("Bạn chắc chắn muốn xóa đơn này?")) return;
    setLoading(true);
    const res = await deleteBooking(id);
    if (res.error) toast.error(res.error);
    else toast.success(res.success);
    setLoading(false);
  };

  return (
    <>
      {/* 1. Đặt PaymentQRModal ở đây nhưng ẩn đi (hoặc điều khiển qua state) */}
      {/* Tuy nhiên PaymentQRModal hiện tại đang tự quản lý state isOpen bên trong nó thông qua Trigger. 
          Để gọi được từ Dropdown Item, ta cần sửa nhẹ PaymentQRModal hoặc dùng cách thủ công sau: 
      */}
      
      {/* Cách tối ưu: Render Modal riêng biệt và điều khiển bằng state */}
      {showQrModal && (
        <PaymentQRModal 
            bookingId={id} 
            amount={totalPrice} 
            guestName={guestName} 
            // Chúng ta cần sửa PaymentQRModal để nhận props isOpen/onOpenChange từ bên ngoài nếu muốn clean nhất.
            // Nhưng để nhanh gọn, ta có thể render nó dưới dạng "Controlled Component" hoặc sửa lại PaymentQRModal một chút.
            // Ở đây tôi giả định bạn sẽ dùng prop isOpen (cần sửa PaymentQRModal) HOẶC 
            // Dùng cách trick: Render nút Trigger ẩn đi và click nó bằng ref (hơi hacky).
            
            // GIẢI PHÁP TỐT NHẤT: Sửa file BookingActions này để hiển thị Dialog content trực tiếp hoặc sửa PaymentQRModal.
            // Dưới đây tôi sẽ dùng cách Import DialogContent của PaymentQRModal vào đây.
        />
      )}

      {/* --- GIẢI PHÁP THỰC TẾ: Wrapper Modal --- */}
      {/* Chúng ta sẽ render PaymentQRModal ở chế độ "Controlled" (cần sửa component con) hoặc đơn giản là hiển thị nó khi state bật */}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
          <DropdownMenuItem onClick={onCopy} className="cursor-pointer">
            <Copy className="mr-2 h-4 w-4" /> Copy Mã đơn
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {/* Nhóm Trạng thái Phòng */}
          <DropdownMenuLabel className="text-xs text-muted-foreground">Quy trình phòng</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onUpdateStatus("CONFIRMED")} disabled={loading || status === "CONFIRMED"}>
            <CheckCircle2 className="mr-2 h-4 w-4 text-blue-600" /> Xác nhận đơn
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus("CHECKED_IN")} disabled={loading || status === "CHECKED_IN"}>
            <LogIn className="mr-2 h-4 w-4 text-green-600" /> Khách nhận phòng
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus("CHECKED_OUT")} disabled={loading || status === "CHECKED_OUT"}>
            <LogOut className="mr-2 h-4 w-4 text-purple-600" /> Khách trả phòng
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatus("CANCELLED")} disabled={loading || status === "CANCELLED"} className="text-red-600 focus:text-red-600">
            <XCircle className="mr-2 h-4 w-4" /> Hủy bỏ đơn
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Nhóm Tài chính */}
          <DropdownMenuLabel className="text-xs text-muted-foreground">Tài chính</DropdownMenuLabel>
          
          {/* 👇 NÚT XUẤT QR MỚI */}
          <DropdownMenuItem 
            // Khi bấm vào đây, ta cần mở Modal. 
            // Lưu ý: Không thể render Dialog bên trong DropdownMenuItem trực tiếp vì sẽ bị đóng ngay khi click.
            // Giải pháp: Dùng Dialog bọc DropdownMenu (không hay) hoặc tách state ra ngoài.
            // Ở đây ta dùng thủ thuật: Dialog Trigger nằm trong Menu Item nhưng ngăn sự kiện đóng menu.
            onSelect={(e) => e.preventDefault()} 
          >
             <PaymentQRModal 
                bookingId={id} 
                amount={totalPrice} 
                guestName={guestName}
                // Truyền prop customTrigger để thay đổi nút bấm mặc định thành dòng text menu
                customTrigger={
                    <div className="flex items-center w-full cursor-pointer">
                        <QrCode className="mr-2 h-4 w-4 text-blue-600" /> Xuất QR Thanh toán
                    </div>
                }
             />
          </DropdownMenuItem>

          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <CreditCard className="mr-2 h-4 w-4" /> Cập nhật thanh toán
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => onUpdatePayment("PAID")}>
                <CheckCircle2 className="mr-2 h-4 w-4 text-green-600" /> Đã thanh toán
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onUpdatePayment("UNPAID")}>
                <XCircle className="mr-2 h-4 w-4 text-yellow-600" /> Chưa thanh toán
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onUpdatePayment("REFUNDED")}>
                <LogOut className="mr-2 h-4 w-4 text-red-600" /> Hoàn tiền
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuSeparator />

          <DropdownMenuItem onClick={onDelete} disabled={loading} className="text-red-600 focus:text-red-600 focus:bg-red-50">
            <Trash2 className="mr-2 h-4 w-4" /> Xóa đơn hàng
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};