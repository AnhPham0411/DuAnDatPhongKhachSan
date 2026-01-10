import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import authConfig from "@/auth.config";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { LoginSchema } from "@/schemas";
// Import Type UserRole từ Prisma (nếu dự án dùng TS chặt chẽ)
import { UserRole } from "@prisma/client"; 

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
  
  // 👇 CẬP NHẬT CALLBACKS ĐỂ LẤY CẢ ID VÀ ROLE 👇
  callbacks: {
    async jwt({ token, user }) {
      // User chỉ có giá trị ở lần đăng nhập đầu tiên
      if (user) {
        token.sub = user.id;
        token.role = user.role; // Lưu Role từ DB vào Token
      }
      return token;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      
      // Lấy Role từ Token nhét vào Session
      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }
      
      return session;
    }
  },
  // 👆 KẾT THÚC CẬP NHẬT 👆

  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await db.user.findUnique({
            where: { email }
          });

          if (!user || !user.password) return null;

          const passwordsMatch = await bcrypt.compare(
            password,
            user.password
          );

          if (passwordsMatch) return user;
        }

        return null;
      }
    })
  ],
});