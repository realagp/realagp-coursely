import {
  ChevronDownIcon,
  LayoutDashboard,
  LogOutIcon,
  Mail,
  Moon,
  Sun,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import useSignOut from "@/hooks/sign-out"
import { authClient } from "@/lib/auth-client"
import MoonSunToggle from "./MoonSunToggle"

interface UserDropdownProps {
  name: string;
  email: string;
  image: string;
}

export default function UserDropdown({name, email, image}: UserDropdownProps) {

  const {data: session} = authClient.useSession();
  const handleLogout = useSignOut();

  const handleEmail = () => {
    const email = "support@example.com";
    const subject = "Need Help";
    const body = "Hi, I need assistance with...";
    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      email
    )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(url, "_blank");
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0 hover:bg-transparent">
          <Avatar>
            <AvatarImage src={image} alt="Profile image" />
            <AvatarFallback>{name[0].toUpperCase()}</AvatarFallback>
          </Avatar>
          <ChevronDownIcon
            size={16}
            className="opacity-60"
            aria-hidden="true"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-w-64">
        <DropdownMenuLabel className="flex min-w-0 flex-col">
          <span className="text-foreground truncate text-sm font-medium">
            {name}
          </span>
          <span className="text-muted-foreground truncate text-xs font-normal">
            {email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              href={session?.user?.role === "admin" ? "/admin/dashboard" : "/dashboard"}
              className="flex items-center gap-2 w-full"
            >
              <LayoutDashboard size={16} className="opacity-60" aria-hidden="true" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
          {session?.user?.role === "user" && (
            <DropdownMenuItem onClick={handleEmail}>
              <div className="flex items-center gap-2">
                <Mail size={16} className="opacity-60" aria-hidden="true" />
                <span>Email Us</span>
              </div>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem className="md:hidden">
            <MoonSunToggle />
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <LogOutIcon size={16} className="opacity-60" aria-hidden="true" />
          <span>Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}