import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: "ADMIN" | "USER" | "STAFF"
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}