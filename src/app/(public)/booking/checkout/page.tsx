import { auth } from "@/lib/auth";
import { getRoomById } from "@/actions/client/get-rooms";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { CheckoutForm } from "@/components/client/checkout-form"; // Import component vừa tạo

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

  // Tính toán lại giá tiền để đảm bảo chính xác (Server side calculation)
  const checkIn = new Date(checkInStr);
  const checkOut = new Date(checkOutStr);
  
  // Tính số đêm
  const dayCount = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  
  // Tổng tiền
  const totalPrice = dayCount * room.roomType.basePrice;

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Xác nhận đặt phòng</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {/* Cột Trái: Thông tin phòng */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin phòng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative h-48 w-full rounded-lg overflow-hidden">
                <Image
                  src={room.images[0]?.url || "/images/placeholder.jpg"}
                  alt={room.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold">{room.name}</h3>
                <p className="text-muted-foreground">{room.roomType.name}</p>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>Sức chứa: {room.roomType.capacity} người</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Chi tiết giá</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Đơn giá</span>
                <span>{formatCurrency(room.roomType.basePrice)} / đêm</span>
              </div>
              <div className="flex justify-between">
                <span>Thời gian ở</span>
                <span>{dayCount} đêm</span>
              </div>
              <div className="flex justify-between">
                <span>Ngày nhận phòng</span>
                <span className="font-medium">{format(checkIn, "dd/MM/yyyy")}</span>
              </div>
              <div className="flex justify-between">
                <span>Ngày trả phòng</span>
                <span className="font-medium">{format(checkOut, "dd/MM/yyyy")}</span>
              </div>
              <div className="border-t pt-2 mt-2 flex justify-between text-lg font-bold text-primary">
                <span>Tổng cộng</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cột Phải: Form nhập liệu (Client Component) */}
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Thông tin khách hàng</CardTitle>
          </CardHeader>
          <CardContent>
            <CheckoutForm 
              userId={session.user.id!}
              roomId={roomId}
              checkIn={checkInStr}
              checkOut={checkOutStr}
              totalPrice={totalPrice}
              initialName={session.user.name || ""}
              initialEmail={session.user.email || ""}
              initialPhone={session.user.phone || ""}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}