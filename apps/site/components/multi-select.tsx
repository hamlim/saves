"use client";

import { Action } from "@local/components/action";
import { cn } from "@local/utils/cn";
import { Check, ChevronDown, X } from "lucide-react";
import { useState } from "react";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

type Option = {
  value: string;
  label: string;
};

export type MultiSelectProps = {
  options: Array<Option>;
  onValueChange?: (value: Array<string>) => void;
  defaultValue?: Array<string>;
  placeholder?: string;
  name: string;
  maxDisplayCount?: number;
};

export function MultiSelect({
  options: providedOptions,
  onValueChange,
  defaultValue = [],
  placeholder = "Select options",
  name,
  maxDisplayCount = 3,
}: MultiSelectProps) {
  let [selectedValues, setSelectedValues] =
    useState<Array<string>>(defaultValue);
  let [isPopoverOpen, setIsPopoverOpen] = useState(false);
  let [inputValue, setInputValue] = useState("");

  let [options, setOptions] = useState<Array<Option>>(providedOptions);

  // @TODO: Support new options via useEffect or something

  let toggleOption = (option: string) => {
    let newSelectedValues = selectedValues.includes(option)
      ? selectedValues.filter((value) => value !== option)
      : [...selectedValues, option];
    setSelectedValues(newSelectedValues);
    onValueChange?.(newSelectedValues);
  };

  let handleClear = () => {
    setSelectedValues([]);
    onValueChange?.([]);
  };

  let displayedOptions = selectedValues.slice(0, maxDisplayCount);
  let hiddenOptionsCount = selectedValues.length - maxDisplayCount;

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <input type="hidden" name={name} value={selectedValues.join(",")} />
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          // biome-ignore lint/a11y/useSemanticElements: <explanation>
          role="combobox"
          aria-expanded={isPopoverOpen}
          className="w-full justify-between"
        >
          {selectedValues.length > 0 ? (
            <div className="flex gap-2">
              {displayedOptions.map((value) => {
                const option = options.find((o) => o.value === value);
                return (
                  <Badge key={value} variant="secondary">
                    {option?.label}
                  </Badge>
                );
              })}
              {hiddenOptionsCount > 0 && (
                <Badge variant="secondary">{`+${hiddenOptionsCount} more`}</Badge>
              )}
            </div>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Search..."
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandList>
            <CommandEmpty>
              {inputValue && (
                <Action
                  type="button"
                  is="button"
                  variant="ghost"
                  onClick={() => {
                    let newOption = {
                      value: inputValue,
                      label: inputValue,
                    };
                    setOptions([...options, newOption]);
                    toggleOption(newOption.value);
                    setInputValue("");
                  }}
                >
                  Create "{inputValue}"
                </Action>
              )}
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => toggleOption(option.value)}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <Check className={cn("h-4 w-4")} />
                    </div>
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={handleClear}
                    className="justify-center text-center"
                  >
                    Clear selection
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
