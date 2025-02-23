"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
}

const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    { value, onChange, options, placeholder = "Select option", ...props },
    ref
  ) => (
    <SelectPrimitive.Root value={value} onValueChange={onChange} {...props}>
      <SelectPrimitive.Trigger
        ref={ref}
        className="flex h-10 w-full items-center justify-between rounded-md border 
               border-neutral-200 bg-white px-3 py-2 text-sm ring-offset-white 
               placeholder:text-neutral-500 focus:outline-none focus:ring-2 
               focus:ring-blue-400 focus:ring-offset-2 disabled:cursor-not-allowed 
               disabled:opacity-50"
      >
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content
          className="relative z-50 min-w-[8rem] overflow-hidden rounded-md border 
                 bg-white text-neutral-950 shadow-md animate-in fade-in-80"
        >
          <SelectPrimitive.Viewport className="p-1">
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                className={cn(
                  "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none",
                  "focus:bg-neutral-100 focus:text-neutral-900",
                  "data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                )}
              >
                <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
                  <SelectPrimitive.ItemIndicator>
                    <Check className="h-4 w-4" />
                  </SelectPrimitive.ItemIndicator>
                </span>
                <SelectPrimitive.ItemText>
                  {option.label}
                </SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  )
);

Select.displayName = "Select";

export default Select;
