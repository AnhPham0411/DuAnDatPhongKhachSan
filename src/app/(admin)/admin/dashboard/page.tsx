import { getDashboardStats } from "@/actions/get-data";
import { Users, CreditCard, BedDouble, CalendarCheck } from "lucide-react";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  const cards = [
    { label: "Tổng doanh thu", value: `${stats.revenue.toLocaleString()} đ`, icon: CreditCard, color: "text-green-500" },
    { label: "Đơn đặt phòng", value: stats.bookings, icon: CalendarCheck, color: "text-blue-500" },
    { label: "Số lượng phòng", value: stats.rooms, icon: BedDouble, color: "text-orange-500" },
    { label: "Khách hàng", value: stats.users, icon: Users, color: "text-purple-500" },
  ];

  return (
    <div className="p-8 space-y-8">
      <h2 className="text-3xl font-bold tracking-tight">Tổng quan</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="p-6 bg-white rounded-xl shadow-sm border flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{card.label}</p>
              <h3 className="text-2xl font-bold mt-1">{card.value}</h3>
            </div>
            <card.icon className={`h-8 w-8 ${card.color}`} />
          </div>
        ))}
      </div>
      
      {/* Placeholder cho biểu đồ doanh thu */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="p-6 bg-white rounded-xl shadow-sm border h-[300px] flex items-center justify-center text-gray-400">
          Biểu đồ doanh thu (Recharts) sẽ ở đây
        </div>
        <div className="p-6 bg-white rounded-xl shadow-sm border h-[300px] flex items-center justify-center text-gray-400">
          Booking mới nhất sẽ ở đây
        </div>
      </div>
    </div>
  );
}