import { db } from "@/lib/db";
import { RoomWithDetails } from "@/types";

export const getRooms = async (): Promise<RoomWithDetails[]> => {
  try {
    const rooms = await db.room.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        images: true,
        roomType: true,
      },
    });

    // QUAN TRỌNG: Map qua từng phòng để ép kiểu Decimal -> Number
    const safeRooms = rooms.map((room) => ({
      ...room,
      roomType: {
        ...room.roomType,
        basePrice: room.roomType.basePrice.toNumber(),
      },
    }));

    return safeRooms;
  } catch (error) {
    console.log("[GET_ROOMS_ERROR]", error);
    return [];
  }
};

export const getRoomById = async (roomId: string): Promise<RoomWithDetails | null> => {
  try {
    const room = await db.room.findUnique({
      where: { id: roomId },
      include: { images: true, roomType: true },
    });

    if (!room) return null;

    // QUAN TRỌNG: Ép kiểu cho room chi tiết cũng vậy
    return {
      ...room,
      roomType: {
        ...room.roomType,
        basePrice: room.roomType.basePrice.toNumber(),
      },
    };
  } catch (error) {
    return null;
  }
};