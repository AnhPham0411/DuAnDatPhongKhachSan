"use server";

import * as z from "zod";
import bcrypt from "bcryptjs"; // 👈 Cần import thư viện này
import { db } from "@/lib/db"; // 👈 Cần import DB
import { signIn } from "@/lib/auth"; 
import { LoginSchema, RegisterSchema } from "@/schemas"; // 👈 Import cả 2 Schema
import { AuthError } from "next-auth";

// --- LOGIN ACTION ---
export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Dữ liệu không hợp lệ!" };
  }

  const { email, password } = validatedFields.data;

  try {
    // Đăng nhập bằng Credentials
    await signIn("credentials", {
      email,
      password,
      redirect: false, // Quan trọng: Để xử lý lỗi ở Client thay vì redirect ngay
    });
    
    return { success: "Đăng nhập thành công!" };

  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Email hoặc mật khẩu không chính xác!" };
        default:
          return { error: "Lỗi đăng nhập không xác định!" };
      }
    }
    // NextJS redirect throws an error, so we need to rethrow it
    throw error;
  }
};

// --- REGISTER ACTION ---
export const register = async (values: z.infer<typeof RegisterSchema>) => {
  // 1. Validate dữ liệu đầu vào
  const validatedFields = RegisterSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Dữ liệu không hợp lệ!" };
  }

  const { email, password, name } = validatedFields.data;

  try {
    // 2. Kiểm tra xem Email đã tồn tại chưa
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "Email này đã được sử dụng!" };
    }

    // 3. Mã hóa mật khẩu (Hash Password)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Tạo User mới trong Database
    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "USER", // Mặc định là USER (tránh trường hợp hack tạo ADMIN)
      },
    });

    // 5. Trả về thành công
    return { success: "Tạo tài khoản thành công! Vui lòng đăng nhập." };
    
  } catch (error) {
    console.log("REGISTER_ERROR", error);
    return { error: "Lỗi hệ thống! Vui lòng thử lại sau." };
  }
};