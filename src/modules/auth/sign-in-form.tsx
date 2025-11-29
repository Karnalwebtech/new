"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import InputField from "@/components/fields/input-field";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData } from "@/types/user-type";
import { LoginSchema } from "@/zod-schema/user-schema";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useSigninMutation } from "@/state/auth-api";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { setUser } from "@/reducers/auth-slice";
import { useCallback } from "react";
export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const dispatch = useDispatch<AppDispatch>();
  const [signin, { error, isLoading, isSuccess }] = useSigninMutation();
  useHandleNotifications({
    error: error,
    isSuccess,
    successMessage: "Welcome back 🙏",
    redirectPath: "/dashboard",
  });
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = useCallback(
    async (data: LoginFormData) => {
      const response = await signin({
        ...data,
        provider: "credentials",
      });
      if (response?.data?.success) {
        await fetch("/api/cookie", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: response?.data?.token ?? "" }),
          credentials: "include", 
        });
        dispatch(
          setUser({
            user: response?.data?.user,
            token: response?.data?.token ?? "",
          })
        );
      }
    },
    [dispatch, signin]
  );
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <div className="grid gap-3">
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
                <div className="grid gap-1">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <Link
                      href="/auth/forgot-password"
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <InputField
                    control={control}
                    errors={errors}
                    name={"password"}
                    type="password"
                    placeholder={"********"}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full mt-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin w-5 h-5 mr-2" />
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/sign-up"
                  className="underline underline-offset-4"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
