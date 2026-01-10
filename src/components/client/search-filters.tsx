"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  Search,
  Users,
  BedDouble,
} from "lucide-react";
import { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface SearchFiltersProps {
  className?: string;
  vertical?: boolean;
}

export const SearchFilters = ({
  className,
  vertical = false,
}: SearchFiltersProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  /* ================= STATE ================= */
  const [date, setDate] = useState<DateRange | undefined>();
  const [guests, setGuests] = useState("");
  const [category, setCategory] = useState("");

  /* ================= INIT FROM URL ================= */
  useEffect(() => {
    const start = searchParams.get("startDate");
    const end = searchParams.get("endDate");
    const paramGuests = searchParams.get("guests");
    const paramCategory = searchParams.get("category");

    if (start && end) setDate({ from: new Date(start), to: new Date(end) });
    if (paramGuests) setGuests(paramGuests);
    if (paramCategory) setCategory(paramCategory);
  }, [searchParams]);

  /* ================= SEARCH ================= */
  const onSearch = () => {
    const params = new URLSearchParams();
    if (date?.from) params.set("startDate", date.from.toISOString());
    if (date?.to) params.set("endDate", date.to.toISOString());
    if (guests) params.set("guests", guests);
    if (category && category !== "all") params.set("category", category);
    router.push(`/search?${params.toString()}`);
  };

  /* ================= UI CONFIG ================= */
  const triggerHeight = "min-h-[76px]";

  const triggerClass = cn(
    triggerHeight,
    "w-full rounded-2xl border border-slate-200",
    "bg-slate-50/60 hover:bg-slate-100",
    "px-4 py-3 transition-all",
    "flex items-start gap-4 text-left"
  );

  const iconBoxClass =
    "mt-1 flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center";

  const textClass =
    "flex-1 font-semibold text-slate-700 text-base leading-tight";

  const FieldWrapper = ({ children }: { children: React.ReactNode }) =>
    vertical ? (
      <div className="rounded-2xl border bg-white p-2 shadow-sm">
        {children}
      </div>
    ) : (
      <>{children}</>
    );

  /* ================= RENDER ================= */
  return (
    <div
      className={cn(
        "w-full rounded-3xl bg-white transition-all",
        vertical
          ? "flex flex-col gap-5 p-0"
          : "flex flex-col gap-4 p-3 lg:flex-row lg:items-center",
        className
      )}
    >
      {/* ===== 1. LOẠI PHÒNG ===== */}
      <div className="flex-1">
        <FieldWrapper>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger
              className={cn(triggerClass, "hover:border-blue-400")}
            >
              <div className={cn(iconBoxClass, "bg-blue-100 text-blue-600")}>
                <BedDouble className="h-6 w-6" />
              </div>

              <div className={textClass}>
                <span className="mb-1 block text-xs uppercase tracking-wider text-slate-400">
                  Loại phòng
                </span>
                <SelectValue placeholder="Chọn loại phòng" />
              </div>
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="Standard">Standard</SelectItem>
              <SelectItem value="Deluxe">Deluxe</SelectItem>
              <SelectItem value="Suite">Suite</SelectItem>
              <SelectItem value="Villa">Villa</SelectItem>
            </SelectContent>
          </Select>
        </FieldWrapper>
      </div>

      {/* ===== 2. NGÀY NHẬN – TRẢ ===== */}
      <div className="flex-1">
        <FieldWrapper>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  triggerClass,
                  "hover:border-rose-400 focus:ring-rose-100"
                )}
              >
                <div
                  className={cn(iconBoxClass, "bg-rose-100 text-rose-600")}
                >
                  <CalendarIcon className="h-6 w-6" />
                </div>

                <div className={textClass}>
                  <span className="mb-1 block text-xs uppercase tracking-wider text-slate-400">
                    Ngày nhận - Trả
                  </span>

                  {date?.from ? (
                    date.to ? (
                      <span>
                        {format(date.from, "dd/MM", { locale: vi })} –{" "}
                        {format(date.to, "dd/MM", { locale: vi })}
                      </span>
                    ) : (
                      format(date.from, "dd/MM/yyyy", { locale: vi })
                    )
                  ) : (
                    <span className="font-normal text-slate-400">
                      Chọn ngày
                    </span>
                  )}
                </div>
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                numberOfMonths={2}
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                locale={vi}
                disabled={(d) =>
                  d < new Date(new Date().setHours(0, 0, 0, 0))
                }
              />
            </PopoverContent>
          </Popover>
        </FieldWrapper>
      </div>

      {/* ===== 3. SỐ KHÁCH ===== */}
      <div className="flex-1">
        <FieldWrapper>
          <Select value={guests} onValueChange={setGuests}>
            <SelectTrigger
              className={cn(triggerClass, "hover:border-orange-400")}
            >
              <div
                className={cn(iconBoxClass, "bg-orange-100 text-orange-600")}
              >
                <Users className="h-6 w-6" />
              </div>

              <div className={textClass}>
                <span className="mb-1 block text-xs uppercase tracking-wider text-slate-400">
                  Số khách
                </span>
                <SelectValue placeholder="Chọn số khách" />
              </div>
            </SelectTrigger>

            <SelectContent>
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <SelectItem key={n} value={n.toString()}>
                  {n} khách
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FieldWrapper>
      </div>

      {/* ===== 4. SEARCH BUTTON ===== */}
      <div className={cn(vertical ? "w-full pt-3" : "w-full lg:w-auto")}>
        <Button
          onClick={onSearch}
          className={cn(
            "h-[76px] w-full rounded-2xl bg-blue-600 text-lg font-bold text-white",
            "shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300",
            "transition-all"
          )}
        >
          <Search className="mr-2 h-5 w-5" />
          Tìm kiếm
        </Button>
      </div>
    </div>
  );
};
