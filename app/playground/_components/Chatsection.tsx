import React, { useState } from "react";
import { Messages } from "../[projectId]/page";
import { Button } from "@/components/ui/button";
import { ArrowUp } from "lucide-react";

type Props = {
  messages: Messages[];
  onSend: any;
  loading: boolean;
};
const Chatsection = ({ messages, onSend, loading }: Props) => {
  const [input, setimput] = useState<string>();

  //handle send button

  const handleSend = () => {
    if (!input?.trim()) return;
    onSend(input);
    setimput(" ");
  };
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
                  item.role == "user"
                    ? "bg-slate-300 text-sm"
                    : "bg-slate-500 text-sm"
                }`}
              >
                {item.content}
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="flex justify-center items-center gap-3 p-2">
            <div className="animate-spin rounded-full h-7 w-7 border-t-2 border-b-2 border-zinc-700"></div>
            <span className="text-zinc-400">Working on your request...</span>
          </div>
        )}
      </div>
      {/* Footer input section */}
      <div className="p-3 border-t flex items-center gap-3">
        <textarea
          value={input}
          placeholder="Describe your website details"
          onChange={(e) => setimput(e.target.value)}
          className="flex-1 resize-none border rounded-lg px-3 py-2 focus:outline-none focus:ring text-sm"
        />
        <Button onClick={handleSend}>
          <ArrowUp />
        </Button>
      </div>
    </div>
  );
};

export default Chatsection;
