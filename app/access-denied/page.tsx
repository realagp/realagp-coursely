import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldXIcon, Undo2 } from "lucide-react";
import Link from "next/link";
import React from "react"

const AccessDenied = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
        <Card className="max-w-md w-full">
            <CardHeader className="text-center">
                <div className="bg-destructive/10 rounded-full p-2 w-fit mx-auto">
                    <ShieldXIcon className="size-12 text-destructive" />
                </div>
                <CardTitle className="text-2xl">Access Denied</CardTitle>
                <CardDescription className="text-sm mx-auto">
                    <span className="text-destructive font-bold">403</span> | You do not have permission to perform this action.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Link href="/" className={buttonVariants({
                    variant: "outline",
                    className: "w-full"
                })}>
                    <Undo2 className="size-5"/>
                    Back to Home
                </Link>
            </CardContent>
        </Card>
    </div>
  )
}

export default AccessDenied;