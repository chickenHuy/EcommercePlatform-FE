"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { getSuggestions } from "@/api/search/searchApi";

export function SearchWithSuggestions({ className }) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState([]);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const inputRef = React.useRef(null);
  const suggestionRefs = React.useRef([]);

  const debouncedQuery = useDebounce(query, 300);

  React.useEffect(() => {
    if (debouncedQuery) {
      getSuggestions(debouncedQuery)
        .then((data) => {
          setSuggestions(data.result || []);
          setSelectedIndex(-1);
          setOpen(true); // Thêm dòng này để đảm bảo Popover mở khi có gợi ý
        })
        .catch((error) => {
          console.error("Error fetching suggestions:", error);
          setSuggestions([]);
          setOpen(false);
        });
    } else {
      setSuggestions([]);
      setOpen(false);
    }
  }, [debouncedQuery]);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1)); // Di chuyển xuống
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, -1)); // Di chuyển lên
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault();
      setQuery(suggestions[selectedIndex]);
      setOpen(false);
      setIsExpanded(false);
      inputRef.current?.focus(); // Giữ focus trên input
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    }
  };

  React.useEffect(() => {
    if (selectedIndex >= 0 && suggestionRefs.current[selectedIndex]) {
      suggestionRefs.current[selectedIndex]?.scrollIntoView({
        block: "nearest",
      });
    }
  }, [selectedIndex]);

  return (
    <div className={cn("relative w-full max-w-[480px]", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div
            className={cn(
              "w-full h-8 bg-black-secondary relative rounded-lg flex items-center",
              isExpanded ? "w-full" : "w-8 md:w-full"
            )}
          >
            <Input
              ref={inputRef}
              placeholder="Search products..."
              value={query}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown} // Đảm bảo xử lý các phím mũi tên và Enter
              onClick={() => setOpen(true)}
              className={cn(
                "bg-black-secondary outline-1 outline-black-secondary text-white-primary w-full h-full pr-10 pl-2 rounded-lg font-light border-none",
                isExpanded
                  ? "opacity-100"
                  : "opacity-0 md:opacity-100 w-0 md:w-full p-0 md:p-2"
              )}
            />
            <Button
              size="icon"
              variant="ghost"
              className={cn(
                "absolute right-0 top-0 h-full p-2 text-white-primary rounded-r-md hover:text-gray-tertiary",
                isExpanded ? "md:pointer-events-none" : "md:hidden"
              )}
              onClick={(e) => {
                e.preventDefault();
                toggleExpand();
                inputRef.current?.focus(); // Giữ focus trên input khi mở
              }}
            >
              <Search className="h-full text-white-primary" />
              <span className="sr-only">Search</span>
            </Button>
          </div>
        </PopoverTrigger>
        {suggestions.length > 0 && (
          <PopoverContent
            className="w-[calc(100vw-2rem)] md:w-[480px] p-0"
            align="start"
          >
            <Command>
              <CommandList>
                {suggestions.length > 0 ? (
                  <CommandGroup heading="Suggestions">
                    {suggestions.map((item, index) => (
                      <CommandItem
                        key={index}
                        onMouseEnter={() => setSelectedIndex(index)} // Hover để cập nhật index
                        onSelect={() => {
                          setQuery(item);
                          setOpen(false);
                          setIsExpanded(false);
                          inputRef.current?.focus(); // Giữ focus lại trên input
                        }}
                        ref={(el) => (suggestionRefs.current[index] = el)}
                        className={cn(
                          selectedIndex === index &&
                            "bg-accent text-accent-foreground" // Highlight phần tử đang chọn
                        )}
                      >
                        <Search className="mr-2 h-4 w-4" />
                        {item}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ) : (
                  <CommandEmpty>No suggestions found</CommandEmpty>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        )}
      </Popover>
    </div>
  );
}
