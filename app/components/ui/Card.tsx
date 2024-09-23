import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

const Card = ({ children, className }: CardProps) => {
  return (
    <div className={`rounded-lg shadow-lg overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

const CardHeader = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
}

const CardTitle = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <h3 className={`text-2xl font-bold ${className}`}>
      {children}
    </h3>
  );
}

const CardDescription = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <p className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}>
      {children}
    </p>
  );
}

const CardContent = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <div className={`p-6 pt-0 ${className}`}>
      {children}
    </div>
  );
}

const CardFooter = ({ children, className }: { children: ReactNode; className?: string }) => {
  return (
    <div className={`p-6 pt-0 ${className}`}>
      {children}
    </div>
  );
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };