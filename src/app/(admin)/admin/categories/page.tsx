import { getRoomTypes } from "@/actions/get-data";
import { createRoomType, deleteRoomType } from "@/actions/mutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, BedDouble, Users } from "lucide-react";

export default async function CategoriesPage() {
  const roomTypes = await getRoomTypes();

  return (
    <div className="p-8 space-y-8">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý Loại phòng</h1>
        <div className="text-sm bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
          Tổng: {roomTypes.length} loại
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- CỘT TRÁI: FORM TẠO MỚI --- */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border sticky top-8">
            <h3 className="font-bold text-lg mb-4 flex items-center text-slate-800">
              <Plus className="w-5 h-5 mr-2" /> Thêm loại mới
            </h3>
            
            <form action={createRoomType} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Tên loại phòng</label>
                <Input name="name" placeholder="VD: Deluxe King" required />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Giá gốc (VNĐ)</label>
                  <Input name="basePrice" type="number" placeholder="500000" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Sức chứa</label>
                  <Input name="capacity" type="number" placeholder="2" required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Mô tả ngắn</label>
                <textarea 
                  name="description" 
                  className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  rows={3}
                  placeholder="Mô tả về loại phòng này..."
                />
              </div>

              <Button type="submit" className="w-full bg-slate-900 hover:bg-slate-800">
                Tạo Loại Phòng
              </Button>
            </form>
          </div>
        </div>

        {/* --- CỘT PHẢI: DANH SÁCH --- */}
        <div className="lg:col-span-2 space-y-4">
          {roomTypes.map((type) => (
            <div key={type.id} className="group flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 bg-white border rounded-xl hover:shadow-md transition-shadow">
              <div className="space-y-2 w-full">
                <div className="flex items-center justify-between sm:justify-start gap-3">
                  <h3 className="font-bold text-lg text-slate-800">{type.name}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-slate-100 text-xs font-medium text-slate-600 whitespace-nowrap">
                    {type._count.rooms} phòng con
                  </span>
                </div>
                
                <p className="text-sm text-gray-500 line-clamp-2">
                  {type.description || "Chưa có mô tả"}
                </p>
                
                <div className="flex gap-3 pt-1 text-sm">
                  <div className="flex items-center text-green-700 font-semibold bg-green-50 px-2 py-1 rounded border border-green-100">
                    {Number(type.basePrice).toLocaleString()} đ
                  </div>
                  <div className="flex items-center text-gray-600 bg-gray-50 px-2 py-1 rounded border border-gray-100">
                    <Users className="w-3 h-3 mr-1" /> {type.capacity} người
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-4 sm:mt-0 sm:ml-4 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                {/* Nút Xóa (Quan trọng: Phải dùng form để gọi Server Action) */}
                <form action={deleteRoomType.bind(null, type.id)}>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-red-400 hover:text-red-600 hover:bg-red-50"
                    title="Xóa loại phòng"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </form>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {roomTypes.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed flex flex-col items-center justify-center">
              <div className="bg-gray-50 p-4 rounded-full mb-3">
                <BedDouble className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-900 font-medium">Chưa có loại phòng nào</p>
              <p className="text-sm text-gray-500">Hãy tạo loại phòng đầu tiên từ form bên trái.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}