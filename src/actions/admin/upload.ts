"use server";

import fs from "node:fs/promises";
import path from "node:path";
import { revalidatePath } from "next/cache";

export const uploadImageLocal = async (formData: FormData) => {
  try {
    const file = formData.get("file") as File;
    
    if (!file) {
      return { error: "Không có file nào được chọn" };
    }

    // 1. Chuyển File sang Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // 2. Tạo tên file độc nhất (tránh trùng tên)
    const fileName = `${Date.now()}-${file.name.replace(/\s/g, "-")}`;
    
    // 3. Xác định đường dẫn lưu (trong public/uploads)
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    
    // Tạo thư mục nếu chưa có
    try {
      await fs.access(uploadDir);
    } catch {
      await fs.mkdir(uploadDir, { recursive: true });
    }

    const filePath = path.join(uploadDir, fileName);

    // 4. Ghi file vào ổ cứng
    await fs.writeFile(filePath, buffer);

    // 5. Trả về đường dẫn ảnh (để lưu vào DB)
    const fileUrl = `/uploads/${fileName}`;
    
    return { success: fileUrl };

  } catch (error) {
    console.error("Upload error:", error);
    return { error: "Lỗi khi lưu file" };
  }
};