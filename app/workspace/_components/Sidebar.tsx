"use client"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Usercontext } from "@/context/Usercontext"
import { UserButton } from "@clerk/nextjs"

import Image from "next/image"
import Link from "next/link"
import { useContext, useState } from "react"

export function AppSidebar() {
    const [project , setproject]=useState([])
    const {userDeatils,setuserDetails}= useContext(Usercontext);
  return (
    <Sidebar>
      <SidebarHeader className="pt-3" >
        <div className="flex items-center gap-3 ">
            <Image src={'/logo.svg'} alt="logo" height={33} width={33}/>
            <h2 className="text-lg font-semibold">AI website Generateor</h2>
        </div>
        <Link href={'/workspace'}>
        <Button className="mt-3 w-full">+ Add New Project</Button></Link>
      </SidebarHeader>
      <SidebarContent className="p-4">
        <SidebarGroup>
            <SidebarGroupLabel className="text-2xl font-semibold">Projects</SidebarGroupLabel>
            {project.length==0 && <h2 className="text-sm px-2 mt-2 text-gray-400">No project found</h2>}
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter >
        <div className="border space-y-3 p-3 bg-gray-200 rounded-xl">
          <h2 className="flex justify-between items-center">Remaining Credits <span>{userDeatils?.credits}</span></h2>
          <Progress value={33}></Progress>
          <Button className="w-full mt-2">Upgrade to Unlimited</Button>
        </div>
        <div className="border flex gap-2 rounded-md bg-gray-100 p-2">
            
            <UserButton/>
            <h2>Profile</h2>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}