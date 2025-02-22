"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

interface SliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  step?: number;
  formatLabel?: (value: number) => string;
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ min, max, value, onChange, step = 1, formatLabel, ...props }, ref) => {
  return (
    <div className="space-y-4">
      <SliderPrimitive.Root
        ref={ref}
        className="relative flex items-center w-full h-5 select-none touch-none"
        value={value}
        max={max}
        min={min}
        step={step}
        onValueChange={onChange as (value: number[]) => void}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-2 grow rounded-full bg-neutral-100">
          <SliderPrimitive.Range className="absolute h-full rounded-full bg-blue-600" />
        </SliderPrimitive.Track>
        {value.map((_, index) => (
          <SliderPrimitive.Thumb
            key={index}
            className="block h-5 w-5 rounded-full border-2 border-blue-600 bg-white 
                     ring-offset-white transition-colors focus-visible:outline-none 
                     focus-visible:ring-2 focus-visible:ring-blue-400 
                     focus-visible:ring-offset-2 disabled:pointer-events-none 
                     disabled:opacity-50"
          />
        ))}
      </SliderPrimitive.Root>
      <div className="flex justify-between text-sm text-neutral-600">
        <span>{formatLabel ? formatLabel(value[0]) : value[0]}</span>
        <span>{formatLabel ? formatLabel(value[1]) : value[1]}</span>
      </div>
    </div>
  );
});

Slider.displayName = "Slider";

export default Slider;
