"use client";

import { Button } from "@/components/ui/button";
import { useHandleNotifications } from "@/hooks/use-notification-handler";
import { useSessionStorage } from "@/lib/setSessionData";
import { useReSendMutation } from "@/state/auth-api";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";

export const ResendBtn = () => {
  const { getSessionData } = useSessionStorage();
  const token = getSessionData("token")?.value || "";
  const [countdown, setCountdown] = useState(59);
  const [reSend, { error, isSuccess, isLoading }] = useReSendMutation();

  useHandleNotifications({
    error,
    isSuccess,
    successMessage: "OTP resent successfully",
  });

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  async function resendOTPHandler() {
    if (countdown > 0 || !token) return;
    setCountdown(59);
    await reSend({ token });
  }

  return (
    <div className="w-full text-center">
      <Button
        onClick={resendOTPHandler}
        variant="outline"
        className="w-full flex items-center justify-center gap-2"
        disabled={countdown > 0 || !token || isLoading}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : countdown > 0 ? (
          `Resend in ${countdown}s`
        ) : (
          "Resend OTP"
        )}
      </Button>
    </div>
  );
};
