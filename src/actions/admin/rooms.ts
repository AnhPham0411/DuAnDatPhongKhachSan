"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth"; // ✅ Import Auth để check quyền
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Schema Validation
const RoomSchema = z.object({
  name: z.string().min(1, "Tên phòng không được để trống"),
  roomTypeId: z.string().min(1, "Vui lòng chọn loại phòng"),
  isAvailable: z.boolean(),
  // Validate mảng ảnh
  images: z.object({ 
    url: z.string().min(1, "URL ảnh không hợp lệ") 
  }).array(), 
});

// --- 1. CREATE ROOM ---
export const createRoom = async (values: z.infer<typeof RoomSchema>) => {
  try {
    // 🔒 BẢO MẬT: Check quyền Admin
    const session = await auth();
    if (session?.user.role !== "ADMIN") {
      return { error: "Bạn không có quyền thực hiện hành động này!" };
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

    // 🔄 Làm mới dữ liệu ở các trang liên quan
    revalidatePath("/admin/rooms");
    revalidatePath("/search"); // Làm mới trang tìm kiếm của khách
    revalidatePath("/");       // Làm mới trang chủ (nếu có hiện phòng mới)
    
    return { success: "Tạo phòng thành công!" };
  } catch (error) {
    console.log("CREATE_ROOM_ERROR", error);
    return { error: "Lỗi hệ thống!" };
  }
};

// --- 2. UPDATE ROOM ---
export const updateRoom = async (id: string, values: z.infer<typeof RoomSchema>) => {
  try {
    // 🔒 BẢO MẬT
    const session = await auth();
    if (session?.user.role !== "ADMIN") {
      return { error: "Bạn không có quyền thực hiện hành động này!" };
    }

    const validatedFields = RoomSchema.safeParse(values);
    if (!validatedFields.success) return { error: "Dữ liệu không hợp lệ!" };

    const { images, ...data } = validatedFields.data;

    // Logic update: Sửa thông tin + Thay thế toàn bộ ảnh
    await db.room.update({
      where: { id },
      data: {
        ...data,
        images: {
          deleteMany: {}, // Xóa ảnh cũ
          createMany: {   // Thêm ảnh mới
            data: images,
          }
        },
      },
    });

    revalidatePath(`/admin/rooms/${id}`);
    revalidatePath("/admin/rooms");
    revalidatePath("/search");
    revalidatePath("/"); 

    return { success: "Cập nhật phòng thành công!" };
  } catch (error) {
    console.log("UPDATE_ROOM_ERROR", error);
    return { error: "Lỗi hệ thống!" };
  }
};

// --- 3. DELETE ROOM ---
export const deleteRoom = async (id: string) => {
  try {
    // 🔒 BẢO MẬT
    const session = await auth();
    if (session?.user.role !== "ADMIN") {
      return { error: "Bạn không có quyền thực hiện hành động này!" };
    }

    // Kiểm tra xem phòng có đang có Booking nào chưa hoàn thành không?
    // (Tùy chọn: Nếu muốn chặt chẽ hơn thì mở comment này ra)
    /*
    const activeBooking = await db.booking.findFirst({
        where: { roomId: id, status: { not: "CHECKED_OUT" } }
    });
    if (activeBooking) return { error: "Phòng đang có khách đặt, không thể xóa!" };
    */

    await db.room.delete({ where: { id } });

    revalidatePath("/admin/rooms");
    revalidatePath("/search");
    revalidatePath("/");

    return { success: "Đã xóa phòng!" };
  } catch (error) {
    console.log("DELETE_ROOM_ERROR", error);
    return { error: "Lỗi hệ thống hoặc phòng đang có dữ liệu liên kết!" };
  }
};