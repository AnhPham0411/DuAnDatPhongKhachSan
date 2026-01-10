"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"; // Hoặc hook toast bạn đang dùng
import { updateProfile } from "@/actions/client/profile"; // Import action vừa tạo ở bước 1

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";

// Schema khớp với bên Server Action
const ProfileSchema = z.object({
  name: z.string().min(1, "Tên không được để trống"),
  phone: z.string().optional(),
});

interface ProfileFormProps {
  user: {
    name: string | null;
    phone: string | null;
    // Các trường khác nếu cần
  };
}

const ProfileForm = ({ user }: ProfileFormProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // 1. Khởi tạo form với giá trị mặc định từ DB
  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: user.name || "",
      phone: user.phone || "",
    },
  });

  // 2. Xử lý Submit
  const onSubmit = (values: z.infer<typeof ProfileSchema>) => {
    startTransition(() => {
      updateProfile(values)
        .then((data) => {
          if (data.error) {
            toast.error(data.error);
          }
          if (data.success) {
            toast.success(data.success);
            router.refresh(); // F5 nhẹ lại data để cập nhật Avatar/Tên trên Navbar
          }
        })
        .catch(() => toast.error("Đã có lỗi xảy ra!"));
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          {/* Input Tên */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên hiển thị</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Nhập tên của bạn" 
                    disabled={isPending} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Input Số điện thoại */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="0912..." 
                    disabled={isPending} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang lưu...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Lưu thay đổi
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ProfileForm;