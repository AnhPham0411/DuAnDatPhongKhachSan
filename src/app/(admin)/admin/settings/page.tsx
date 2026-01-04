import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Cấu hình hệ thống</h2>
      <div className="h-px bg-slate-200 my-4" />
      
      <div className="max-w-xl space-y-4">
         <div className="grid gap-2">
            <label className="font-medium">Tên khách sạn</label>
            <Input placeholder="Ví dụ: My Luxury Hotel" />
         </div>
         <div className="grid gap-2">
            <label className="font-medium">Phí dịch vụ mặc định (%)</label>
            <Input type="number" placeholder="10" />
         </div>
         <Button>Lưu thay đổi</Button>
      </div>
    </div>
  );
}