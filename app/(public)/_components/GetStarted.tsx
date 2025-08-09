"use client"

import { buttonVariants } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { ArrowUpRight } from "lucide-react"
import Link from "next/link"
import React from "react"

const GetStarted = () => {

    const {data: session, isPending} = authClient.useSession();
    
  return (
    <div className="flex flex-col sm:flex-row gap-4 mt-8">
        {isPending ? null : session ? (
            <Link 
            href="/courses"
            className={buttonVariants({size: "lg", variant: "outline",})}>
                Explore Courses <ArrowUpRight className="size-5" />
            </Link>
        ) : (
        <>
            <Link 
            href="/login"
            className={buttonVariants({size: "lg",})}>
                Get Started
            </Link>
            <Link 
            href="/courses"
            className={buttonVariants({size: "lg",variant: "outline",})}>
                Explore Courses <ArrowUpRight className="size-5" />
            </Link>
        </>
        )}
    </div>
  )
}

export default GetStarted