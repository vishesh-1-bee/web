"use client";
import { Button } from "@/components/ui/button";
import { SignInButton, useUser } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import path from "path";
import React from "react";

const Headers = () => {
  const { user } = useUser();
  const MenuItems = [
    {
      name: "Pricing",
      path: "/pricing",
    },
    {
      name: "Contact Us",
      path: "/conatct-us",
    },
  ];
  return (
    <div className="p-2 mt-3 border rounded-full flex justify-between shadow-xl">
      {/* logo */}
      <div className="flex gap-2 items-center">
        <Image
          className=""
          src={"/logo.svg"}
          alt="logo"
          width={35}
          height={35}
        />
        <h2 className="font-semibold text-lg">AI Website Generateor</h2>
      </div>

      {/* Menu Options */}
      <div className="space-x-3">
        {MenuItems.map((item, index) => (
          <Button className="rounded-2xl" key={index} variant={"ghost"}>
            {item.name}
          </Button>
        ))}
      </div>
      {/* Signin Section */}
      <div>
        {!user ? (
          <SignInButton mode="modal" forceRedirectUrl={"/workspace"}>
            <Button
              size={"lg"}
              className="hover:bg-white hover:text-black transition-all duration-300 rounded-2xl cursor-pointer"
            >
              Get Started <ArrowRight />
            </Button>
          </SignInButton>
        ) : (
          <Link href={'/workspace'}>
          <Button
            size={"lg"}
            className="hover:bg-white hover:text-black transition-all duration-300 rounded-2xl cursor-pointer"
          >
            Get Started <ArrowRight />
          </Button></Link>
        )}
      </div>
    </div>
  );
};

export default Headers;
