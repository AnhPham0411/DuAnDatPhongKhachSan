import { User, Room, RoomType, RoomImage } from "@prisma/client";

// Chúng ta thay thế kiểu Decimal gốc của Prisma bằng number
export type RoomWithDetails = Room & {
  images: RoomImage[];
  roomType: Omit<RoomType, "basePrice"> & {
    basePrice: number; // Đổi từ Decimal sang number
  };
};

export type SafeUser = Omit<User, "password">;