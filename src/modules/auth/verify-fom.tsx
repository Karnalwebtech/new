"use client";
import type React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { LockOpenIcon as LockClosedIcon, Loader2 } from "lucide-react";
import { useSessionStorage } from "@/lib/setSessionData";
import { useOtpVerificationMutation } from "@/state/auth-api";
import { OTPFormData } from "@/types/user-type";
import { useForm } from "react-hook-form";
import { otpSchema } from "@/zod-shema/user-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
import { ResendBtn } from "./resend-btn";

export function VerifyForm() {
  const { getSessionData } = useSessionStorage();
  const token = getSessionData("token")?.value || "";
  const [otpVerification, { error, isSuccess, isLoading }] =
    useOtpVerificationMutation();

  useHandleNotifications({
    error: error,
    isSuccess: isSuccess,
    successMessage: "OTP verify successfuly",
    redirectPath:"/auth/sign-in"
  });

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const otpValue = watch("otp");

  async function onSubmit(data: OTPFormData) {
    await otpVerification({ otpValue: data.otp, token });
  }

  return (
      <Card className="w-full max-w-md overflow-hidden shadow-lg">
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="p-6">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="bg-primary/10 p-3 rounded-full mb-4">
                  <LockClosedIcon className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-3xl font-bold text-primary">Verify OTP</h1>
                <p className="text-muted-foreground text-sm mt-2">
                  Enter the 6-digit code sent to your device
                </p>
              </div>

              <div className="my-4">
                <InputOTP
                  value={otpValue}
                  onChange={(value) => setValue("otp", value)}
                  maxLength={6}
                  className="gap-2"
                >
                  <InputOTPGroup>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <InputOTPSlot
                        key={i}
                        index={i}
                        className="rounded-md border-2"
                      />
                    ))}
                  </InputOTPGroup>
                  <InputOTPSeparator>-</InputOTPSeparator>
                  <InputOTPGroup>
                    {Array.from({ length: 3 }).map((_, i) => (
                      <InputOTPSlot
                        key={i + 3}
                        index={i + 3}
                        className="rounded-md border-2"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
                {errors.otp && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors.otp.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                disabled={isLoading || otpValue.length !== 6 || !token}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Verify OTP"
                )}
              </Button>
            </div>
          </form>
        </CardContent>

        <CardFooter className="bg-muted/50 p-4">
          <ResendBtn />
        </CardFooter>
      </Card>
  );
}
