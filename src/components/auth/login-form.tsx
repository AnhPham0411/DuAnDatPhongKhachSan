"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation"; // 👈 1. Import thêm useRouter

import { LoginSchema } from "@/schemas"; 
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { login } from "@/actions/auth"; 
import { Loader2 } from "lucide-react"; 
import { toast } from "sonner"; 

export const LoginForm = () => {
  const router = useRouter(); // 👈 2. Khởi tạo router
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
    ? "Email này đã được sử dụng bởi phương thức đăng nhập khác!"
    : "";

  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof LoginSchema>) => {
    startTransition(() => {
      login(values)
        .then((data) => {
          if (data?.error) {
            form.reset({ ...values, password: "" }); 
            toast.error(data.error); 
          }
          
          if (data?.success) {
            form.reset();
            toast.success(data.success); 

            // 👇 3. QUAN TRỌNG: Làm mới cache để cập nhật Session User ngay lập tức
            router.refresh(); 
            
            // 👇 4. Sau đó chuyển về trang chủ
            router.push("/");
          }
        })
        .catch(() => toast.error("Đã có lỗi hệ thống xảy ra!"));
    });
  };

  return (
    <div className="w-full max-w-[400px] shadow-lg p-8 bg-white rounded-xl border">
        <h2 className="text-2xl font-bold text-center mb-6">Đăng nhập</h2>
        
        {urlError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm text-center">
            {urlError}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="nguyenvana@gmail.com"
                        type="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="******"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Button disabled={isPending} type="submit" className="w-full">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isPending ? "Đang xử lý..." : "Đăng nhập"}
            </Button>
          </form>
        </Form>
    </div>
  );
};