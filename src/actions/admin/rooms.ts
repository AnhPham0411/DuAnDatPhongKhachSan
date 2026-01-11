"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const RoomSchema = z.object({
  name: z.string().min(1, "Tên phòng không được để trống"),
  roomTypeId: z.string().min(1, "Vui lòng chọn loại phòng"),
  isAvailable: z.boolean(),
  images: z.object({ 
    url: z.string().min(1, "URL ảnh không hợp lệ") 
  }).array(), 
});

// --- 1. CREATE ROOM (CHỈ ADMIN) ---
export const createRoom = async (values: z.infer<typeof RoomSchema>) => {
  try {
    const session = await auth();
    if (session?.user.role !== "ADMIN") {
      return { error: "Bạn không có quyền tạo phòng mới!" };
    }

    const validatedFields = RoomSchema.safeParse(values);
    if (!validatedFields.success) return { error: "Dữ liệu không hợp lệ!" };

    const { images, ...data } = validatedFields.data;

    await db.room.create({
      data: {
        ...data,
        images: {
          createMany: {
            data: images, 
          },
        },
      },
    });

    revalidatePath("/admin/rooms");
    revalidatePath("/search");
    revalidatePath("/");
    
    return { success: "Tạo phòng thành công!" };
  } catch (error) {
    return { error: "Lỗi hệ thống!" };
  }
};

// --- 2. UPDATE ROOM (ADMIN & STAFF) ---
export const updateRoom = async (id: string, values: z.infer<typeof RoomSchema>) => {
  try {
    const session = await auth();
    const role = session?.user.role;

    // Cho phép Staff cập nhật để họ có thể đổi trạng thái isAvailable (Sẵn sàng/Bận)
    if (role !== "ADMIN" && role !== "STAFF") {
      return { error: "Bạn không có quyền chỉnh sửa thông tin phòng!" };
    }

    const validatedFields = RoomSchema.safeParse(values);
    if (!validatedFields.success) return { error: "Dữ liệu không hợp lệ!" };

    const { images, ...data } = validatedFields.data;

    // Bảo mật thêm: Nếu là STAFF, có thể giới hạn họ chỉ được sửa trạng thái isAvailable
    // Nhưng ở đây cho phép STAFF sửa để linh hoạt trong việc cập nhật ảnh phòng nếu cần.
    
    await db.room.update({
      where: { id },
      data: {
        ...data,
        images: {
          deleteMany: {},
          createMany: {
            data: images,
          }
        },
      },
    });

    revalidatePath(`/admin/rooms/${id}`);
    revalidatePath("/admin/rooms");
    revalidatePath("/search");
    return { success: "Cập nhật phòng thành công!" };
  } catch (error) {
    return { error: "Lỗi hệ thống!" };
  }
};

// --- 3. DELETE ROOM (CHỈ ADMIN) ---
export const deleteRoom = async (id: string) => {
  try {
    const session = await auth();
    if (session?.user.role !== "ADMIN") {
      return { error: "Từ chối: Chỉ Quản trị viên mới có quyền xóa phòng!" };
    }

    await db.room.delete({ where: { id } });

    revalidatePath("/admin/rooms");
    revalidatePath("/search");
    return { success: "Đã xóa phòng thành công!" };
  } catch (error) {
    return { error: "Không thể xóa phòng đang có dữ liệu liên kết (đơn đặt phòng)!" };
  }
};