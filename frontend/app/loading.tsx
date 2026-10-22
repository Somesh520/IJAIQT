export default function Loading() {
  return (
    <main className="w-full bg-white font-sans flex-grow">
      <div className="w-full flex flex-col md:flex-row md:items-start animate-pulse">
        {/* Left Sidebar Skeleton */}
        <div className="w-full md:w-[210px] shrink-0 p-4 md:p-2 order-3 md:order-1">
          <div className="flex flex-col gap-3">
            <div className="border-2 border-slate-200 p-3 bg-slate-100">
              <div className="h-5 bg-slate-300 rounded w-3/4 mx-auto mb-2" />
              <div className="h-3.5 bg-slate-200 rounded w-1/2 mb-3" />
              <div className="space-y-2">
                <div className="h-3 bg-slate-300 rounded w-2/3" />
                <div className="h-3 bg-slate-200 rounded w-1/2 mb-2" />
                <div className="h-3 bg-slate-300 rounded w-3/4" />
                <div className="h-3 bg-slate-200 rounded w-1/2" />
              </div>
            </div>
          </div>
        </div>

        {/* Center Content Skeleton */}
        <div className="w-full md:flex-grow p-4 md:border-l md:border-r border-slate-200 order-1 md:order-2">
          <div className="h-7 bg-slate-300 rounded w-2/5 mb-4" />
          <div className="space-y-2 mb-4">
            <div className="h-3.5 bg-slate-200 rounded w-full" />
            <div className="h-3.5 bg-slate-200 rounded w-full" />
            <div className="h-3.5 bg-slate-200 rounded w-11/12" />
            <div className="h-3.5 bg-slate-200 rounded w-4/5" />
          </div>
          <div className="h-5 bg-slate-300 rounded w-1/3 mb-3 mt-6" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-2.5 items-start">
                <div className="w-2 h-2 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 bg-slate-200 rounded w-full" />
                  <div className="h-3.5 bg-slate-200 rounded w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar Skeleton */}
        <div className="w-full md:w-[220px] shrink-0 p-4 md:p-2 order-2 md:order-3">
          <div className="flex flex-col gap-3">
            <div className="border border-slate-200">
              <div className="h-9 bg-slate-300" />
              <div className="divide-y divide-slate-100 bg-slate-50">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="px-3 py-2">
                    <div className="h-3 bg-slate-200 rounded w-4/5" />
                  </div>
                ))}
              </div>
            </div>
            <div className="border-2 border-slate-200 bg-white p-3">
              <div className="w-full h-14 bg-slate-100 rounded mb-2" />
              <div className="w-full h-7 bg-slate-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
