import type { NextAuthConfig } from "next-auth";

// File này chỉ chứa cấu hình cơ bản để Middleware đọc được
// Không import Prisma hay Database vào đây để tránh lỗi Edge
export default {
  providers: [], 
} satisfies NextAuthConfig;