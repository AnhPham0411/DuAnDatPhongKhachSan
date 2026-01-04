import { getCalendarData } from "@/actions/get-data";
import { addDays, format, isWithinInterval, startOfDay } from "date-fns";
import { vi } from "date-fns/locale";

export default async function CalendarPage() {
  const rooms = await getCalendarData();
  const today = startOfDay(new Date());
  // Tạo mảng 14 ngày tới
  const days = Array.from({ length: 14 }, (_, i) => addDays(today, i));

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Sơ đồ phòng (14 ngày tới)</h1>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-emerald-100 rounded"></div> Trống</div>
          <div className="flex items-center gap-2"><div className="w-4 h-4 bg-red-500 rounded"></div> Đã đặt</div>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow border">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-4 border-b border-r bg-gray-50 text-left min-w-[200px] sticky left-0 z-10">Phòng</th>
              {days.map((day) => (
                <th key={day.toString()} className="p-2 border-b min-w-[100px] text-center bg-gray-50">
                  <div className="font-bold">{format(day, "dd/MM")}</div>
                  <div className="text-xs text-gray-400">{format(day, "EE", { locale: vi })}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id} className="hover:bg-gray-50">
                <td className="p-4 border-b border-r font-medium sticky left-0 bg-white z-10">
                  {room.name} <span className="text-xs text-gray-500 block">{room.roomType.name}</span>
                </td>
                {days.map((day) => {
                  const booking = room.bookings.find((b) => 
                    isWithinInterval(day, { start: startOfDay(b.checkIn), end: addDays(startOfDay(b.checkOut), -1) })
                  );
                  return (
                    <td key={day.toString()} className="p-1 border-b text-center h-16">
                      {booking ? (
                        <div className="w-full h-full bg-red-500 rounded text-white text-xs flex items-center justify-center p-1" title={booking.user.name || "Khách"}>
                           <span className="truncate">{booking.user.name?.split(" ").pop()}</span>
                        </div>
                      ) : (
                        <div className="w-full h-full bg-emerald-50 rounded"></div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}