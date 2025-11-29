"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InputField from "@/components/fields/input-field";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@/zod-schema/user-schema";
import Link from "next/link";
import { useSignupMutation } from "@/state/auth-api";
import { formData } from "@/types/user-type";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
import { Loader2 } from "lucide-react";
import { useSessionStorage } from "@/lib/setSessionData";
import { useEffect } from "react";

export function SignForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [signup, { data, error, isLoading, isSuccess }] = useSignupMutation();
  const { setSessionData } = useSessionStorage();
  useHandleNotifications({
    error: error,
    isSuccess,
    successMessage: "OTP send successfuly",
    redirectPath: "/auth/verify",
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<formData>({
    resolver: zodResolver(signupSchema),
    defaultValues:{
      referredCode:""
    }
  });

  const onSubmit = async (data: formData) => {
    await signup(data);
  };
  // const onSubmit = useCallback(
  //   async (data: OTPFormData) => {
  //     try {
  //       const res = await otpVerification({
  //         otpValue: data.otp,
  //         token,
  //       }).unwrap();
  //       console.log("Success:", res);
  //     } catch (error) {
  //       console.error("Error:", error);

  //       // Handle specific errors
  //       if (error.status === 400) {
  //         alert("Invalid OTP. Please try again.");
  //       } else {
  //         alert("Something went wrong. Please try again later.");
  //       }
  //     }
  //   },
  //   [otpVerification, token]
  // ); // Dependencies ensure the function updates only when needed

  useEffect(() => {
    if (isSuccess && data?.token) {
      setSessionData("token", data.token, 10);
    }
  }, [isSuccess, data, setSessionData]); // Trigger only when mutation is successful

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <InputField
                  control={control}
                  errors={errors}
                  label="Full name"
                  name={"name"}
                  placeholder={"jhon deo"}
                />
                <InputField
                  control={control}
                  errors={errors}
                  label="Email"
                  name={"email"}
                  type="email"
                  placeholder={"m@example.com"}
                />
                <InputField
                  control={control}
                  errors={errors}
                  label="Phone"
                  name={"phone"}
                  type="Number"
                  placeholder={"9876543210"}
                />
                <InputField
                  control={control}
                  errors={errors}
                  label="Referred Code"
                  name={"referredCode"}
                  placeholder={"AD123"}
                />

                <InputField
                  control={control}
                  errors={errors}
                  label={"Password"}
                  name={"password"}
                  placeholder={"*******"}
                  type="password"
                />
                <Button
                  type="submit"
                  className="w-full mt-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin w-5 h-5 mr-2" />
                  ) : (
                    "Sign Up"
                  )}
                </Button>
              </div>
              <div className="text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link
                  href="/auth/sign-in"
                  className="underline underline-offset-4"
                >
                  Sign in
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
