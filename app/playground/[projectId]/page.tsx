"use client";
import React, { useEffect, useState } from "react";
import PlaygroundHeader from "../_components/PlaygroundHeader";
import Chatsection from "../_components/Chatsection";
import Websitesection from "../_components/Websitesection";
import Settingsection from "../_components/Settingsection";
import { useParams, useSearchParams } from "next/navigation";
import axios from "axios";
import { textDecoder } from "drizzle-orm";


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


const Prompt=`userInput: {userInput}

Instructions:

1. If the user input is explicitly asking to generate code, design, or HTML/CSS/JS output (e.g., “Create a landing page”, "Build a dashboard", "Generate HTML TailWind CSS code"), then:

- Generate a complete HTML Tailwind CSS code using Flowbite UI components.
- Use a modern design with **blue as the primary color theme**.
- Only include the <body> content (do not add <head> or <title>).
- Make it fully responsive for all screen sizes.
- All primary components must match the theme color.
- Add proper padding and margin for each element.
- Components should be independent; do not connect them.
- Use placeholders for all images:
    - Light mode: https://community.softr.io/uploads/db9110/original/2X/7/746ee7e382d0ffd57773cca9a7e0f6f8174b6a86.jpeg
    - Dark mode: https://www.cibaiy.com/wp-content/uploads/2015/12/placeholder-3.jpg
    - Add alt tag describing the image prompt.
- Use the following libraries/components where appropriate:
    - FontAwesome icons (fa fa-)
    - Flowbite UI components: buttons, modals, forms, tables, tabs, alerts, cards, dialogs, dropdowns, accordions, etc.
    - Chart.js for charts & graphs
    - Swiper.js for sliders/carousels
    - Tippy.js for tooltips & popovers
- Include interactive components like modals, dropdowns, and accordions.
- Ensure proper spacing, alignment, hierarchy, and theme consistency.
- Ensure charts are visually appealing and match the theme color.
- Header menu options should be spread out and not connected.
- Do not include broken links.
- Do not add any extra text before or after the components.

2. If the user input is **general text or greetings** (e.g., "Hi", "Hello", "How are you?") **and does not explicitly ask to generate code**, then:

- Respond with a simple, friendly text message instead of generating any code.

Example:

- User: “Hi” → Response: “Hello! How can I help you today?”
- User: “Build a responsive landing page with Tailwind CSS” → Response: [Generate full HTML code as per instructions above]`







const PlayGround = () => {
  const [loading, setloading] = useState(false);
  const [message, setmessage] = useState<Messages[]>([]);
  const [generatedCode , setGeneratedCode]=useState<string>("")
  const { projectId } = useParams();
  const frame = useSearchParams();
  const frameId = frame.get("frameId");
  const [framedeatils, setframedetails] = useState<Frame| null>(null);
  console.log(frameId);
  console.log(projectId);
  useEffect(() => {
    frameId && getframedetails();
  }, [frameId]);

  //now we are fetching the information related to a particular frameid
  const getframedetails = async () => {
    const result = await axios.get(
      "/api/frames?frameId=" + frameId + "&projectId=" + projectId
    );
    console.log(result.data);
    setframedetails(result.data);

    //check wheter it is only one record in the table
    if (result.data?.chatmessage?.length==1) {
      const usermessage = result.data?.chatmessage[0].content;
      sendMessage(usermessage)
    }
  };

  //it is the method for the chat input for the changes and message to api
const sendMessage = async (userinput: string) => {
  setloading(true);

  setmessage(prev => [...prev, { role: "user", content: userinput }]);

  const response = await fetch("/api/ai-model", {
    method: "POST",
    body: JSON.stringify({
      messages: [{ role: "user", content: Prompt?.replace('{userInput}', userinput) }],
    }),
  });

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  let airesponse = "";
  let isCode = false;

  while (true) {
    const { done, value } = await reader!.read();
    if (done) break;

    const chunk = decoder.decode(value);
    airesponse += chunk;

    // Detect start of HTML code block
    if (!isCode && airesponse.includes("```html")) {
      isCode = true;

      const after = airesponse.split("```html")[1];
      if (after) {
        setGeneratedCode(prev => (prev || "") + after);
      }
      continue;
    }

    // If inside code block → stream to website
    if (isCode) {
      setGeneratedCode(prev => (prev || "") + chunk);
      continue;
    }
  }

  // If no code was generated → normal text message
  if (!isCode) {
    setmessage(prev => [
      ...prev,
      { role: "assistant", content: airesponse }
    ]);
  } else {
    setmessage(prev => [
      ...prev,
      { role: "assistant", content: "Your code is ready!" }
    ]);
  }

  setloading(false);
};

useEffect(()=>{
  console.log(generatedCode);
  
},[generatedCode])

  return (
    <div>
      {/* Header section */}
      <PlaygroundHeader />
      <div className="flex">
        {/* Chat section */}
        <Chatsection
          messages={message ?? []}
          onSend={(input: string) => sendMessage(input)}
          loading={loading}
        />
        {/* website section */}
        <Websitesection />
        {/* setting section */}
        {/* <Settingsection /> */}
      </div>
    </div>
  );
};

export default PlayGround;
