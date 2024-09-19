// src/components/ui/alert.tsx
import React from 'react';

export function Alert({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return <div className={`bg-red-500 text-white p-4 rounded-lg ${className}`}>{children}</div>;
}

export function AlertTitle({ children }: { children: React.ReactNode }) {
  return <strong className="font-bold">{children}</strong>;
}

export function AlertDescription({ children }: { children: React.ReactNode }) {
  return <p>{children}</p>;
}