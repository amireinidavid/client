"use client";

import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface RadioOption {
  label: string;
  value: string;
  description?: string;
}

interface RadioGroupProps {
  value: string;
  onValueChange: (value: string) => void;
  options: RadioOption[];
  orientation?: "horizontal" | "vertical";
  className?: string;
}

const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(
  (
    { value, onValueChange, options, orientation = "vertical", className },
    ref
  ) => {
    return (
      <RadioGroupPrimitive.Root
        ref={ref}
        value={value}
        onValueChange={onValueChange}
        className={cn(
          "gap-2",
          orientation === "horizontal" ? "flex flex-row" : "flex flex-col",
          className
        )}
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-start">
            <RadioGroupPrimitive.Item
              value={option.value}
              className={cn(
                "peer h-4 w-4 rounded-full border border-neutral-300 text-blue-600",
                "focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "data-[state=checked]:border-blue-600",
                "mt-1"
              )}
            >
              <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
                <Circle className="h-2.5 w-2.5 fill-current text-current animate-in zoom-in-75" />
              </RadioGroupPrimitive.Indicator>
            </RadioGroupPrimitive.Item>
            <label htmlFor={option.value} className="ml-2 block cursor-pointer">
              <div className="font-medium text-sm text-neutral-900">
                {option.label}
              </div>
              {option.description && (
                <div className="text-sm text-neutral-500">
                  {option.description}
                </div>
              )}
            </label>
          </div>
        ))}
      </RadioGroupPrimitive.Root>
    );
  }
);

RadioGroup.displayName = "RadioGroup";

export default RadioGroup;
