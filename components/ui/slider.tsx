"use client";

import React, { useState } from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import qs from "query-string";
import { useRouter, useSearchParams } from "next/navigation";

import Button from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SliderProps = {
  className?: string;
  min: number;
  max: number;
  minStepsBetweenThumbs: number;
  step: number;
  formatLabel?: (value: number) => string;
  value?: number[] | readonly number[];
  onValueChange?: (values: number[]) => void;
};

const Slider = React.forwardRef(
  (
    {
      className,
      min,
      max,
      step,
      formatLabel,
      value,
      onValueChange,
      ...props
    }: SliderProps,
    ref
  ) => {
    const searchParams = useSearchParams();
    const router = useRouter();

    const minPriceValue = parseFloat(searchParams.get("minPrice") || "1");
    const maxPriceValue = parseFloat(searchParams.get("maxPrice") || "200");

    const initialValue = Array.isArray([minPriceValue, maxPriceValue])
      ? [minPriceValue, maxPriceValue]
      : [min, max];
    const [localValues, setLocalValues] = useState(initialValue);

    const handleValueChange = (newValues: number[]) => {
      setLocalValues(newValues);
      if (onValueChange) {
        onValueChange(newValues);
      }
    };

    const onClick = () => {
      const current = qs.parse(searchParams.toString());

      const query = {
        ...current,
        minPrice: localValues[0],
        maxPrice: localValues[1],
      };

      const url = qs.stringifyUrl(
        {
          url: window.location.href,
          query,
        },
        { skipNull: true }
      );

      router.push(url);
    };

    return (
      <>
        <SliderPrimitive.Root
          ref={ref as React.RefObject<HTMLDivElement>}
          min={min}
          max={max}
          step={step}
          value={localValues}
          onValueChange={handleValueChange}
          className={cn(
            "relative flex w-full touch-none select-none mb-6 items-center",
            className
          )}
          {...props}
        >
          <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-gray-200">
            <SliderPrimitive.Range className="absolute h-full bg-black" />
          </SliderPrimitive.Track>
          {localValues.map((value, index) => (
            <React.Fragment key={index}>
              <div
                className="absolute text-center"
                style={{
                  left: `calc(${((value - min) / (max - min)) * 100}% + 0px)`,
                  top: `10px`,
                }}
              >
                <span className="text-sm">
                  {formatLabel ? formatLabel(value) : value}
                </span>
              </div>
              <SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-white shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
            </React.Fragment>
          ))}
        </SliderPrimitive.Root>
        <Button
          className={cn(
            "rounded-md text-sm text-gray-800 p-2 bg-white border border-gray-300 mt-4"
          )}
          onClick={() => onClick()}
        >
          Search
        </Button>
      </>
    );
  }
);

Slider.displayName = SliderPrimitive.Root.displayName;

export default Slider;
