import { Button } from "@/components/ui/button";
import {
  Code2Icon,
  Download,
  Monitor,
  SquareArrowUp,
  TabletSmartphone,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { blob } from "stream/consumers";
import Viewcode from "./Viewcode";

const HTML_CODE = `<!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <script src="https://cdn.tailwindcss.com"></script>

        <link href="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.css" rel="stylesheet" />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/2.3.0/flowbite.min.js"></script>

        <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>
        <link href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css" rel="stylesheet" />

        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>

        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.css" />
        <script src="https://cdn.jsdelivr.net/npm/swiper@10/swiper-bundle.min.js"></script>

      </head>

      <body id="root">
{code}
</body>
      </html>`;

const WebpageTolls = ({
  selectedScreenSize,
  setselectedScreenSize,
  generatedCode,
}: any) => {
  const [finalcode, setfinalcode] = useState<string>();

  useEffect(() => {
    const cleancode = HTML_CODE.replace("{code}", generatedCode || " ")
      .replaceAll("```html", "")
      .replace("```", "")
      .replaceAll("html", "");
    setfinalcode(cleancode);
  }, [generatedCode]);

  const viewinNewtab = () => {
    if (!finalcode) {
      return;
    }

    //cretaing the object for oprning in new window
    const blob = new Blob([finalcode], { type: "text/html" });
    const url = URL.createObjectURL(blob);

    window.open(url, "_blank");
  };

  //method to sownload the code in html
  const downloadCode= ()=>{
    const blob = new Blob([finalcode ?? ""], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a')
    a.href=url;
    a.download='code.html';
    document.body.appendChild(a)
    a.click();
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  return (
    <div className="p-1 shadow-xl flex justify-between rounded-xl border-2 w-full">
      <div className="flex gap-2">
        <Button
          variant={"ghost"}
          className={`${
            selectedScreenSize == "web" ? "border border-primary" : null
          }`}
          onClick={() => setselectedScreenSize("web")}
        >
          <Monitor />
        </Button>
        <Button
          variant={"ghost"}
          className={`${
            selectedScreenSize == "mobile" ? "border border-primary" : null
          }`}
          onClick={() => setselectedScreenSize("mobile")}
        >
          <TabletSmartphone />
        </Button>
      </div>
      <div className="flex gap-2">
        <Button variant={"outline"} onClick={() => viewinNewtab()}>
          view <SquareArrowUp />
        </Button>
        <Viewcode code={finalcode}>
         <div className="flex ">
          <Button>code view</Button>
          
         </div>
        </Viewcode>
        <Button onClick={downloadCode} variant={"outline"}>
          Download <Download />
        </Button>
      </div>
    </div>
  );
};

export default WebpageTolls;
