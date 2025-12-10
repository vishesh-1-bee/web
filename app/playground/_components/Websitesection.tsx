"use client";
import { useEffect, useRef, useState } from "react";
import WebpageTolls from "./WebpageTolls";
import Settingsection from "./Settingsection";

type Props = {
  generatedCode: string;
};

const Websitesection = ({ generatedCode, }: Props) => {
  const [selectedScreenSize,setselectedScreenSize]=useState('web')
  const [selectedelement , setselectedelement]=useState<HTMLElement | null>()
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Load iframe shell
  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    const doc = iframe.contentDocument;
    if (!doc) return;

    doc.open();
    doc.write(`
      <!DOCTYPE html>
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

      <body id="root"></body>
      </html>
    `); 
    doc.close();
  }, []);

  // Inject HTML into iframe
  // Inject HTML into iframe + enable element selection/editing
useEffect(() => {
  const iframe = iframeRef.current;
  if (!iframe) return;

  const doc = iframe.contentDocument;
  if (!doc) return;

  const root = doc.getElementById("root");
  if (!root) return;

  // Parse and insert HTML
  const parser = new DOMParser();
  const html = parser.parseFromString(generatedCode, "text/html");
  root.innerHTML = html.body.innerHTML || generatedCode;

  // Re-init libraries inside iframe
  setTimeout(() => {
    if ((iframe.contentWindow as any)?.AOS) {
      (iframe.contentWindow as any).AOS.init();
    }
    if ((iframe.contentWindow as any)?.lucide) {
      (iframe.contentWindow as any).lucide.createIcons();
    }
  }, 50);


  /* ---------------------------------------------------------------------
     INSERTED CODE FROM IMAGE STARTS HERE
  --------------------------------------------------------------------- */

  let hoverEl: HTMLElement | null = null;
  let selectedEl: HTMLElement | null = null;

  const handleMouseOver = (e: MouseEvent) => {
    if (selectedEl) return;
    const target = e.target as HTMLElement;
    if (hoverEl && hoverEl === target) return;
    if (hoverEl) hoverEl.style.outline = "";

    hoverEl = target;
    hoverEl.style.outline = "2px dotted blue";
  };

  const handleMouseOut = (e: MouseEvent) => {
    if (selectedEl) return;
    if (!hoverEl) return;

    hoverEl.style.outline = "";
    hoverEl = null;
  };

  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const target = e.target as HTMLElement;

    if (selectedEl && selectedEl !== target) {
      selectedEl.style.outline = "";
      selectedEl.removeAttribute("contenteditable");
    }

    selectedEl = target;
    selectedEl.style.outline = "2px solid red";
    selectedEl.setAttribute("contenteditable", "true");
    selectedEl.focus();

    console.log("Selected element:", selectedEl);
    setselectedelement(selectedEl)
  };

  const handleBlur = () => {
    if (!selectedEl) return;
    console.log("Final edited element:", selectedEl.outerHTML);
    selectedEl = null;
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape" && selectedEl) {
      selectedEl.style.outline = "";
      selectedEl.removeAttribute("contenteditable");
      selectedEl = null;
    }
  };

  doc.body.addEventListener("mouseover", handleMouseOver);
  doc.body.addEventListener("mouseout", handleMouseOut);
  doc.body.addEventListener("click", handleClick);
  doc.addEventListener("keydown", handleKeyDown);

  return () => {
    doc.body.removeEventListener("mouseover", handleMouseOver);
    doc.body.removeEventListener("mouseout", handleMouseOut);
    doc.body.removeEventListener("click", handleClick);
    doc.removeEventListener("keydown", handleKeyDown);
  };

  /* ---------------------------------------------------------------------
     INSERTED CODE FROM IMAGE ENDS HERE
  --------------------------------------------------------------------- */

}, [generatedCode]);


  return (
    <div className="flex gap-2 w-full">
    <div className="p-4 w-full flex flex-col justify-center">
      <iframe
        ref={iframeRef}
        className={`${selectedScreenSize=='web' ? 'w-full' : 'w-130'} h-[600px] border rounded-xl`}
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-pointer-lock"
      />
      <WebpageTolls selectedScreenSize={selectedScreenSize}
      setselectedScreenSize={(v: string)=>setselectedScreenSize(v)}
      generatedCode={generatedCode}
      />
    </div>
    {/* setting section for the selected elements */}
    {/* @ts-ignore */}
    <Settingsection selectedel={selectedelement}  clerselectedel={()=>setselectedelement(null)}/>
    </div>
  );
};

export default Websitesection;
