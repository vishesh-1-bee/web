import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React from 'react'

const PlaygroundHeader = () => {
  return (
    <div className='flex justify-between items-center border p-2 rounded-2xl shadow-xl mt-1'>
     <Image src={'/logo.svg'} alt='logo' height={30} width={30}/>
     <Button>Save</Button>
    </div>
  )
}

export default PlaygroundHeader
