"use client"

import React, { useState, useTransition } from "react"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import googleLogo from '@/public/icons/google-logo.svg';
import githubLogo from '@/public/icons/github-logo.svg';
import Image from "next/image";
import Link from "next/link";

const LoginForm = () => {
  const router = useRouter(); 
  const [isGithubPending, startGithubTransition] = useTransition();
  const [isGooglePending, startGoogleTransition] = useTransition();
  const [emailPending, startEmailTransition] = useTransition();
  const [email, setEmail] = useState("");

  async function handleGithubLogin() {
    startGithubTransition(async () => {
      await authClient.signIn.social({
      provider: 'github',
      callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Redirecting to Github for sign-in...");
          },
          onError: () => {
            toast.success("An error occurred while logging in with Github.");
          },
        },
      });
    })
  }

  async function handleGoogleLogin() {
    startGoogleTransition(async () => {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Redirecting to Google for sign-in...");
          },
          onError: () => {
            toast.error("An error occurred during Google login.");
          },
        },
      });
    })
  }

  function handleEmailLogin() {
    startEmailTransition(async () => {
      await authClient.emailOtp.sendVerificationOtp({
        email: email,
        type: "sign-in",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Verification code sent to your email.");
            router.push(`/verify-request?email=${email}`);
          },
          onError: () => {
            toast.error("An error occurred while sending the verification code.");
          },
        },
      });
    })
  }

  return (
    <>
      <div className="px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Login with</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button
              disabled={isGooglePending} 
              onClick={handleGoogleLogin} 
              className="w-full" 
              variant="outline">
              {isGooglePending ? (
                <>
                  <Loader className="size-4 animate-spin" /> Redirecting
                </>
              ):(
                <>
                  <Image src={googleLogo} alt="Google" width={16} height={16}/>
                  Google
                </>
              )}
            </Button>
            <Button
              disabled={isGithubPending} 
              onClick={handleGithubLogin} 
              className="w-full" 
              variant="outline">
              {isGithubPending ? (
                <>
                  <Loader className="size-4 animate-spin" /> Redirecting
                </>
              ):(
                <>
                  <Image src={githubLogo} alt="Github" width={16} height={16}/>
                  Github
                </>
              )}
            </Button>
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
            <div className="grid gap-4">
              <div className="grid gap-4">
                <Label htmlFor="email">Email</Label>
                <Input 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                type="email" 
                placeholder="sample@gmail.com"/>
              </div>
              <Button onClick={handleEmailLogin} disabled={emailPending}>
                {emailPending ? (
                  <>
                    <Loader className="size-4 animate-spin" /> Sending
                  </>
                ) : (
                  <>
                    <span>Continue</span>
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="text-balance text-center text-sm text-muted-foreground">
        By clicking continue, you agree to our <Link href="/terms" className="text-primary underline">Terms of Service</Link> and <Link href="/privacy" className="text-primary underline">Privacy Policy</Link>.
      </div>    
    </>
  )
}

export default LoginForm;