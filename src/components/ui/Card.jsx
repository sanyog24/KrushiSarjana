import { cn } from "../../lib/utils.js";

export function Card({ children, className = "" }) {
  return (
    <div
      className={cn(
        "bg-[#f5f7f2] shadow-md rounded-xl p-6 border border-gray-200",
        "hover:shadow-2xl transition-all duration-300 ease-in-out",
        className
      )}
    >
      {children}
    </div>
  );
}
