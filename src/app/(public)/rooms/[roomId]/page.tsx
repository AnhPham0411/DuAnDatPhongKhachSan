import { getRoomById } from "@/actions/get-rooms";
import { BookingWidget } from "@/components/public/booking-widget"; // Import Widget đặt phòng
import { SessionProvider } from "next-auth/react"; // Cung cấp session cho Widget
import Image from "next/image";
import { notFound } from "next/navigation";

// 1. Định nghĩa params là Promise (Chuẩn Next.js 15)
interface RoomIdPageProps {
    params: Promise<{ roomId: string }>
}

export default async function RoomDetailPage(props: RoomIdPageProps) {
    // 2. Await params trước khi dùng
    const params = await props.params;
    
    // 3. Lấy dữ liệu phòng từ Database
    const room = await getRoomById(params.roomId);

    if (!room) return notFound();

    return (
        <SessionProvider> {/* Bọc Provider để component con dùng được useSession */}
            <div className="container mx-auto py-10 px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    
                    {/* CỘT TRÁI (Chiếm 2 phần): Thông tin chi tiết phòng */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Ảnh phòng */}
                        <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg border">
                            <Image 
                                fill 
                                src={room.images[0]?.url || "/placeholder.jpg"} 
                                alt={room.name} 
                                className="object-cover"
                            />
                        </div>

                        {/* Tiêu đề & Loại phòng */}
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">Phòng {room.name}</h1>
                            <p className="text-lg text-slate-500 mt-2 font-medium">{room.roomType.name}</p>
                        </div>

                        {/* Mô tả chi tiết */}
                        <div className="p-6 bg-slate-50 rounded-xl border border-slate-100">
                            <h3 className="font-bold text-lg mb-3 text-slate-800">Mô tả phòng</h3>
                            <div className="text-slate-600 leading-relaxed whitespace-pre-line">
                                {room.roomType.description}
                            </div>
                        </div>
                        
                        {/* (Optional) Khu vực hiển thị Tiện nghi sau này */}
                        {/* <div className="grid grid-cols-2 gap-4">...</div> */}
                    </div>

                    {/* CỘT PHẢI (Chiếm 1 phần): Widget Đặt phòng */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            {/* Truyền toàn bộ data phòng vào Widget để nó tính tiền */}
                            <BookingWidget room={room} />
                        </div>
                    </div>
                </div>
            </div>
        </SessionProvider>
    );
}