import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AnimatedLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  children: React.ReactNode;
  className?: string;
  activeColorClass?: string;
}

export function AnimatedLink({ 
  href, 
  children, 
  className,
  activeColorClass = "hover:text-[#f97316]", // Defaults to the orange from the image
  ...props 
}: AnimatedLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "group relative inline-flex items-center gap-2 font-medium transition-colors duration-300",
        activeColorClass,
        className
      )}
      {...props}
    >
      <span className="relative">
        {children}
        {/* Animated Underline */}
        <span 
          className="absolute -bottom-1 left-0 h-[2px] w-0 bg-current transition-all duration-300 ease-out group-hover:w-full"
        />
      </span>
      {/* Rotating Arrow */}
      <ArrowRight 
        className="h-4 w-4 transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:-rotate-45" 
      />
    </Link>
  );
}
