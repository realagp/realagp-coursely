import * as React from "react"
import { NavUser } from "@/components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar"
import ProgressHeader from "./ProgressHeader"
import { SidebarDataType } from "@/app/data/course/get-sidebar-data";
import ProgressContent from "./ProgressContent";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  course: SidebarDataType["course"];
}

export function AppSidebar({ course, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <ProgressHeader course={course}/>
      </SidebarHeader>
      <SidebarContent>
        <ProgressContent course={course}/>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
