"use client";

import React, { useEffect, useState } from "react";
import PlaygroundHeader from "../_components/PlaygroundHeader";
import Chatsection from "../_components/Chatsection";
import Websitesection from "../_components/Websitesection";
import { useParams, useSearchParams } from "next/navigation";
import axios from "axios";

export type Frame = {
  projectId: string;
  frameId: string;
  designCode: string;
  chatmessage: Messages[];
};

export type Messages = {
  role: string;
  content: string;
};

const Prompt = `
userInput: {userInput}

Instructions:
You must classify the user input into **two modes**:

====================================================
MODE 1 — CODE GENERATION MODE
====================================================
Trigger this mode ONLY if the user input explicitly asks for:
- Code generation
- Website/UI creation
- HTML/CSS/JS/Tailwind/Flowbite output
- Web components, dashboards, landing pages, templates
- Any instruction containing verbs like “create”, “build”, “generate”, “design” in a UI/code context

When in CODE GENERATION MODE, follow ALL rules below:
1. Generate complete **HTML with Tailwind CSS**, using **Flowbite UI components**.
2. Use a **modern design** with **blue as the primary color theme**.
3. Output **ONLY the <body> content** — do NOT include <head>, <title>, or external links.
4. Layout must be:
   - Fully responsive
   - Well-spaced
   - Clean hierarchy
5. Components must be independent.
6. Image placeholders:
   - Light: https://community.softr.io/uploads/db9110/original/2X/7/746ee7e382d0ffd57773cca9a7e0f6f8174b6a86.jpeg
   - Dark: https://www.cibaiy.com/wp-content/uploads/2015/12/placeholder-3.jpg
7. Allowed libraries: Flowbite, FontAwesome, Chart.js, Swiper.js, Tippy.js
8. Include interactive elements.
9. Charts must match the blue theme.
10. Nav items should be spaced apart.
11. No broken links.
12. Do NOT add any explanation before or after the HTML.

====================================================
MODE 2 — TEXT RESPONSE MODE
====================================================
Trigger this mode when input is NOT asking to generate code/UI.

When in TEXT RESPONSE MODE:
- Respond naturally and friendly.
- Do NOT output code.

====================================================
Always choose the correct mode.
`;

const PlayGround = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<Messages[]>([]);
  const [generatedCode, setGeneratedCode] = useState<string>("");

  const { projectId } = useParams();
  const frame = useSearchParams();
  const frameId = frame.get("frameId");

  const [frameDetails, setFrameDetails] = useState<Frame | null>(null);

  // Fetch frame details when frameId changes
  useEffect(() => {
    if (frameId) getFrameDetails();
  }, [frameId]);

  // -------------------------------------------------------
  // Fetch frame details
  // -------------------------------------------------------
  const getFrameDetails = async () => {
    const result = await axios.get(
      `/api/frames?frameId=${frameId}&projectId=${projectId}`
    );

    setFrameDetails(result.data);

    if (result.data?.chatmessage?.length === 1) {
      const usermessage = result.data.chatmessage[0].content;
      sendMessage(usermessage);
    } else {
      setMessage(result.data?.chatmessage);
    }
  };

  // -------------------------------------------------------
  // Send a prompt to AI
  // -------------------------------------------------------
  const sendMessage = async (userinput: string) => {
    setLoading(true);

    setMessage((prev) => [...prev, { role: "user", content: userinput }]);

    const response = await fetch("/api/ai-model", {
      method: "POST",
      body: JSON.stringify({
        messages: [
          { role: "user", content: Prompt.replace("{userInput}", userinput) },
        ],
      }),
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    let airesponse = "";
    let isCode = false;

    const htmlTriggers = [
      "```html",
      "<div",
      "<body",
      "<section",
      "<main",
      "<header",
      "<nav",
      "<footer",
      "<img",
      "<script",
    ];

    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;

      const chunk = decoder.decode(value);
      airesponse += chunk;

      // Detect if HTML/code output starts
      if (!isCode && htmlTriggers.some((t) => chunk.includes(t))) {
        isCode = true;
      }

      // If HTML detected → send to preview panel
      if (isCode) {
        setGeneratedCode((prev) => (prev || "") + chunk);
        continue;
      }
    }

    // If no HTML → normal text reply
    if (!isCode) {
      setMessage((prev) => [...prev, { role: "assistant", content: airesponse }]);
    } else {
      setMessage((prev) => [
        ...prev,
        { role: "assistant", content: "Your code is ready!" },
      ]);
    }

    setLoading(false);
  };

  // Debugging output
  useEffect(() => {
    console.log("Generated Code:", generatedCode);
  }, [generatedCode]);

  // Save chat when messages change
  useEffect(() => {
    if (message.length > 0) saveMessages();
  }, [message]);

  const saveMessages = async () => {
    await axios.put("/api/chats", {
      message,
      frameId,
    });
  };

  return (
    <div>
      <PlaygroundHeader />

      <div className="flex">
        <Chatsection
          messages={message ?? []}
          onSend={(input: string) => sendMessage(input)}
          loading={loading}
        />

        <Websitesection generatedCode={generatedCode} />
      </div>
    </div>
  );
};

export default PlayGround;
