'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { issuesAPI, papersAPI } from '@/lib/api'
import Link from 'next/link'
import { AnimatedLink } from '@/components/ui/animated-link'
import { Calendar } from 'lucide-react'

export default function IssueDetailsPage() {
  const { id } = useParams()
  const [issue, setIssue] = useState<any>(null)
  const [papers, setPapers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (id) {
      issuesAPI.getById(id as string)
        .then(response => {
          setIssue(response.data)
          return papersAPI.getAll({ issueId: response.data._id, published: true })
        })
        .then(response => setPapers(response.data))
        .catch(err => {
          console.error(err)
          setError(true)
        })
        .finally(() => setLoading(false))
    }
  }, [id])

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold mb-4 font-serif text-slate-900">Issue Not Found</h1>
        <p className="text-slate-600 mb-6">The requested issue could not be found or does not exist.</p>
        <Link href="/archive" className="bg-brand-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-brand-700 transition-colors">
          Return to Archive
        </Link>
      </div>
    )
  }

  return (
    <main className="w-full flex-1 bg-slate-50 min-h-screen pb-20">
      {/* Title Header */}
      <div className="w-full border-b border-slate-200 bg-white py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-50/50 via-transparent to-transparent pointer-events-none"></div>
        <div className="max-w-4xl mx-auto relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-900 tracking-tight mb-4">
            Issue Details
          </h1>
          {issue && (
            <p className="text-lg text-slate-600 max-w-2xl mx-auto flex items-center justify-center gap-2">
              <Calendar className="w-5 h-5 text-brand-600" />
              Volume {issue.volume}, Issue {issue.issue} &mdash; {issue.month} {issue.year}
            </p>
          )}
          {issue?.description && (
            <p className="mt-4 text-slate-500 max-w-2xl mx-auto italic">
              {issue.description}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin mb-4"></div>
            Loading issue details...
          </div>
        ) : !issue ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm text-slate-500">
            No issue details available.
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-8">
              <h2 className="text-2xl font-serif font-bold text-slate-900">
                Published Papers
              </h2>
              <span className="bg-brand-100 text-brand-800 text-sm font-bold px-3 py-1 rounded-full">
                {papers.length} {papers.length === 1 ? 'Paper' : 'Papers'}
              </span>
            </div>

            <div className="w-full bg-white border border-slate-300 shadow-sm">
              {/* Table Header */}
              <div className="grid grid-cols-[100px_1fr] bg-[#fdb777] border-b border-slate-300">
                <div className="p-3 font-serif font-bold text-black border-r border-slate-300">Paper #</div>
                <div className="p-3 font-serif font-bold text-black">Paper Title/ Authors</div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-slate-300">
                {papers.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 font-serif">
                    No papers have been published in this issue yet.
                  </div>
                ) : (
                  papers.map((paper, index) => (
                    <div key={paper._id} className="grid grid-cols-[100px_1fr]">
                      <div className="p-4 font-serif text-lg text-black border-r border-slate-300">
                        {index + 1}
                      </div>
                      <div className="p-4">
                        <h3 className="font-serif font-bold text-black text-lg mb-4 leading-snug">
                          {paper.title}
                        </h3>
                        
                        <p className="font-serif text-black text-[17px] mb-4">
                          {paper.authors?.map((a: any) => a.name).join(', ')}
                        </p>
                        
                        <div className="flex items-center gap-2 font-serif text-[15px]">
                          <AnimatedLink 
                            href={`/paper/${paper._id}`}
                            className="text-[#3b00ff]"
                          >
                            Abstract
                          </AnimatedLink>
                          <span className="text-black mx-2">|</span>
                          <AnimatedLink
                            href={`${process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') : 'http://localhost:5001'}${paper.pdfUrl}`}
                            target="_blank"
                            className="text-[#3b00ff]"
                          >
                            <span className="flex items-center gap-2">
                              <img src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg" alt="PDF" className="w-5 h-5" />
                              Download Complete Paper
                            </span>
                          </AnimatedLink>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
