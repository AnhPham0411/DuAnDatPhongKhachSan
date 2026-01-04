import { getRooms } from "@/actions/get-rooms";
import { RoomCard } from "@/components/public/room-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function HomePage() {
  const rooms = await getRooms();

  return (
    <div className="flex flex-col">
        {/* Banner */}
        <div className="relative h-[500px] bg-slate-900 flex items-center justify-center text-white">
            <div className="absolute inset-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070')] bg-cover bg-center" />
            <div className="relative z-10 text-center space-y-4 px-4">
                <h1 className="text-5xl font-bold">Trải nghiệm kỳ nghỉ tuyệt vời</h1>
                <p className="text-xl max-w-2xl mx-auto">Hệ thống đặt phòng khách sạn trực tuyến hàng đầu.</p>
                <Link href="/rooms">
                    <Button size="lg" className="mt-4 bg-blue-600 hover:bg-blue-700 border-none">Đặt phòng ngay</Button>
                </Link>
            </div>
        </div>

        {/* Featured List */}
        <div className="container mx-auto py-16 px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Phòng nổi bật</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {rooms.slice(0, 4).map((room) => (
                    <RoomCard key={room.id} data={room} />
                ))}
            </div>
        </div>
    </div>
  );
}