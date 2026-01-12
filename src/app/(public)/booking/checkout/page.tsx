import { auth } from "@/lib/auth";
import { getRoomById } from "@/actions/client/get-rooms";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Calendar, BedDouble } from "lucide-react";
import { CheckoutForm } from "@/components/client/checkout-form";

interface CheckoutPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CheckoutPage(props: CheckoutPageProps) {
  const searchParams = await props.searchParams;
  const session = await auth();

  // 1. Kiểm tra đăng nhập
  if (!session || !session.user) {
    const callbackUrl = encodeURIComponent(`/booking/checkout?roomId=${searchParams.roomId}&checkIn=${searchParams.checkIn}&checkOut=${searchParams.checkOut}`);
    redirect(`/login?callbackUrl=${callbackUrl}`);
  }

  const roomId = searchParams.roomId as string;
  const checkInStr = searchParams.checkIn as string;
  const checkOutStr = searchParams.checkOut as string;
  
  if (!roomId || !checkInStr || !checkOutStr) return notFound();

  const room = await getRoomById(roomId);
  if (!room) return notFound();

  // --- BẮT ĐẦU SỬA LỖI TÍNH TOÁN ---

  // 2. Chuyển đổi chuỗi ngày tháng sang đối tượng Date
  const checkIn = new Date(checkInStr);
  const checkOut = new Date(checkOutStr);

  // 3. Kiểm tra ngày hợp lệ (Tránh lỗi NaN nếu ngày sai định dạng)
  if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h2 className="text-xl font-bold text-red-600">Ngày đặt phòng không hợp lệ!</h2>
        <p className="text-muted-foreground">Vui lòng quay lại và chọn ngày chính xác.</p>
      </div>
    );
  }

  // 4. Tính số đêm (Đảm bảo tối thiểu là 1 đêm)
  const oneDay = 1000 * 60 * 60 * 24;
  let dayCount = Math.ceil((checkOut.getTime() - checkIn.getTime()) / oneDay);
  if (dayCount < 1) dayCount = 1;

  // 5. Chuyển đổi giá tiền từ Decimal (Prisma) sang Number (JS)
  const basePrice = Number(room.roomType.basePrice); 
  const totalPrice = dayCount * basePrice;

  // Kiểm tra lần cuối
  if (isNaN(totalPrice)) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h2 className="text-xl font-bold text-red-600">Lỗi tính toán giá tiền!</h2>
      </div>
    );
  }

  // --- KẾT THÚC SỬA LỖI ---

  return (
    <div className="container mx-auto px-4 py-10 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-slate-800">Xác nhận đặt phòng</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Cột Trái: Thông tin phòng */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="overflow-hidden border-none shadow-md">
            <div className="relative h-56 w-full">
              <Image
                src={room.images[0]?.url || "/images/placeholder.jpg"}
                alt={room.name}
                fill
                className="object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle className="text-xl">{room.name}</CardTitle>
              <p className="text-sm text-muted-foreground font-medium">{room.roomType.name}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center text-sm text-slate-600">
                <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                <span>{room.roomType.location.name}</span>
              </div>
              <div className="flex items-center text-sm text-slate-600">
                <BedDouble className="w-4 h-4 mr-2 text-blue-500" />
                <span>Sức chứa: {room.roomType.capacity} người</span>
              </div>
              
              <div className="bg-slate-100 p-4 rounded-lg space-y-3 mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2"><Calendar className="w-4 h-4"/> Nhận phòng:</span>
                  <span className="font-semibold">{format(checkIn, "dd/MM/yyyy")}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2"><Calendar className="w-4 h-4"/> Trả phòng:</span>
                  <span className="font-semibold">{format(checkOut, "dd/MM/yyyy")}</span>
                </div>
                <div className="border-t border-slate-300 pt-2 flex justify-between font-medium">
                  <span>Thời gian:</span>
                  <span>{dayCount} đêm</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cột Phải: Form nhập liệu */}
        <div className="lg:col-span-2">
          <Card className="border-none shadow-md h-full">
            <CardHeader>
              <CardTitle>Thông tin thanh toán</CardTitle>
            </CardHeader>
            <CardContent>
              <CheckoutForm 
                userId={session.user.id!}
                roomId={roomId}
                checkIn={checkInStr}
                checkOut={checkOutStr}
                
                // QUAN TRỌNG: Phải dùng tên prop là 'totalPrice' để khớp với CheckoutForm
                totalPrice={totalPrice} 
                
                initialName={session.user.name || ""}
                initialEmail={session.user.email || ""}
                initialPhone={session.user.phone || ""}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}