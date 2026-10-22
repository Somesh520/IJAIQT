'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { issuesAPI, papersAPI } from '@/lib/api'
import Link from 'next/link'
import { AnimatedLink } from '@/components/ui/animated-link'




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
      <div className="min-h-[60vh] flex flex-col justify-center items-center font-serif">
        <h1 className="text-2xl font-bold mb-3 text-slate-900">Issue Not Found</h1>
        <p className="text-slate-600 mb-6 text-sm">The requested issue could not be found or does not exist.</p>
        <Link href="/archive" className="bg-[#000044] text-white px-6 py-2 rounded font-medium hover:bg-[#1a1a66] transition-colors text-sm">
          Return to Archive
        </Link>
      </div>
    )
  }

  return (
    <main className="w-full bg-white min-h-[600px] px-2 py-8 md:px-6 font-serif">
      <div className="max-w-4xl mx-auto bg-white p-4 md:p-6 text-slate-800 leading-relaxed pt-2">
        {loading ? (
          <div className="space-y-6 animate-pulse">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-6">
              <div className="h-6 bg-slate-300 rounded w-44" />
              <div className="h-6 bg-slate-200 rounded-full w-20" />
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-slate-200 p-5 space-y-3 bg-slate-50">
                <div className="h-5 bg-slate-300 rounded w-3/4" />
                <div className="h-4 bg-slate-200 rounded w-1/3" />
                <div className="h-4 bg-slate-200 rounded w-full" />
              </div>
            ))}
          </div>
        ) : !issue ? (
          <div className="text-center py-16 bg-white rounded-lg border border-slate-200 text-slate-500">
            No issue details available.
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-6">
              <h2 className="text-xl md:text-2xl font-serif font-bold text-[#000044]">
                Published Papers
              </h2>
              <span className="bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                {papers.length} {papers.length === 1 ? 'Paper' : 'Papers'}
              </span>
            </div>

            <div className="w-full bg-white border border-slate-300 shadow-sm">
              {/* Table Header */}
              <div className="grid grid-cols-[100px_1fr] bg-[#2B4E9B] border-b border-slate-300">
                <div className="p-3 font-serif font-bold text-white border-r border-slate-300 text-center">Paper #</div>
                <div className="p-3 font-serif font-bold text-white">Paper Title / Authors</div>
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
                      <div className="p-4 font-serif text-lg text-black border-r border-slate-300 text-center font-bold">
                        {index + 1}
                      </div>
                      <div className="p-4">
                        <h3 className="font-serif font-bold text-black text-lg mb-2 leading-snug">
                          {paper.title}
                        </h3>


                        <p className="font-serif text-slate-700 text-[15px] mb-3">
                          {paper.authors?.map((a: any) => a.name).join(', ')}
                        </p>

                        <div className="flex items-center gap-2 font-serif text-[15px]">
                          <AnimatedLink
                            href={`/paper/${paper._id}`}
                            className="text-[#3b00ff] hover:underline"
                          >
                            Abstract
                          </AnimatedLink>
                          <span className="text-slate-400 mx-2">|</span>
                          <AnimatedLink
                            href={`${process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') : 'https://ijaiqt.onrender.com'}${paper.pdfUrl}`}
                            target="_blank"
                            className="text-[#3b00ff] hover:underline"
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
