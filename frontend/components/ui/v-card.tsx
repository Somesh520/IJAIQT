import { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const VCard = ({
  title,
  description,
  icon,
  href,
  className
}: {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
  className?: string;
}) => {
  return (
    <Link
      href={href}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/60 bg-white/60 backdrop-blur-xl p-8 shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-brand-500/10 hover:border-brand-300/50 hover:-translate-y-2",
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-brand-50/50 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
      
      <div className="relative z-10">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 text-slate-600 ring-1 ring-slate-200/50 shadow-inner group-hover:from-brand-500 group-hover:to-brand-600 group-hover:text-white group-hover:ring-brand-400 group-hover:shadow-brand-500/20 transition-all duration-500">
          {icon}
        </div>
        <div>
          <h3 className="mb-3 text-xl font-bold text-slate-900 group-hover:text-brand-700 transition-colors duration-300">{title}</h3>
          <p className="text-[15px] text-slate-500 leading-relaxed font-medium">{description}</p>
        </div>
      </div>

      <div className="absolute right-8 top-8 flex h-10 w-10 items-center justify-center rounded-full bg-slate-50 text-slate-400 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:bg-brand-50 group-hover:text-brand-600 group-hover:translate-x-2 group-hover:-translate-y-2 shadow-sm">
        <ArrowUpRight className="h-5 w-5" />
      </div>
    </Link>
  );
};
