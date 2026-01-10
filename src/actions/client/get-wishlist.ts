"use server";

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export const getWishlist = async () => {
  try {
    const session = await auth();
    if (!session?.user?.id) return [];

    const wishlist = await db.wishlist.findMany({
      where: { userId: session.user.id },
      include: {
        room: {
          include: {
            images: true, // Lấy ảnh từ Room
            // 👇 SỬA TẠI ĐÂY: location nằm trong roomType
            roomType: {
              include: {
                location: true, 
              }
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return wishlist.map((item) => {
      const room = item.room;
      // 👇 Truy cập location thông qua roomType
      const locationName = room.roomType.location?.name || "Đang cập nhật";

      return {
        id: room.id,
        name: room.name,
        address: locationName, 
        price: Number(room.roomType.basePrice),
        image: room.images[0]?.url || "/images/placeholder.jpg",
      };
    });
  } catch (error) {
    console.error("GET_WISHLIST_ERROR", error);
    return [];
  }
};