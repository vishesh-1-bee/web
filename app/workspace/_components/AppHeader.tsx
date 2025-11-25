import { SidebarTrigger } from '@/components/ui/sidebar'
import { UserButton } from '@clerk/nextjs'
import React from 'react'

const AppHeader = () => {
  return (
    <div className='flex justify-between items-center border rounded-lg bg-gray-50 p-3 shadow-xl'>
     <SidebarTrigger/>
     <UserButton/>
    </div>
  )
}

export default AppHeader
