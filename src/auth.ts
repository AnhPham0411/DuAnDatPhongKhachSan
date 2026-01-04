// src/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"; // Quan trọng: Phải có dòng này
import { db } from "@/lib/db"; // Đường dẫn tới file prisma db của bạn

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        console.log("----------------------------------------");
        console.log(">>> [LOGIN CHECK]");
        
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        if (!email || !password) {
          console.log(">>> Thiếu email hoặc password");
          return null;
        }

        // 1. Tìm user trong DB
        const user = await db.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          console.log(">>> Không tìm thấy User hoặc user không có password");
          return null;
        }

        console.log(`>>> Tìm thấy User: ${user.email}`);
        console.log(`>>> Mật khẩu nhập vào: ${password}`);
        console.log(`>>> Mật khẩu trong DB (Đã mã hóa): ${user.password}`);

        // 2. SO SÁNH MẬT KHẨU (Quan trọng nhất)
        // Dùng bcrypt.compare để so sánh "123456" với "$2b$10$..."
        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (!passwordsMatch) {
          console.log(">>> ❌ MẬT KHẨU KHÔNG KHỚP!");
          console.log("----------------------------------------");
          return null;
        }

        console.log(">>> ✅ ĐĂNG NHẬP THÀNH CÔNG!");
        console.log("----------------------------------------");

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role || "USER",
        } as User;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        // @ts-ignore
        session.user.role = token.role; 
        // @ts-ignore
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        // @ts-ignore
        token.role = user.role;
      }
      return token;
    },
  },
});