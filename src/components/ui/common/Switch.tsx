"use client";

import * as React from "react";
import * as SwitchPrimitive from "@radix-ui/react-switch";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ checked, onCheckedChange, label }, ref) => (
  <div className="flex items-center space-x-2">
    <SwitchPrimitive.Root
      ref={ref}
      checked={checked}
      onCheckedChange={onCheckedChange}
      className="peer inline-flex h-[24px] w-[44px] shrink-0 cursor-pointer items-center 
                 rounded-full border-2 border-transparent transition-colors 
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 
                 focus-visible:ring-offset-2 focus-visible:ring-offset-white 
                 disabled:cursor-not-allowed disabled:opacity-50 
                 data-[state=checked]:bg-blue-600 data-[state=unchecked]:bg-neutral-200"
    >
      <SwitchPrimitive.Thumb
        className="pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg 
                   ring-0 transition-transform data-[state=checked]:translate-x-5 
                   data-[state=unchecked]:translate-x-0"
      />
    </SwitchPrimitive.Root>
    <label
      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed 
                     peer-disabled:opacity-70"
    >
      {label}
    </label>
  </div>
));

Switch.displayName = "Switch";

export default Switch;
