"use server";

import * as z from "zod";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// Schema validate dữ liệu đầu vào
const LocationSchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  address: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
});

export const createLocation = async (values: z.infer<typeof LocationSchema>) => {
  const validatedFields = LocationSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Dữ liệu không hợp lệ!" };
  }

  try {
    await db.location.create({
      data: {
        ...validatedFields.data,
      },
    });

    revalidatePath("/admin/locations");
    return { success: "Tạo chi nhánh thành công!" };
  } catch (error) {
    return { error: "Lỗi hệ thống, vui lòng thử lại." };
  }
};

export const updateLocation = async (
  id: string,
  values: z.infer<typeof LocationSchema>
) => {
  const validatedFields = LocationSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Dữ liệu không hợp lệ!" };
  }

  try {
    await db.location.update({
      where: { id },
      data: {
        ...validatedFields.data,
      },
    });

    revalidatePath("/admin/locations");
    return { success: "Cập nhật chi nhánh thành công!" };
  } catch (error) {
    return { error: "Lỗi hệ thống, vui lòng thử lại." };
  }
};

export const deleteLocation = async (id: string) => {
  try {
    await db.location.delete({
      where: { id },
    });

    revalidatePath("/admin/locations");
    return { success: "Đã xóa chi nhánh." };
  } catch (error) {
    return { error: "Không thể xóa (có thể do đang có phòng thuộc chi nhánh này)." };
  }
};