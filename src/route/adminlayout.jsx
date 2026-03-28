import React from "react"
import { Outlet, NavLink } from "react-router-dom"
import { LayoutDashboard, Users, School, ClipboardCheck } from "lucide-react"

import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
 
} from "../components/ui/sidebar"
import { Button } from "../components/ui/button"

export default function AdminLayout() {
  return (
    <SidebarProvider >
      <div className="flex min-h-screen w-full">
       
        <Sidebar >
          <SidebarHeader className="p-4 text-xl font-semibold">
            Admin Panel
          </SidebarHeader>

          <SidebarContent>
            <SidebarMenu>
            
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `flex items-center p-2 rounded hover:bg-gray-100 ${
                        isActive ? "bg-gray-200 font-bold" : ""
                      }`
                    }
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Students */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/students"
                    className={({ isActive }) =>
                      `flex items-center p-2 rounded hover:bg-gray-100 ${
                        isActive ? "bg-gray-200 font-bold" : ""
                      }`
                    }
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Students
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Classes */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/classes"
                    className={({ isActive }) =>
                      `flex items-center p-2 rounded hover:bg-gray-100 ${
                        isActive ? "bg-gray-200 font-bold" : ""
                      }`
                    }
                  >
                    <School className="mr-2 h-4 w-4" />
                    Classes
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Mark Attendance */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/attendance"
                    className={({ isActive }) =>
                      `flex items-center p-2 rounded hover:bg-gray-100 ${
                        isActive ? "bg-gray-200 font-bold" : ""
                      }`
                    }
                  >
                    <ClipboardCheck className="mr-2 h-4 w-4" />
                    Mark Attendance
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
               <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/viewattendance"
                    className={({ isActive }) =>
                      `flex items-center p-2 rounded hover:bg-gray-100 ${
                        isActive ? "bg-gray-200 font-bold" : ""
                      }`
                    }
                  >
                    <ClipboardCheck className="mr-2 h-4 w-4" />
                    View Attendance
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        

          <SidebarFooter className="p-4 text-sm text-muted-foreground">
              Attendance System
          </SidebarFooter>
        </Sidebar>

      
        <main className="flex-1 w-full">
          
            
          <div className="p-4 bg-white">
         <Outlet />
          </div>
         
        </main>
      </div>
    </SidebarProvider>
  )
}
