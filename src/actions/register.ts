"use server";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
});

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) return { error: "Dữ liệu không hợp lệ!" };

  const { email, password, name } = validatedFields.data;
  
  // Check trùng email
  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) return { error: "Email đã tồn tại!" };

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.user.create({
    data: { name, email, password: hashedPassword, role: "USER" },
  });

  return { success: "Đăng ký thành công! Vui lòng đăng nhập." };
};