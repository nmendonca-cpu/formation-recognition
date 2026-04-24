import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline";
};

export function Button({
  className,
  variant = "default",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md border px-4 py-2 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50",
        variant === "default"
          ? "border-slate-950 bg-slate-900 text-white hover:bg-slate-800"
          : "border-slate-950 bg-white text-slate-900 hover:bg-slate-50",
        className,
      )}
      {...props}
    />
  );
}
