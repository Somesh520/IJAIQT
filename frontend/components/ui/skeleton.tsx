import { cn } from "@/lib/utils"

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded bg-slate-200/80", className)}
      {...props}
    />
  )
}

export function ContentPageSkeleton() {
  return (
    <main className="w-full bg-white min-h-[600px] px-2 py-6 md:px-6">
      <div className="max-w-5xl mx-auto bg-white p-6 space-y-6 animate-pulse">
        {/* Main Title */}
        <div className="h-8 bg-slate-300 rounded w-1/3 mb-6" />

        {/* Section 1 paragraphs */}
        <div className="space-y-2.5">
          <div className="h-4 bg-slate-200 rounded w-full" />
          <div className="h-4 bg-slate-200 rounded w-full" />
          <div className="h-4 bg-slate-200 rounded w-11/12" />
          <div className="h-4 bg-slate-200 rounded w-4/5" />
        </div>

        {/* Section 2 */}
        <div className="pt-2 space-y-3">
          <div className="h-6 bg-slate-300 rounded w-1/4 mb-3" />
          <div className="h-4 bg-slate-200 rounded w-full" />
          <div className="h-4 bg-slate-200 rounded w-5/6" />
          <div className="h-4 bg-slate-200 rounded w-3/4" />
        </div>

        {/* Section 3 List */}
        <div className="pt-2 space-y-3">
          <div className="h-6 bg-slate-300 rounded w-1/4 mb-3" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-3 items-start">
              <div className="w-2 h-2 rounded-full bg-slate-300 mt-2 shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-4 bg-slate-200 rounded w-full" />
                <div className="h-4 bg-slate-200 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export function PaperDetailSkeleton() {
  return (
    <main className="w-full bg-white min-h-[600px] px-4 py-8 md:px-8 font-serif">
      <div className="max-w-4xl mx-auto bg-white p-6 space-y-6 animate-pulse">
        <div className="h-9 bg-slate-300 rounded w-3/4 mb-3" />
        <div className="h-4 bg-slate-200 rounded w-1/3 mb-6" />
        
        <div className="border-t border-b border-slate-200 py-4 space-y-2">
          <div className="h-4 bg-slate-200 rounded w-1/2" />
          <div className="h-4 bg-slate-200 rounded w-1/3" />
        </div>

        <div className="space-y-3 pt-2">
          <div className="h-6 bg-slate-300 rounded w-1/4 mb-2" />
          <div className="h-4 bg-slate-200 rounded w-full" />
          <div className="h-4 bg-slate-200 rounded w-full" />
          <div className="h-4 bg-slate-200 rounded w-5/6" />
          <div className="h-4 bg-slate-200 rounded w-4/5" />
        </div>
      </div>
    </main>
  )
}

export function IssueListSkeleton() {
  return (
    <main className="w-full bg-white min-h-[600px] px-2 py-8 md:px-6 font-serif">
      <div className="max-w-5xl mx-auto bg-white p-4 md:p-6 space-y-6 animate-pulse">
        <div className="h-8 bg-slate-300 rounded w-1/3 mb-6" />
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-slate-200 rounded-lg p-5 bg-slate-50 space-y-3">
              <div className="h-6 bg-slate-300 rounded w-2/3" />
              <div className="h-4 bg-slate-200 rounded w-1/3" />
              <div className="h-4 bg-slate-200 rounded w-full" />
              <div className="h-4 bg-slate-200 rounded w-4/5" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
