"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const SeasonalPriceSchema = z.object({
  roomId: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  price: z.coerce.number().min(0, "Giá không được âm"),
});

export const createSeasonalPrice = async (values: z.infer<typeof SeasonalPriceSchema>) => {
  try {
    const validated = SeasonalPriceSchema.safeParse(values);
    if (!validated.success) return { error: "Dữ liệu không hợp lệ!" };

    const { roomId, startDate, endDate, price } = validated.data;

    // 1. Validate Logic: Ngày bắt đầu phải trước ngày kết thúc
    if (startDate >= endDate) {
      return { error: "Ngày kết thúc phải sau ngày bắt đầu!" };
    }

    // 2. Validate Logic: Kiểm tra xem khoảng thời gian này đã có giá mùa vụ nào chưa?
    // Tránh việc Admin set 2 mức giá khác nhau cho cùng 1 ngày -> Gây lỗi tính tiền
    const existingPrice = await db.seasonalPrice.findFirst({
      where: {
        roomId,
        OR: [
          {
            // Kiểm tra giao thoa ngày
            startDate: { lte: endDate },
            endDate: { gte: startDate },
          },
        ],
      },
    });

    if (existingPrice) {
      return { 
        error: "Khoảng thời gian này bị trùng với một cài đặt giá khác! Vui lòng xóa cũ hoặc chọn ngày khác." 
      };
    }

    // 3. Tạo mới
    await db.seasonalPrice.create({
      data: {
        roomId,
        startDate,
        endDate,
        price,
      },
    });

    revalidatePath(`/admin/rooms/${roomId}`);
    return { success: "Đã thiết lập giá mùa vụ thành công!" };
  } catch (error) {
    console.log("CREATE_SEASONAL_PRICE_ERROR", error);
    return { error: "Lỗi Server!" };
  }
};

export const deleteSeasonalPrice = async (id: string, roomId: string) => {
  try {
    await db.seasonalPrice.delete({ where: { id } });
    revalidatePath(`/admin/rooms/${roomId}`);
    return { success: "Đã xóa giá mùa vụ!" };
  } catch (error) {
    return { error: "Lỗi Server!" };
  }
};