"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const ProfileSchema = z.object({
  userId: z.string(),
  name: z.string().optional(),
  phone: z.string().optional(),
  // Password thường xử lý ở flow riêng vì phức tạp (hash, check old password)
});

export const updateProfile = async (values: z.infer<typeof ProfileSchema>) => {
  try {
    const validated = ProfileSchema.safeParse(values);
    if (!validated.success) return { error: "Dữ liệu không hợp lệ" };

    const { userId, name, phone } = validated.data;

    await db.user.update({
      where: { id: userId },
      data: {
        name,
        phone,
      },
    });

    revalidatePath("/profile");
    return { success: "Cập nhật thông tin thành công" };
  } catch (error) {
    return { error: "Lỗi cập nhật" };
  }
};