import React from 'react';
import { Select as NextUISelect, SelectItem } from "@nextui-org/react";

export interface Option {
  value?: string;
  key?: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  selectedKey?: string;
  onSelectionChange?: (key: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
  error?: boolean;
  errorMessage?: string;
  id?: string;
}

export const Select = ({
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
}: CustomSelectProps) => {
  const normalizedOptions = options.map(option => ({
    key: option.key || option.value || '',
    label: option.label
  }));

  return (
    <NextUISelect
      id={id}
      label={label}
      labelPlacement="inside"
      placeholder={placeholder}
      selectedKeys={selectedKey ? [selectedKey] : []}
      className={className}
      onSelectionChange={(keys) => {
        const key = Array.from(keys)[0]?.toString();
        if (key) onSelectionChange?.(key);
      }}
      classNames={{
        base: "max-w-full",
        trigger: "bg-gray-700 data-[hover=true]:bg-gray-600 group-data-[focused=true]:bg-gray-600 text-white border-gray-600 h-12 rounded-xl p-4",
        value: "text-white group-data-[has-value=true]:pt-6 pb-2 text-base",
        label: "group-data-[filled=true]:text-xs group-data-[filled=true]:-translate-y-2 text-white/90 px-0",
        innerWrapper: "group-data-[has-value=true]:pt-0",
        mainWrapper: "h-12",
        selectorIcon: "text-white/90 right-3",
        listboxWrapper: "max-h-[400px]",
        listbox: "bg-gray-700 custom-scrollbar",
        popoverContent: "bg-gray-700 border-gray-600 rounded-xl"
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
          className="text-white data-[hover=true]:bg-gray-600/50 data-[selected=true]:bg-gray-600 py-2.5 px-3"
        >
          {option.label}
        </SelectItem>
      ))}
    </NextUISelect>
  );
};

export default Select;