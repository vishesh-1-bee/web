"use client";
import React, { Children, useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { Usercontext } from "@/context/Usercontext";

function Provider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //geting if there is the user from clerk
  const { user } = useUser();
  const [userDeatils, setuserDetails] = useState("");
  useEffect(() => {
    user && createNewUser();
  }, [user]);
  const createNewUser = async () => {
    const result = await axios.post("/api/users", {});
    console.log(result.data);
    setuserDetails(result.data?.user)
  };
  return (
    <div>
      <Usercontext.Provider value={{userDeatils,setuserDetails}}>{children}</Usercontext.Provider>
    </div>
  );
}

export default Provider;

//we are using provider as we want the layout file oon client ans server side
