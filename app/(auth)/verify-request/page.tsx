"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useState, useTransition } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Loader } from "lucide-react";

const VerifyRequest = () => {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [emailPending, startEmailTransition] = useTransition();
  const [resendPending, setResendPending] = useState(false);
  const params = useSearchParams();
  const email = params.get("email") as string;
  const isValidEmail = otp.length === 6;

  function handleOTP() {
    startEmailTransition(async () => {
      await authClient.signIn.emailOtp({
        email: email,
        otp: otp,
        fetchOptions: {
          onSuccess: () => {
            toast.success("Email verified");
            router.push("/");
          },
          onError: () => {
            toast.error("Invalid OTP or email not found.");
          },
        },
      });
    });
  }

  async function handleResend() {
    setResendPending(true);
    try {
      await authClient.emailOtp.sendVerificationOtp({
        email: email,
        type: "sign-in",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Verification code resent to your email.");
          },
          onError: () => {
            toast.error("Failed to resend verification code.");
          },
        },
      });
    } catch {
      toast.error("Failed to resend verification code.");
    } finally {
      setResendPending(false);
    }
  }

  return (
    <>
      <div className="px-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Verify your email address</CardTitle>
            <CardDescription>
              We have sent a verification code to your email. Please check your inbox and enter the code to verify your account.
            </CardDescription>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-2">
                <InputOTP
                  value={otp}
                  onChange={(value) => setOtp(value)}
                  maxLength={6}
                  className="gap-2"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>

                {/* Resend code section */}
                <p className="text-sm text-muted-foreground">
                  Didn’t receive code?{" "}
                  <button
                    onClick={handleResend}
                    disabled={resendPending}
                    className="text-green-600 hover:underline disabled:text-gray-400 cursor-pointer"
                    type="button"
                  >
                    {resendPending ? "Resending..." : "Resend"}
                  </button>
                </p>
              </div>

              <Button onClick={handleOTP} disabled={emailPending || !isValidEmail} className="w-full">
                {emailPending ? (
                  <><Loader className="size-4 animate-spin" /> Verifying</>
                ) : (
                  <> Verify Email </>
                )}
              </Button>
            </CardContent>
          </CardHeader>
        </Card>
      </div>
    </>
  );
};

export default VerifyRequest;
