"use client"
import React, { useEffect, useState } from "react";
import PlaygroundHeader from "../_components/PlaygroundHeader";
import Chatsection from "../_components/Chatsection";
import Websitesection from "../_components/Websitesection";
import Settingsection from "../_components/Settingsection";
import { useParams, useSearchParams } from "next/navigation";
import axios from "axios";

export type Frame={
  projectId:string,
  frameId:string,
  designCode:string,
  chatmessage:Messages[]
}

export type Messages={
  role:string,
  content:string
}
const PlayGround = () => {
  const {projectId}=useParams()
  const frame = useSearchParams()
  const frameId = frame.get('frameId')
  const[framedeatils , setframedetails]=useState<Frame>()
  console.log(frameId)
  console.log(projectId);
  useEffect(()=>{
   frameId &&  getframedetails()
  },[frameId])

  //now we are fetching the information related to a particular frameid
  const getframedetails =async()=>{
    const result = await axios.get('/api/frames?frameId='+frameId+'&projectId='+projectId)
    console.log(result.data);
    setframedetails(result.data)
  }
  return (
    <div>
      {/* Header section */}
      <PlaygroundHeader />
      <div className="flex">
        {/* Chat section */}
        <Chatsection messages={framedeatils?.chatmessage?? []} />
        {/* website section */}
        <Websitesection />
        {/* setting section */}
        {/* <Settingsection /> */}
      </div>
    </div>
  );
};

export default PlayGround;
