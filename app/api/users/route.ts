import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  //using clerk we get the user information
  const user = await currentUser();
  //chexk if user alredy exist
  const userResult = await db
    .select()
    .from(usersTable)
    //@ts-ignore
    .where(eq(usersTable.email, user?.primaryEmailAddress?.emailAddress));

  //if not then save in the database
  if (userResult?.length==0) {
    const result = await db.insert(usersTable).values({
        name:user?.fullName??"",
        email:user?.primaryEmailAddress?.emailAddress??""
    })
  }

  return NextResponse.json({user:userResult[0]});
}
