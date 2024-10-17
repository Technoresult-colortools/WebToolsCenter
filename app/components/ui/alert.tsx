import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const alertVariants = cva(
  "p-4 rounded-lg",
  {
    variants: {
      variant: {
        default: "bg-gray-100 text-gray-900",
        destructive: "bg-red-500 text-white",
        success: "bg-green-500 text-white",
        warning: "bg-yellow-500 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {}

export function Alert({ children, className, variant, ...props }: AlertProps) {
  return (
    <div className={cn(alertVariants({ variant }), className)} {...props}>
      {children}
    </div>
  );
}

export function AlertTitle({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <h5 className={cn("font-medium leading-none tracking-tight", className)} {...props}>
      {children}
    </h5>
  );
}

export function AlertDescription({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("text-sm [&_p]:leading-relaxed", className)} {...props}>
      {children}
    </div>
  );
}