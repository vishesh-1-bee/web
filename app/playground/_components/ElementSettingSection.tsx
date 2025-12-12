"use client";

import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type Props = {
  element: HTMLElement | null;
};

const ElementSettingSection = ({ element }: Props) => {
  const [selectedEl1, setSelectedEl1] = useState<any>({});
  const [selectedEl2, setSelectedEl2] = useState<any>({});
  const [align, setAlign] = useState("left");
  const [classes, setClasses] = useState<string[]>([]);
  const [newClass, setNewClass] = useState("");

  // ---------- Update values when element changes ----------
  useEffect(() => {
    if (!element) return;

    const computed = window.getComputedStyle(element);

    setSelectedEl1({
      fontSize: computed.fontSize,
      color: computed.color,
    });

    setSelectedEl2({
      backgroundColor: computed.backgroundColor,
      borderRadius: computed.borderRadius,
      padding: computed.padding,
      margin: computed.margin,
    });

    setAlign(computed.textAlign || "left");
    setClasses(element.className.split(" ").filter(Boolean));
  }, [element]);

  // ---------- Apply style ----------
  const applyStyle = (property: string, value: string) => {
    if (!element) return;
    (element.style as any)[property] = value;

    // live updating selectedEl2 values
    setSelectedEl2((prev: any) => ({ ...prev, [property]: value }));
  };

  // ---------- Apply alignment ----------
  const setAlignValue = (value: string) => {
    if (!element || !value) return;
    element.style.textAlign = value;
    setAlign(value);
  };

  // ---------- Remove class ----------
  const removeClass = (cls: string) => {
    if (!element) return;
    const updated = classes.filter((c) => c !== cls);
    setClasses(updated);
    element.className = updated.join(" ");
  };

  // ---------- Add class ----------
  const addClass = () => {
    const trimmed = newClass.trim();
    if (!trimmed || classes.includes(trimmed)) return;

    const updated = [...classes, trimmed];
    setClasses(updated);
    if (element) element.className = updated.join(" ");
    setNewClass("");
  };

  return (
    <div className="w-96 shadow p-2 space-y-4 overflow h-[90vh] rounded-xl mt-2 mr-2">

      <h2 className="flex gap-2 items-center font-bold">
        <Switch /> Settings
      </h2>

      {/* FONT SIZE + COLOR */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="text-sm font-bold">Font Size</label>
          <Select
            defaultValue={selectedEl1?.fontSize || "24px"}
            onValueChange={(value) => applyStyle("fontSize", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Size" />
            </SelectTrigger>

            <SelectContent>
              {[...Array(53)].map((_, index) => (
                <SelectItem key={index} value={index + 12 + "px"}>
                  {index + 12}px
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm block">Text Color</label>
          <input
            type="color"
            className="w-[40px] h-[40px] rounded-lg mt-1"
            value={selectedEl1?.color || "#000000"}
            onChange={(e) => applyStyle("color", e.target.value)}
          />
        </div>
      </div>

      {/* ALIGNMENT */}
      <div>
        <label className="text-sm mb-1 block">Text Alignment</label>
        <ToggleGroup
          type="single"
          value={align}
          onValueChange={setAlignValue}
          className="bg-gray-100 rounded-lg p-1 inline-flex w-full justify-between"
        >
          <ToggleGroupItem value="left" className="p-2 flex-1">Left</ToggleGroupItem>
          <ToggleGroupItem value="center" className="p-2 flex-1">Center</ToggleGroupItem>
          <ToggleGroupItem value="right" className="p-2 flex-1">Right</ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* BACKGROUND + BORDER RADIUS */}
      <div className="flex items-center gap-4 ">
        <div>
          <label className="text-sm block">Background</label>
          <input
            type="color"
            className="w-[40px] h-[40px] rounded-lg mt-1"
            value={selectedEl2?.backgroundColor || "#ffffff"}
            onChange={(e) => applyStyle("backgroundColor", e.target.value)}
          />
        </div>

        <div className="flex-1 ">
          <label className="text-sm">Border Radius</label>
          <input
            type="text"
            placeholder="e.g. 4px 10px"
            value={selectedEl2?.borderRadius || ""}
            onChange={(e) => applyStyle("borderRadius", e.target.value)}
            className="mt-1"
          />
        </div>
      </div>

      {/* PADDING */}
      <div>
        <label className="text-sm">Padding: </label>
        <input
          type="text"
          placeholder="e.g. 10px 15px"
          value={selectedEl2?.padding || ""}
          onChange={(e) => applyStyle("padding", e.target.value)}
          className="mt-1 border rounded-xl p-2"
        />
      </div>

      {/* MARGIN */}
      <div>
        <label className="text-sm">Margin: </label>
        <input
          type="text"
          placeholder="e.g. 10px 15px"
          value={selectedEl2?.margin || ""}
          onChange={(e) => applyStyle("margin", e.target.value)}
          className="mt-1"
        />
      </div>

      {/* CLASS MANAGER */}
      <div>
        <label className="text-sm font-medium">Classes</label>

        {classes.length > 0 ? (
          <div className="flex flex-wrap gap-2 mt-2">
            {classes.map((cls) => (
              <span
                key={cls}
                className="flex text-xs items-center gap-1 px-2 py-1 text-sm rounded-full bg-slate-100 border border-slate-300"
              >
                {cls}
                <button
                  onClick={() => removeClass(cls)}
                  className="ml-1 text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </span>
            ))}
          </div>
        ) : (
          <span className="text-gray-400 text-sm">No classes applied</span>
        )}

        <div className="flex gap-2 mt-3">
          <input
            className="border px-2 py-1 rounded"
            value={newClass}
            onChange={(e) => setNewClass(e.target.value)}
            placeholder="Add class..."
          />
          <button
            type="button"
            onClick={addClass}
            className="px-3 py-1 bg-blue-600 text-white rounded"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ElementSettingSection;
