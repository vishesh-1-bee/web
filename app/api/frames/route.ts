
import { db } from "@/config/db";
import { chatTable, frameTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const frameId=searchParams.get('frameId')
  const projectId=searchParams.get('projectId')

  //now we are fetching the frame info using the frame id
  const frameResult= await db.select().from(frameTable)
     //@ts-ignore
  .where(eq(frameTable.frameId,frameId));

   //now we are fetching the chat info using the frame id
   const chatResult= await db.select().from(chatTable)
      //@ts-ignore
   .where(eq(chatTable.frameId, frameId))


   const finalResult={
    ...frameResult[0],
    chatmessage:chatResult[0].chatMesages
   }
   return NextResponse.json(finalResult)
}


export async function PUT(req:NextRequest) {
   const {designCode ,frameId}=await req.json();

   const result =await db.update(frameTable).set({
      designCode:designCode,

   }).where(eq(frameTable.frameId, frameId))

   return NextResponse.json({result})
}