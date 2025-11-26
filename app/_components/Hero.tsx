"use client"
import { Button } from "@/components/ui/button";
import { SignInButton, useUser } from "@clerk/nextjs";
import axios from "axios";
import { v4 as uuidv4 } from 'uuid';
import {
  ArrowUp,
  HomeIcon,
  ImagePlus,
  Key,
  LayoutDashboard,
  LoaderIcon,
  User,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";


const Hero = () => {
    const[userimput , setuserinput] = useState<string>()
    const {user}= useUser()
   const router = useRouter()
   const[loading , setloading] = useState(false)


    const createNewProject = async()=>{
      setloading(true)
      try {
        //using uuid package fro the unique project id
        const projectId=uuidv4()
        const frame=generateRandomFrame();
        const messages = [
          {
            role:'user',
            content:userimput
          }
        ]

        const results = await axios.post("/api/users/project",{
          projectId:projectId,
          frameId:frame,
          messages:messages
        })
        console.log(results.data);
        toast.success('project created')

        //naigate to the palygroung page 
        router.push(`/playground/${projectId}?frameId=${frame}`)
        setloading(false)
      } catch (error) {
        toast.error("internal server error")
        console.log(error);
        
      }
    }
  const suggestion = [
    {
      label: "Dashboard",
      prompt:
        "Create an analytics dashboard to track customers and revenue data for a SaaS",
      icon: LayoutDashboard,
    },
    {
      label: "SignUp Form",
      prompt:
        "Create a modern sign up form with email/password fields, Google and Github login options, and terms checkbox",
      icon: Key,
    },
    {
      label: "Hero",
      prompt:
        "Create a modern header and centered hero section for a productivity SaaS. Include a badge for feature announcement, a title with a subtle gradient effect, subtitle, CTA, small social proof and an image.",
      icon: HomeIcon,
    },
    {
      label: "User Profile Card",
      prompt:
        "Create a modern user profile card component for a social media website",
      icon: User,
    },
  ];

  return (
    <div className="flex flex-col justify-center h-[70vh] items-center ">
      {/* header */}
      <div className=" space-y-2 flex flex-col justify-center items-center">
        <h1 className="font-bold text-7xl">What should we design ?</h1>
        <h3 className="text-lg font-light text-slate-600">
          Generate , edit and explore design with AI and export code
        </h3>
      </div>

      {/* text box section */}

      <div className="w-full max-w-xl rounded-md border p-3 mt-6">
        <textarea value={userimput} onChange={(e)=>setuserinput(e.target.value)}
          placeholder="Describe your page design...."
          className="focus:ring-0 focus:outline-none w-full h-24 resize-none"
        />
        <div className="flex justify-between items-center">
          <Button variant={"ghost"}>
            <ImagePlus />
          </Button>
          {!user ?  <SignInButton mode="modal" forceRedirectUrl={'/workspace'}>
          <Button size={"icon"} disabled={!userimput}>
            <ArrowUp />
          </Button></SignInButton>
          :
          
          <Button size={"icon"} disabled={!userimput || loading} onClick={createNewProject}>
            {loading ? <LoaderIcon className="animate-spin"/>:<ArrowUp /> }
          </Button>
          }
         
        </div>
      </div>
      {/* Suggestion section */}
      <div className="flex gap-2 mt-2">
        {suggestion.map((item, index) => (
          <Button key={index} variant={"ghost"} className="border" onClick={()=>setuserinput(item.prompt)}>
            <item.icon />
            {item.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Hero;


 const generateRandomFrame=()=>{
      const num = Math.floor(Math.random()*10000);
      return num
    }