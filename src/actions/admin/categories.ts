"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// 1. Cập nhật Schema: Thêm locationId
const CategorySchema = z.object({
  name: z.string().min(1, {
    message: "Tên không được để trống",
  }),
  locationId: z.string().min(1, { 
    message: "Vui lòng chọn vị trí/khách sạn" 
  }), // <--- Quan trọng: Field này bắt buộc
  description: z.string().optional(),
  basePrice: z.coerce.number().min(0, {
    message: "Giá không được âm"
  }),
  capacity: z.coerce.number().min(1, {
    message: "Sức chứa tối thiểu là 1 người"
  }),
  amenities: z.array(z.string()).optional(), // Nhận mảng ID tiện nghi
});

export const createCategory = async (values: z.infer<typeof CategorySchema>) => {
  const validatedFields = CategorySchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Dữ liệu không hợp lệ! Vui lòng kiểm tra lại." };
  }

  // 2. Tách amenities và locationId ra để xử lý quan hệ
  const { amenities, locationId, ...data } = validatedFields.data;

  try {
    await db.roomType.create({
      data: {
        ...data,
        // 3. Kết nối với Location (Bắt buộc)
        location: {
            connect: { id: locationId }
        },
        // 4. Kết nối với Amenities (Nhiều - Nhiều)
        amenities: {
          connect: amenities?.map((id) => ({ id })) || [],
        },
      },
    });

    revalidatePath("/admin/categories");
    return { success: "Tạo loại phòng thành công!" };
  } catch (error) {
    console.log("CREATE_CATEGORY_ERROR", error);
    return { error: "Lỗi hệ thống, vui lòng thử lại." };
  }
};

export const updateCategory = async (
  id: string,
  values: z.infer<typeof CategorySchema>
) => {
  const validatedFields = CategorySchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Dữ liệu không hợp lệ!" };
  }

  const { amenities, locationId, ...data } = validatedFields.data;

  try {
    await db.roomType.update({
      where: { id },
      data: {
        ...data,
        // Cập nhật Location (Chuyển sang chi nhánh khác nếu cần)
        location: {
            connect: { id: locationId }
        },
        // Cập nhật Amenities: Dùng set để thay thế danh sách cũ
        amenities: {
          set: amenities?.map((id) => ({ id })) || [],
        },
      },
    });

    revalidatePath("/admin/categories");
    // Nếu bạn có trang chi tiết, revalidate cả trang đó
    revalidatePath(`/admin/categories/${id}`); 
    return { success: "Cập nhật loại phòng thành công!" };
  } catch (error) {
    console.log("UPDATE_CATEGORY_ERROR", error);
    return { error: "Lỗi hệ thống, vui lòng thử lại." };
  }
};

export const deleteCategory = async (id: string) => {
  try {
    // Kiểm tra ràng buộc: Có phòng nào đang thuộc loại này không?
    const existingRooms = await db.room.findFirst({
        where: { roomTypeId: id }
    });

    if (existingRooms) {
        return { error: "Không thể xóa! Đang có phòng thuộc loại này." };
    }

    await db.roomType.delete({
      where: { id },
    });

    revalidatePath("/admin/categories");
    return { success: "Đã xóa loại phòng." };
  } catch (error) {
    console.log("DELETE_CATEGORY_ERROR", error);
    return { error: "Lỗi hệ thống! Không thể xóa." };
  }
};