"use server";
import { db } from "@/lib/db";

export const getRoomTypes = async () => {
  try {
    const types = await db.roomType.findMany({
      orderBy: { basePrice: 'asc' }
    });
    return types;
  } catch (error) {
    return [];
  }
};