"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const SearchSorter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Lấy giá trị sort hiện tại từ URL, mặc định là 'recommended'
  const currentSort = searchParams.get("sort") || "recommended";

  const onSortChange = (value: string) => {
    // 1. Copy params hiện tại (để giữ lại filter ngày, số khách...)
    const params = new URLSearchParams(searchParams.toString());
    
    // 2. Cập nhật param sort
    params.set("sort", value);

    // 3. Push URL mới
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-slate-500 hidden sm:inline-block">Sắp xếp theo:</span>
      <Select value={currentSort} onValueChange={onSortChange}>
        <SelectTrigger className="w-[180px] h-9 bg-white">
          <SelectValue placeholder="Sắp xếp" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="recommended">Được đề xuất</SelectItem>
          <SelectItem value="price_asc">Giá: Thấp đến Cao</SelectItem>
          <SelectItem value="price_desc">Giá: Cao đến Thấp</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};