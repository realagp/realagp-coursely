import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Undo2, XIcon } from "lucide-react";
import Link from "next/link";
import React from "react"

const PurchaseCancelled = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md w-full">
            <CardHeader className="text-center">
                <div className="bg-destructive/10 rounded-full p-2 w-fit mx-auto">
                    <XIcon className="size-12 text-destructive" />
                </div>
                <CardTitle className="text-2xl">Payment Cancelled</CardTitle>
                <CardDescription className="text-sm mx-auto">
                    Your payment was not processed. You can retry anytime.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Link href="/courses" className={buttonVariants({
                    variant: "outline",
                    className: "w-full"
                })}>
                    <Undo2 className="size-5"/>
                    Back to Courses
                </Link>
            </CardContent>
        </Card>
    </div>
  )
}

export default PurchaseCancelled;