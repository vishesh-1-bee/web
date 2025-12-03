import { db } from "@/config/db";
import { chatTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";


export async function PUT(req:NextRequest) {
    const{message , frameId}= await req.json();

    const result = await db.update(chatTable).set({
        chatMesages:message
        //@ts-ignore
    }).where(eq(chatTable.frameId, frameId))

    return NextResponse.json({result})
}