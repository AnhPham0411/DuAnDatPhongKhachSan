"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth"; 
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const updateUserRole = async (userId: string, newRole: UserRole) => {
  try {
    const session = await auth();

    // 1. Check quyền Admin
    if (!session?.user || session.user.role !== "ADMIN") {
      return { error: "Không có quyền thực hiện!" };
    }

    // 2. Chặn tự đổi quyền chính mình (để không bị mất quyền admin)
    if (session.user.id === userId) {
      return { error: "Không thể tự thay đổi quyền của chính mình!" };
    }

    // 3. Update CHỈ trường ROLE (An toàn tuyệt đối)
    await db.user.update({
      where: { id: userId },
      data: { role: newRole }, // 👈 Chỉ update dòng này
    });

    revalidatePath("/admin/users");
    return { success: `Đã cập nhật quyền thành ${newRole}` };
  } catch (error) {
    return { error: "Lỗi hệ thống!" };
  }
};