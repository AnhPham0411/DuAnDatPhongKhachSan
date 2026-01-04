import { getBookings } from "@/actions/get-data";
import { updateBookingStatus } from "@/actions/mutations";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge"; // Nếu chưa có Badge, dùng span với class tailwind
import { CheckCircle2, XCircle, LogIn, LogOut } from "lucide-react";

// Hàm helper để render màu trạng thái
const getStatusBadge = (status: string) => {
  switch (status) {
    case "PENDING": return <span className="px-2 py-1 rounded bg-yellow-100 text-yellow-800 text-xs font-bold">Chờ duyệt</span>;
    case "CONFIRMED": return <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-xs font-bold">Đã cọc</span>;
    case "CHECKED_IN": return <span className="px-2 py-1 rounded bg-green-100 text-green-800 text-xs font-bold">Đang ở</span>;
    case "CHECKED_OUT": return <span className="px-2 py-1 rounded bg-gray-100 text-gray-800 text-xs font-bold">Đã trả phòng</span>;
    case "CANCELLED": return <span className="px-2 py-1 rounded bg-red-100 text-red-800 text-xs font-bold">Đã hủy</span>;
    default: return status;
  }
};

export default async function BookingsPage() {
  const bookings = await getBookings();

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý Đặt phòng</h1>
        <div className="text-sm text-gray-500">Tổng: {bookings.length} đơn</div>
      </div>

      <div className="border rounded-lg bg-white shadow overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-700 uppercase font-medium">
            <tr>
              <th className="px-6 py-4">Mã đơn / Khách</th>
              <th className="px-6 py-4">Phòng</th>
              <th className="px-6 py-4">Thời gian</th>
              <th className="px-6 py-4">Tổng tiền</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {bookings.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-bold text-gray-900">#{item.id.slice(-5).toUpperCase()}</div>
                  <div className="text-gray-500 text-xs">{item.user.name}</div>
                  <div className="text-gray-400 text-xs">{item.user.email}</div>
                </td>
                <td className="px-6 py-4 font-medium text-blue-600">
                  {item.room.name}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-green-600">Vào: {format(item.checkIn, "dd/MM/yyyy", { locale: vi })}</span>
                    <span className="text-red-500">Ra: {format(item.checkOut, "dd/MM/yyyy", { locale: vi })}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-bold">
                  {Number(item.totalPrice).toLocaleString()} đ
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(item.status)}
                </td>
                <td className="px-6 py-4">
                  {/* Cụm nút hành động */}
                  <div className="flex justify-center gap-2">
                    {/* Nút Duyệt (Confirm) */}
                    {item.status === "PENDING" && (
                      <form action={updateBookingStatus}>
                        <input type="hidden" name="bookingId" value={item.id} />
                        <input type="hidden" name="status" value="CONFIRMED" />
                        <Button size="sm" variant="outline" className="text-blue-600 hover:bg-blue-50" title="Xác nhận">
                          <CheckCircle2 className="w-4 h-4" />
                        </Button>
                      </form>
                    )}

                    {/* Nút Check-in */}
                    {item.status === "CONFIRMED" && (
                      <form action={updateBookingStatus}>
                        <input type="hidden" name="bookingId" value={item.id} />
                        <input type="hidden" name="status" value="CHECKED_IN" />
                        <Button size="sm" variant="outline" className="text-green-600 hover:bg-green-50" title="Check-in">
                          <LogIn className="w-4 h-4" />
                        </Button>
                      </form>
                    )}

                    {/* Nút Check-out */}
                    {item.status === "CHECKED_IN" && (
                      <form action={updateBookingStatus}>
                        <input type="hidden" name="bookingId" value={item.id} />
                        <input type="hidden" name="status" value="CHECKED_OUT" />
                        <Button size="sm" variant="outline" className="text-purple-600 hover:bg-purple-50" title="Check-out">
                          <LogOut className="w-4 h-4" />
                        </Button>
                      </form>
                    )}

                    {/* Nút Hủy */}
                    {["PENDING", "CONFIRMED"].includes(item.status) && (
                      <form action={updateBookingStatus}>
                        <input type="hidden" name="bookingId" value={item.id} />
                        <input type="hidden" name="status" value="CANCELLED" />
                        <Button size="sm" variant="ghost" className="text-red-500 hover:bg-red-50" title="Hủy đơn">
                          <XCircle className="w-4 h-4" />
                        </Button>
                      </form>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {bookings.length === 0 && (
          <div className="p-8 text-center text-gray-500">Chưa có đơn đặt phòng nào.</div>
        )}
      </div>
    </div>
  );
}