import { handlers } from "@/auth"; 
// Lưu ý: chỉnh lại đường dẫn import đúng với nơi bạn đặt file auth.ts
// Nếu auth.ts ở src/auth.ts thì import { handlers } from "@/auth";

export const { GET, POST } = handlers;