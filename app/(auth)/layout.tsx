import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { ReactNode } from "react" // Adjust the path as necessary

const AuthLayout = ({children}:{children: ReactNode}) => {
  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center">
      <Link href="/" className={buttonVariants({variant: "outline", className: "absolute left-4 top-4"})}>
        <ArrowLeft className="size-4"/>
        Back
      </Link>
        <div className="flex w-full max-w-sm flex-col gap-6">
          <Link href="/" className="flex items-center self-center font-medium gap-2">
          <Image src="/icons/logo.png" alt="logo" height={32} width={32} />
            Coursely
          </Link>
          {children}
        </div> 
    </div>
  )
}

export default AuthLayout;