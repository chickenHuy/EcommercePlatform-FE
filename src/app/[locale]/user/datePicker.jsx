"use client";

import { CalendarIcon } from "@radix-ui/react-icons";
import { format, isValid } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect, useState } from "react";

export default function DatePicker({ value, onChange }) {
  const [date, setDate] = useState(value ? new Date(value) : null);

  useEffect(() => {
    if (value) {
      const newDate = new Date(value);
      if (isValid(newDate)) {
        setDate(newDate);
      } else {
        setDate(null);
      }
    } else {
      setDate(null);
    }
  }, [value]);

  const handleSelect = (newDate) => {
    if (date && newDate && newDate.getTime() === date.getTime()) {
      setDate(null);
      onChange(null);
    } else if (newDate && isValid(newDate)) {
      setDate(newDate);
      onChange(newDate);
    } else {
      setDate(null);
      onChange(null);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "mt-1 w-full border rounded-lg p-2",
            "text-left font-normal flex items-center justify-start",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "dd/MM/yyyy") : <span>Chọn ngày</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
