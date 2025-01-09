//select resent version..

import React from 'react';
import { Select as NextUISelect, SelectItem } from "@nextui-org/react";

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
    isLabel: option.isLabel
  }));

  const selectedOption = normalizedOptions.find(option => 
    option.key === (selectedKey?.toString()) && !option.isLabel
  );

  return (
    <NextUISelect
      id={id}
      label={label}
      labelPlacement="inside"
      placeholder={placeholder}
      selectedKeys={selectedKey ? [selectedKey.toString()] : []}
      className={className}
      onSelectionChange={(keys) => {
        const key = Array.from(keys)[0];
        if (key && onSelectionChange) {
          // Convert back to original type if number
          const value = typeof selectedKey === 'number' ? Number(key) : key;
          onSelectionChange(value as T);
        }
      }}
      renderValue={() => {
        return selectedOption ? (
          <div className="flex items-center gap-2">
            {selectedOption.label}
          </div>
        ) : null;
      }}
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
          "before:content-[''] before:w-full before:h-full before:absolute",
          "before:top-0 before:left-0 before:rounded-xl before:transition-all",
          "before:duration-200 before:opacity-0 before:scale-95",
          "data-[entering=true]:before:opacity-100 data-[entering=true]:before:scale-100",
        ].join(" ")
      }}
      aria-label={label}
      radius="lg"
      variant="bordered"
      isInvalid={error}
      errorMessage={errorMessage}
      popoverProps={{
        classNames: {
          base: "before:bg-gray-700 before:border-gray-600 before:rounded-xl",
          content: "p-0 border-none shadow-xl"
        },
        placement: "bottom",
        offset: 5,
        backdrop: "transparent"
      }}
      {...props}
    >
      {normalizedOptions.map((option) => 
        option.isLabel ? (
          <SelectItem 
            key={option.key}
            className="text-white/60 font-semibold text-sm px-3 py-1.5 cursor-default"
            disableAnimation
          >
            {option.label}
          </SelectItem>
        ) : (
          <SelectItem 
            key={option.key} 
            className="text-white data-[hover=true]:bg-gray-600/50 data-[selected=true]:bg-gray-600 py-2.5 px-3"
          >
            {option.label}
          </SelectItem>
        )
      )}
    </NextUISelect>
  );
}

export default Select;