import React, { HTMLAttributes } from 'react'

interface TableProps extends HTMLAttributes<HTMLTableElement> {}

export function Table({ className, ...props }: TableProps) {
  return (
    <div className="w-full overflow-auto">
      <table
        className={`w-full caption-bottom text-sm ${className}`}
        {...props}
      />
    </div>
  )
}

interface TableHeaderProps extends HTMLAttributes<HTMLTableSectionElement> {}

export function TableHeader({ className, ...props }: TableHeaderProps) {
  return (
    <thead className={`bg-gray-800 ${className}`} {...props} />
  )
}

interface TableBodyProps extends HTMLAttributes<HTMLTableSectionElement> {}

export function TableBody({ className, ...props }: TableBodyProps) {
  return <tbody className={`bg-gray-900 ${className}`} {...props} />
}

interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {}

export function TableRow({ className, ...props }: TableRowProps) {
  return (
    <tr
      className={`border-b border-gray-700 transition-colors hover:bg-gray-800/50 ${className}`}
      {...props}
    />
  )
}

interface TableHeadProps extends HTMLAttributes<HTMLTableCellElement> {}

export function TableHead({ className, ...props }: TableHeadProps) {
  return (
    <th
      className={`h-12 px-4 text-left align-middle font-medium text-gray-400 [&:has([role=checkbox])]:pr-0 ${className}`}
      {...props}
    />
  )
}

interface TableCellProps extends HTMLAttributes<HTMLTableCellElement> {}

export function TableCell({ className, ...props }: TableCellProps) {
  return (
    <td
      className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className}`}
      {...props}
    />
  )
}