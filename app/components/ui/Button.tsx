import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', children, ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center rounded-full text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

      const variantStyles = {
        default: "bg-gradient-to-br from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600",
        destructive: "bg-gradient-to-br from-red-500 to-orange-500 text-white hover:from-red-600 hover:to-orange-600",
        outline: "bg-gradient-to-br from-blue-100 to-cyan-100 text-blue-700 hover:from-blue-200 hover:to-cyan-200 border border-blue-400",
        secondary: "bg-gradient-to-br from-gray-300 to-gray-400 text-gray-900 hover:from-gray-400 hover:to-gray-500",
        ghost: "bg-gradient-to-br from-transparent to-transparent hover:from-gray-100 hover:to-gray-200 text-gray-700 transition-colors duration-200",
        link: "bg-gradient-to-br from-transparent to-transparent hover:from-blue-50 hover:to-blue-100 text-blue-600 hover:text-blue-700 underline-offset-4 hover:underline transition-colors duration-200",
      };

    const sizeStyles = {
      default: "h-10 py-2 px-4",
      sm: "h-9 px-3 rounded-md",
      lg: "h-11 px-8 rounded-md",
    };

    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

    return (
      <button className={combinedClassName} ref={ref} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };
