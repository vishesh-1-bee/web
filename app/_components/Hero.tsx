"use client"
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";
import {
  ArrowUp,
  HomeIcon,
  ImagePlus,
  Key,
  LayoutDashboard,
  User,
} from "lucide-react";
import React, { useState } from "react";

const Hero = () => {
    const[userimput , setuserinput] = useState<string>()
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
          <SignInButton mode="modal">
          <Button size={"icon"}>
            <ArrowUp />
          </Button></SignInButton>
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
