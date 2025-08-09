"use client"

import type { LucideIcon } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { ArrowUpRight, HomeIcon, ZapIcon } from "lucide-react"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
  }[]
}) {

  const pathname = usePathname();
  
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              asChild
              tooltip="Quick Create"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            >
              {pathname.startsWith("/admin") ? (
                <Link href="/admin/courses/create" className="font-semibold justify-center">
                  <ZapIcon />
                  <span>Quick Create</span>
                </Link>                
              ):(
                <Link href="/courses" className="font-semibold justify-center">
                  <span>Explore Courses</span>
                  <ArrowUpRight className="size-5" />
                </Link>                
              )}
            </SidebarMenuButton>
            <Link 
              href="/" 
              className={buttonVariants({
              size: "icon",
              variant: "outline",
            }
            )}>
                <HomeIcon className="size-5"/>
                <span className="sr-only">Home</span>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title} asChild>
                <Link href={item.url} className={cn(pathname === item.url && "bg-accent text-accent-foreground")}>
                  {item.icon && <item.icon className={cn(pathname === item.url && "text-primary size-5")}/>}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
