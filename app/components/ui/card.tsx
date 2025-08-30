import * as React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Card({ className, ...props }: CardProps) {
  return (
    <div
      className={`rounded-2xl border bg-white shadow-md p-6 ${className ?? ""}`}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: CardProps) {
  return (
    <div className={`mb-4 ${className ?? ""}`} {...props} />
  );
}

export function CardTitle({ className, ...props }: CardProps) {
  return (
    <h2 className={`text-xl font-semibold ${className ?? ""}`} {...props} />
  );
}

export function CardDescription({ className, ...props }: CardProps) {
  return (
    <p className={`text-sm text-gray-500 ${className ?? ""}`} {...props} />
  );
}

export function CardContent({ className, ...props }: CardProps) {
  return (
    <div className={`space-y-4 ${className ?? ""}`} {...props} />
  );
}

export function CardFooter({ className, ...props }: CardProps) {
  return (
    <div className={`mt-4 flex justify-end gap-2 ${className ?? ""}`} {...props} />
  );
}
