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
import { useDispatch } from "react-redux";
import { setSearch } from "@/store/features/userSearchSlice";
import { useRouter } from "next/navigation";
import { CommandDialog } from "cmdk";

export function SearchWithSuggestions({ className, t }) {
  const [query, setQuery] = React.useState("");
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [suggestions, setSuggestions] = React.useState([]);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const inputRef = React.useRef(null);
  const suggestionRefs = React.useRef([]);
  const router = useRouter();

  const debouncedQuery = useDebounce(query, 300);

  React.useEffect(() => {
    if (debouncedQuery) {
      getSuggestions(debouncedQuery)
        .then((data) => {
          setSuggestions(data.result || []);
          setSelectedIndex(-1);
        })
        .catch((error) => {
          console.error("Error fetching suggestions:", error);
          setSuggestions([]);
        });
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery]);

  const toggleExpand = () => setIsExpanded(!isExpanded);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    setSelectedIndex(-1);

    setIsExpanded(true)
  };

  const dispatch = useDispatch();

  const handleKeyDown = (e) => {
    if (suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, suggestions.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, -1));
      } else if (e.key === "Enter") {
        setIsExpanded(false);
        e.preventDefault();
        if (selectedIndex >= 0) {
          setQuery(suggestions[selectedIndex]); // Chọn suggestion
        } else {
          if (router.pathname !== "/search") {
            router.push("/search");
          }
          dispatch(setSearch(query));
           inputRef.current?.blur();
        }

      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (router.pathname !== "/search") {
        router.push("/search");
      }
      dispatch(setSearch(query));
      inputRef.current?.blur();
      setIsExpanded(false);
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
      <div
        className={cn(
          "w-full h-8 bg-black-secondary relative rounded-lg flex items-center",
          isExpanded ? "w-full" : "w-8 md:w-full"
        )}
      >
        <Input
          ref={inputRef}
          placeholder={t("text_search_products")}
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
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
            inputRef.current?.focus();
          }}
        >
          <Search className="h-full text-white-primary" />
        </Button>
      </div>
      {suggestions.length > 0 && isExpanded && (
        <div className="absolute w-full mt-1 bg-white rounded-md shadow-lg z-10">
          <Command open={true}>
            <CommandList>
              <CommandGroup heading="Suggestions">
                {suggestions.map((item, index) => (
                  <CommandItem
                    key={index}
                    onMouseEnter={() => setSelectedIndex(index)}
                    onSelect={() => {
                      setQuery(item);
                      setIsExpanded(false);
                      inputRef.current?.focus();
                    }}
                    ref={(el) => (suggestionRefs.current[index] = el)}
                    className={cn(
                      selectedIndex === index &&
                        "bg-accent text-accent-foreground"
                    )}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    {item}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}
