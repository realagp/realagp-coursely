"use client"

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useConfetti } from "@/hooks/confetti";
import { ArrowUpRight, BadgeCheck } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react"

const PurchaseCancelled = () => {

    const { triggerConfetti } = useConfetti();

    useEffect(() => {
        triggerConfetti();
    },[])

  return (
    <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md w-full">
            <CardHeader className="text-center">
                <div className="bg-green-600/10 rounded-full p-2 w-fit mx-auto">
                    <BadgeCheck className="size-12 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Purchase Successful</CardTitle>
                <CardDescription className="text-sm mx-auto">
                    Your payment was processed successfully. Welcome aboard!
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Link href="/dashboard" className={buttonVariants({
                    variant: "outline",
                    className: "w-full"
                })}>
                    Go to Dashboard
                    <ArrowUpRight className="size-5"/>
                </Link>
            </CardContent>
        </Card>
    </div>
  )
}

export default PurchaseCancelled;