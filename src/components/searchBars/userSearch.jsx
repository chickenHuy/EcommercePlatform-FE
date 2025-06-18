"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { getSuggestions } from "@/api/search/searchApi";
import { useDispatch } from "react-redux";
import { setSearch } from "@/store/features/userSearchSlice";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export function SearchWithSuggestions({ className, t }) {
  const [query, setQuery] = React.useState("");
  const [suggestions, setSuggestions] = React.useState([]);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const [isExpanded, setIsExpanded] = React.useState(true);

  const inputRef = React.useRef(null);
  const suggestionRefs = React.useRef([]);

  const debouncedQuery = useDebounce(query, 300);
  const dispatch = useDispatch();
  const pathname = usePathname();
  const router = useRouter();

  const { toast } = useToast();

  React.useEffect(() => {
    if (!debouncedQuery) {
      setSuggestions([]);
      return;
    }

    getSuggestions(debouncedQuery)
      .then((data) => {
        setSuggestions(data.result || []);
        setSelectedIndex(-1);
      })
      .catch((err) => {
        console.error("Error fetching suggestions:", err);
        setSuggestions([]);
      });
  }, [debouncedQuery]);

  React.useEffect(() => {
    if (selectedIndex >= 0 && suggestionRefs.current[selectedIndex]) {
      suggestionRefs.current[selectedIndex].scrollIntoView({
        block: "nearest",
      });
    }
  }, [selectedIndex]);

  const handleInputChange = (e) => {
    if (e.target.value.length > 1000) {
      toast({
        title: t("text_notify"),
        description: t("text_input_too_long"),
        variant: "destructive",
      });
      return;
    }
    setQuery(e.target.value);
    setSelectedIndex(-1);
    setIsExpanded(true);
  };

  const handleKeyDown = (e) => {
    const hasSuggestions = suggestions.length > 0;

    switch (e.key) {
      case "ArrowDown":
        if (hasSuggestions) {
          e.preventDefault();
          setSelectedIndex((prev) =>
            Math.min(prev + 1, suggestions.length - 1),
          );
        }
        break;
      case "ArrowUp":
        if (hasSuggestions) {
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, -1));
        }
        break;
      case "Enter":
        e.preventDefault();
        setIsExpanded(false);

        if (selectedIndex >= 0) {
          const suggestion = suggestions[selectedIndex];
          setQuery(suggestion);
          dispatch(setSearch(suggestion));
        } else {
          dispatch(setSearch(query));
        }

        if (!pathname.includes('/videos')) {
          router.push("/search");
        }

        inputRef.current?.blur();
        break;
    }
  };

  const handleSuggestionSelect = (item) => {
    setQuery(item);
    setIsExpanded(false);
    inputRef.current?.focus();
  };

  const toggleExpand = () => setIsExpanded(!isExpanded);

  return (
    <div className={cn("relative w-full max-w-[480px]", className)}>
      <div
        className={cn(
          "w-full h-8 bg-black-secondary relative rounded-lg flex items-center",
          isExpanded ? "w-full" : "w-8 md:w-full",
        )}
      >
        <Input
          ref={inputRef}
          value={query}
          placeholder={t("text_search_products")}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className={cn(
            "bg-black-secondary outline-1 outline-black-secondary text-white-primary w-full h-full pr-10 pl-2 rounded-lg text-[.9em] border-none",
            isExpanded
              ? "opacity-100"
              : "opacity-0 md:opacity-100 w-0 md:w-full p-0 md:p-2",
          )}
        />
        <Button
          size="icon"
          variant="ghost"
          onClick={(e) => {
            e.preventDefault();
            toggleExpand();
            inputRef.current?.focus();
          }}
          className={cn(
            "absolute right-0 top-0 h-full p-2 text-white-primary rounded-r-md hover:text-gray-tertiary",
            isExpanded ? "md:pointer-events-none" : "md:hidden",
          )}
        >
          <Search className="h-full text-white-primary" />
        </Button>
      </div>

      {suggestions.length > 0 && isExpanded && (
        <div className="absolute w-full mt-1 bg-white rounded-md shadow-lg z-10">
          <Command open>
            <CommandList>
              <CommandGroup heading="Suggestions">
                {suggestions.map((item, index) => (
                  <CommandItem
                    key={index}
                    ref={(el) => (suggestionRefs.current[index] = el)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    onSelect={() => handleSuggestionSelect(item)}
                    className={cn(
                      selectedIndex === index &&
                      "bg-accent text-accent-foreground",
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
