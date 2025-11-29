import React from "react";
import { Messages } from "../[projectId]/page";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

type Props = {
  messages: Messages[];
};
const Chatsection = ({ messages }: Props) => {
  console.log("Messages received in Chatsection:", messages);
  return (
    <div className="w-80 shadow h-[90vh] mt-2 flex flex-col">
      {/* Message section */}
      <div className="flex-1 overflow-y-auto p-1 space-y-3 flex flex-col">
        {messages?.length === 0 ? (
          <p className="text-gray-400 text-center ">No messages yet</p>
        ) : (
          messages.map((item, index) => (
            <div
              key={index}
              className={`flex ${
                item.role == "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-2 rounded-lg max-w-[80%] ${
                  item.role == "user" ? "bg-slate-300 text-sm" : "bg-slate-500 text-sm"
                }`}
              >
                {item.content}
              </div>
            </div>
          ))
        )}
      </div>
      {/* Footer input section */}
      <div className="p-3 border-t flex items-center gap-3">
        <textarea placeholder="Describe your website details"
        className="flex-1 resize-none border rounded-lg px-3 py-2 focus:outline-none focus:ring text-sm" />
        <Button><ArrowUp/></Button>
      </div>
    </div>
  );
};

export default Chatsection;
