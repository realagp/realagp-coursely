import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

import Link from "next/link"
import { Undo2 } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"

type SiteHeaderProps = {
  title?: string
}

export function SiteHeader({title}: SiteHeaderProps) {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium leading-tight truncate">{title}</h1> 
        <div className="ml-auto">
          <Link href={"/dashboard"} className={buttonVariants({
            variant: "outline",
            size: "sm"
          })}>
            <Undo2 className="size-5" /> Dashboard
          </Link> 
        </div>
      </div>
    </header>
  )
}
