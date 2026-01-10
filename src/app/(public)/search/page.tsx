import { Suspense } from "react";
import Link from "next/link";
import { getRooms } from "@/actions/client/get-rooms";
import { RoomCard } from "@/components/client/room-card";
import { SearchFilters } from "@/components/client/search-filters";
// import { SearchSorter } from "@/components/client/search-sorter"; // Uncomment when you have this component
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth"; // 👈 Import Auth
import { 
  SearchX, 
  Home, 
  ChevronRight, 
  ArrowUpDown
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Using Shadcn Select for now if SearchSorter doesn't exist

// Định nghĩa kiểu props chuẩn cho Next.js 15+
interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage(props: SearchPageProps) {
  // 1. Await searchParams
  const params = await props.searchParams;
  
  // 2. Lấy session user (Quan trọng cho Wishlist)
  const session = await auth();

  // Parse params an toàn
  const category = typeof params.category === 'string' ? params.category : undefined;
  const guests = typeof params.guests === 'string' ? parseInt(params.guests) : undefined;
  const startDate = typeof params.startDate === 'string' ? params.startDate : undefined;
  const endDate = typeof params.endDate === 'string' ? params.endDate : undefined;
  
  // Lấy tham số sort từ URL
  // const sort = typeof params.sort === 'string' ? params.sort : undefined;

  // 3. Lấy dữ liệu
  const rooms = await getRooms({
    category,
    guests,
    startDate,
    endDate,
    // sort, // Uncomment when getRooms supports sorting
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* --- HEADER & BREADCRUMB --- */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
            <div className="flex items-center text-sm text-slate-500 mb-4">
                <Link href="/" className="hover:text-blue-600 flex items-center gap-1">
                    <Home className="h-3 w-3" /> Trang chủ
                </Link>
                <ChevronRight className="h-3 w-3 mx-1" />
                <span className="text-slate-900 font-medium">Tìm kiếm</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                Kết quả tìm kiếm
            </h1>
        </div>
      </div>

      {/* --- SEARCH BAR SECTION --- */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b shadow-sm">
         <div className="container mx-auto px-4 py-4">
            {/* SearchFilters displayed horizontally */}
            <SearchFilters className="flex-row gap-4 shadow-sm border border-slate-200 p-2 rounded-xl bg-white" />
         </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="container mx-auto px-4 py-8">
         <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
            {/* Result Count */}
            <div>
                <p className="text-slate-600">
                    Tìm thấy <span className="font-bold text-slate-900">{rooms.length}</span> phòng phù hợp
                    {category && <span> thuộc loại <span className="font-semibold text-blue-600">"{category}"</span></span>}
                </p>
            </div>

            {/* Sort Options - Temporary Implementation using generic Select */}
            <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500 hidden sm:inline">Sắp xếp theo:</span>
                <Select defaultValue="newest">
                  <SelectTrigger className="w-[180px] h-10 bg-white">
                    <SelectValue placeholder="Mới nhất" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Mới nhất</SelectItem>
                    <SelectItem value="price_asc">Giá: Thấp đến Cao</SelectItem>
                    <SelectItem value="price_desc">Giá: Cao đến Thấp</SelectItem>
                    <SelectItem value="rating_desc">Đánh giá cao nhất</SelectItem>
                  </SelectContent>
                </Select>
            </div>
         </div>

         {/* --- RESULTS GRID --- */}
         <Suspense fallback={<SearchSkeleton />}>
            {rooms.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {rooms.map((room) => (
                        <RoomCard 
                            key={room.id} 
                            room={room} 
                            currentUser={session?.user} // 👈 QUAN TRỌNG: Truyền user vào RoomCard
                        />
                    ))}
                </div>
            )}
         </Suspense>
      </div>
    </div>
  );
}

// Component hiển thị khi không tìm thấy kết quả
function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 text-center px-4">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <SearchX className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Không tìm thấy phòng nào</h3>
            <p className="text-slate-500 max-w-md mt-2 mb-6">
                Rất tiếc, chúng tôi không tìm thấy phòng nào phù hợp với bộ lọc của bạn. Hãy thử thay đổi ngày, số lượng khách hoặc xóa bộ lọc.
            </p>
            <Link href="/search">
                <Button variant="outline" className="min-w-[150px]">
                    Xóa bộ lọc
                </Button>
            </Link>
        </div>
    );
}

// Component Skeleton Loading
function SearchSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden border shadow-sm h-[400px] animate-pulse">
                    <div className="h-48 bg-slate-200" />
                    <div className="p-4 space-y-3">
                        <div className="h-6 bg-slate-200 rounded w-3/4" />
                        <div className="h-4 bg-slate-200 rounded w-1/2" />
                        <div className="h-10 bg-slate-200 rounded mt-4" />
                    </div>
                </div>
            ))}
        </div>
    );
}