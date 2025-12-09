// components/Button.tsx
"use client";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const base = "px-6 py-2 rounded-full font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants: Record<string, string> = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600",
    secondary: "border bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-white border-gray-400 dark:border-gray-500 hover:bg-gray-300 dark:hover:bg-gray-600",
    };

  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
