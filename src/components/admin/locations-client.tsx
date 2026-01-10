"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Location } from "@prisma/client"; // Import type từ Prisma
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { 
  Plus, Pencil, Trash, Loader2, MapPin, ImageIcon, FileText, MoreHorizontal 
} from "lucide-react";

// Actions
import { createLocation, updateLocation, deleteLocation } from "@/actions/admin/locations";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";

// --- Schema Validate ---
const formSchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  address: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface LocationsClientProps {
  data: Location[]; // Nhận dữ liệu từ Server Component
}

export const LocationsClient = ({ data }: LocationsClientProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // State cho Modal Thêm/Sửa
  const [isOpen, setIsOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);

  // State cho Modal Xóa
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Setup Form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      description: "",
      imageUrl: "",
    },
  });

  // --- HÀM XỬ LÝ ---

  // 1. Mở Modal Thêm mới
  const onOpenCreate = () => {
    setEditingLocation(null);
    form.reset({ name: "", address: "", description: "", imageUrl: "" });
    setIsOpen(true);
  };

  // 2. Mở Modal Sửa
  const onOpenEdit = (location: Location) => {
    setEditingLocation(location);
    form.reset({
      name: location.name,
      address: location.address || "",
      description: location.description || "",
      imageUrl: location.imageUrl || "",
    });
    setIsOpen(true);
  };

  // 3. Submit Form (Xử lý cả Tạo & Sửa)
  const onSubmit = (values: FormValues) => {
    startTransition(() => {
      if (editingLocation) {
        // Update
        updateLocation(editingLocation.id, values).then((res) => {
          if (res.error) toast.error(res.error);
          if (res.success) {
            toast.success(res.success);
            setIsOpen(false);
            router.refresh(); // Làm mới dữ liệu
          }
        });
      } else {
        // Create
        createLocation(values).then((res) => {
          if (res.error) toast.error(res.error);
          if (res.success) {
            toast.success(res.success);
            setIsOpen(false);
            router.refresh();
          }
        });
      }
    });
  };

  // 4. Xử lý Xóa
  const onDelete = () => {
    if (!deleteId) return;
    startTransition(() => {
      deleteLocation(deleteId).then((res) => {
        if (res.error) toast.error(res.error);
        if (res.success) {
          toast.success(res.success);
          setDeleteId(null);
          router.refresh();
        }
      });
    });
  };

  return (
    <>
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Quản lý Chi nhánh ({data.length})</h2>
          <p className="text-sm text-muted-foreground">
            Thêm, sửa, xóa các địa điểm kinh doanh tại đây.
          </p>
        </div>
        <Button onClick={onOpenCreate}>
          <Plus className="mr-2 h-4 w-4" /> Thêm mới
        </Button>
      </div>
      
      <Separator className="my-4" />

      {/* --- DANH SÁCH (LIST) --- */}
      <div className="space-y-4">
        {data.length === 0 && (
            <div className="text-center py-10 text-muted-foreground border rounded-lg border-dashed">
                Chưa có chi nhánh nào. Hãy bấm "Thêm mới".
            </div>
        )}
        
        {data.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition">
            <div className="flex items-center gap-4">
                {/* Ảnh thumbnail */}
                <div className="h-16 w-16 rounded-md overflow-hidden relative border bg-gray-100 flex items-center justify-center">
                    {item.imageUrl ? (
                         <img src={item.imageUrl} alt={item.name} className="object-cover w-full h-full" />
                    ) : (
                        <MapPin className="h-6 w-6 text-gray-400" />
                    )}
                </div>
                {/* Thông tin text */}
                <div>
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                        {item.address || "Chưa cập nhật địa chỉ"}
                    </p>
                </div>
            </div>

            {/* Actions Buttons */}
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => onOpenEdit(item)}>
                    <Pencil className="h-4 w-4 text-blue-600" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setDeleteId(item.id)}>
                    <Trash className="h-4 w-4 text-red-600" />
                </Button>
            </div>
          </div>
        ))}
      </div>

      {/* --- MODAL FORM (CREATE / EDIT) --- */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingLocation ? "Cập nhật chi nhánh" : "Thêm chi nhánh mới"}</DialogTitle>
            <DialogDescription>
              {editingLocation ? "Chỉnh sửa thông tin chi tiết bên dưới." : "Điền thông tin để tạo địa điểm mới."}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên Chi nhánh</FormLabel>
                    <FormControl>
                      <Input disabled={isPending} placeholder="VD: Ha Long Pearl..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ</FormLabel>
                    <FormControl>
                      <Input disabled={isPending} placeholder="VD: 123 Đường Hạ Long..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                        Link Ảnh <span className="text-xs text-muted-foreground font-normal">(Tùy chọn)</span>
                    </FormLabel>
                    <FormControl>
                      <Input disabled={isPending} placeholder="https://..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mô tả</FormLabel>
                    <FormControl>
                      <Textarea disabled={isPending} placeholder="Giới thiệu ngắn..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                 <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isPending}>
                    Hủy
                 </Button>
                 <Button type="submit" disabled={isPending}>
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {editingLocation ? "Lưu thay đổi" : "Tạo mới"}
                 </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* --- ALERT DELETE --- */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Chi nhánh sẽ bị xóa vĩnh viễn khỏi hệ thống.
              <br/><span className="text-red-500 font-medium">Lưu ý: Không thể xóa nếu chi nhánh đang có Phòng hoặc Loại phòng.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Hủy</AlertDialogCancel>
            <AlertDialogAction 
                onClick={(e) => { e.preventDefault(); onDelete(); }} 
                disabled={isPending}
                className="bg-red-600 hover:bg-red-700"
            >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Xóa ngay
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};