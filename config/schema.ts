
import { integer, json, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  credits:integer().default(2)
});

export const projectTable= pgTable("projects",{
   id: integer().primaryKey().generatedAlwaysAsIdentity(),
   projectId:varchar(),
   createdBy:varchar().references(()=>usersTable.email),
   createdon:timestamp().defaultNow()
})

export const frameTable = pgTable("frames",{
   id: integer().primaryKey().generatedAlwaysAsIdentity(),
   frameId:varchar(),
   designCode:text(),
   projectId:varchar().references(()=>projectTable.projectId  )
})


export const chatTable= pgTable("chats",{
   id: integer().primaryKey().generatedAlwaysAsIdentity(),
   chatMesages: json(),
   frameId:varchar().references(()=>frameTable.frameId),
    createdBy:varchar().references(()=>usersTable.email),
   createdon:timestamp().defaultNow()
})

//here we created last three table to set the projectid and no of frame used and the chat messages in the db
//note: after making changes in schema always push it in th edrizzel