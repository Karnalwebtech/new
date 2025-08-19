"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useForgotPasswordMutation } from "@/state/auth-api";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
import InputField from "@/components/fields/input-field";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgetPasswordSchema } from "@/zod-shema/user-schema";
import { forgetPasswordData } from "@/types/user-type";

export default function ForgotPasswordPage() {
  const [forgotPassword, { error, isLoading, isSuccess }] =
    useForgotPasswordMutation();
  useHandleNotifications({
    error: error,
    isSuccess,
    successMessage: "Password send to your mail successfuly",
    // redirectPath: "/auth/verify",
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<forgetPasswordData>({
    resolver: zodResolver(ForgetPasswordSchema),
  });

  const onSubmit = async (data: forgetPasswordData) => {
    await forgotPassword({ email: data.email });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-3 py-12 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            Forgot Password
          </CardTitle>
          <CardDescription className="text-center">
            Enter your email address and we&apos;ll send you a link to reset
            your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-2">
              <InputField
                control={control}
                errors={errors}
                label="Email"
                name={"email"}
                type="email"
                placeholder={"m@example.com"}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="animate-spin w-5 h-5 mr-2" />
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link
            href="/auth/sign-in"
            className="flex items-center text-sm text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Signin
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
