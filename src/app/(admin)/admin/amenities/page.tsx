import { getAmenities } from "@/actions/get-data";
import { createAmenity, deleteAmenity } from "@/actions/mutations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus } from "lucide-react";

export default async function AmenitiesPage() {
  const amenities = await getAmenities();

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Quản lý Tiện nghi</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border max-w-lg">
        <form action={createAmenity} className="flex gap-2">
          <Input name="name" placeholder="Tên tiện nghi (Wifi, BBQ...)" required />
          <Button type="submit"><Plus className="w-4 h-4 mr-2" /> Thêm</Button>
        </form>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {amenities.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 bg-white border rounded-lg">
            <span>{item.name}</span>
            <form action={deleteAmenity.bind(null, item.id)}>
              <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}

