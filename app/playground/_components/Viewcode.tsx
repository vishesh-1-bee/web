"use client"
import React from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
const Viewcode = ({ children, code }: any) => {
  return (
    <div>
      <Dialog>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent className="min-w-7xl max-h-[400px] overflow-auto">
          <DialogHeader>
            <DialogTitle>sorce code</DialogTitle>
            <DialogDescription>
              <div>
                {code}
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Viewcode;
