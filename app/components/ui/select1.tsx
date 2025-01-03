import React from 'react';
import { Select as NextUISelect, SelectItem, Selection } from "@nextui-org/react";

export interface Option {
  value: string;
  key?: string;
  label: string | React.ReactNode;
  isLabel?: boolean;
}

interface CustomSelectProps<T extends string | number> {
  options: readonly Option[];
  selectedKey?: T;
  onSelectionChange?: (key: T) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  error?: boolean;
  errorMessage?: string;
  id?: string;
}

export function Select<T extends string | number>({
  options,
  selectedKey,
  onSelectionChange,
  label,
  placeholder,
  className = "",
  error,
  errorMessage,
  id,
  ...props
}: CustomSelectProps<T>) {
  const normalizedOptions = options.map(option => ({
    key: option.key || option.value,
    label: option.label,
    isLabel: option.isLabel,
    value: option.value
  }));

  const handleSelectionChange = (selection: Selection) => {
    if (onSelectionChange) {
      const selectedValue = Array.from(selection)[0];
      if (selectedValue) {
        // Find the original option to get its value
        const selectedOption = normalizedOptions.find(opt => opt.key === selectedValue);
        if (selectedOption) {
          const value = typeof selectedKey === 'number' ? 
            Number(selectedOption.value) : 
            selectedOption.value;
          onSelectionChange(value as T);
        }
      }
    }
  };

  return (
    <NextUISelect
      id={id}
      label={label}
      labelPlacement="inside"
      placeholder={placeholder}
      selectedKeys={selectedKey ? new Set([selectedKey.toString()]) : new Set([])}
      className={className}
      onSelectionChange={handleSelectionChange}
      classNames={{
        base: "max-w-full",
        trigger: "bg-gray-700 data-[hover=true]:bg-gray-600 group-data-[focused=true]:bg-gray-600 text-white border-gray-600 h-12 rounded-xl p-4",
        value: "text-white group-data-[has-value=true]:pt-6 pb-2 text-base",
        label: "group-data-[filled=true]:text-xs group-data-[filled=true]:-translate-y-2 text-white/90 px-0",
        innerWrapper: "group-data-[has-value=true]:pt-0",
        mainWrapper: "h-12",
        selectorIcon: "text-white/90 right-3",
        listboxWrapper: "max-h-[300px] select-scrollbar rounded-lg",
        listbox: "bg-gray-700",
        popoverContent: [
          "bg-gray-700 border-gray-600 rounded-xl",
        ].join(" ")
      }}
      aria-label={label}
      radius="lg"
      variant="bordered"
      isInvalid={error}
      errorMessage={errorMessage}
      {...props}
    >
      {normalizedOptions.map((option) => (
        <SelectItem 
          key={option.key}
          value={option.key}
          className={
            option.isLabel 
              ? "text-white/60 font-semibold text-sm px-3 py-1.5 cursor-default"
              : "text-white data-[hover=true]:bg-gray-600/50 data-[selected=true]:bg-gray-600 py-2.5 px-3"
          }
        >
          {option.label}
        </SelectItem>
      ))}
    </NextUISelect>
  );
}

export default Select;