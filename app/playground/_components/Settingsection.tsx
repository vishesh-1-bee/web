import { SwatchBook } from "lucide-react";
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props={
  selectedel :HTMLElement,
  clerselectedel:()=>void
}
const Settingsection = ({selectedel , clerselectedel}:Props) => {
  const applystyle=(property:string ,  value:string)=>{
    if (selectedel) {
      selectedel.style[property as any]=value
    }
  }
  return (
    <div className="w-80 border shadow p-2 ">
      <h1 className="flex items-center gap-2 font-bold">
        <SwatchBook />
        Settings
      </h1>

      {/* This is for the font size */}
      <label>Font Size</label>
      <Select defaultValue={selectedel?.style?.fontSize || '24px'}
      onValueChange={(value)=>applystyle('fontSize',value)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Seect Size" />
        </SelectTrigger>
        <SelectContent>
          {[...Array(52)].map((item, index) => (
            <SelectItem value={index + 12 + "px"} key={index}>
              {index + 12}px
            </SelectItem>
          ))}
        </SelectContent>
      </Select>



      {/* add text color section */}
      <label className="text-sm mt-3">Text color</label>
      <div>
        <input type="color"
        onChange={(e)=>applystyle('color',e.target.value)}
        className="w-10 h-10 rounded-full"/>
      </div>
    </div>
  );
};

export default Settingsection;
