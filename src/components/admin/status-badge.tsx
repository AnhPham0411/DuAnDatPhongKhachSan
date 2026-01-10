import { BookingStatus, PaymentStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge"; // Giả định đã cài Shadcn Badge

interface StatusBadgeProps {
  status: BookingStatus | PaymentStatus;
  type: "booking" | "payment";
}

export const StatusBadge = ({ status, type }: StatusBadgeProps) => {
  const getStyle = (s: string) => {
    switch (s) {
      // Booking Status
      case "CONFIRMED":
      case "CHECKED_IN":
      case "PAID":
        return "bg-green-500 hover:bg-green-600";
      case "PENDING":
      case "UNPAID":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "CHECKED_OUT":
        return "bg-blue-500 hover:bg-blue-600";
      case "CANCELLED":
      case "REFUNDED":
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-slate-500";
    }
  };

  const getLabel = (s: string) => {
    // Mapping tên hiển thị tiếng Việt
    const map: Record<string, string> = {
      PENDING: "Chờ xác nhận",
      CONFIRMED: "Đã xác nhận",
      CHECKED_IN: "Đang ở",
      CHECKED_OUT: "Đã trả phòng",
      CANCELLED: "Đã hủy",
      UNPAID: "Chưa thanh toán",
      PAID: "Đã thanh toán",
      REFUNDED: "Đã hoàn tiền"
    };
    return map[s] || s;
  };

  return (
    <Badge className={getStyle(status)}>
      {getLabel(status)}
    </Badge>
  );
};