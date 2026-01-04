"use client";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RoomWithDetails } from "@/types";

interface RoomCardProps {
  data: RoomWithDetails;
}

export const RoomCard = ({ data }: RoomCardProps) => {
  // Format tiền Việt
  const price = new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(data.roomType.basePrice));

  return (
    <Card className="group overflow-hidden rounded-lg border-none shadow-md hover:shadow-xl transition-all">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          fill
          src={data.images[0]?.url || "/images/placeholder.jpg"}
          alt={data.name}
          className="object-cover group-hover:scale-110 transition duration-500"
        />
        <div className="absolute top-2 right-2">
            <Badge className="bg-white text-black hover:bg-white">{data.roomType.name}</Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-bold text-lg text-slate-800">Phòng {data.name}</h3>
        <p className="text-sm text-slate-500 line-clamp-2 mt-1">{data.roomType.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div className="text-blue-600 font-bold text-lg">{price}</div>
        <Link href={`/rooms/${data.id}`}>
            <Button size="sm">Xem ngay</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};