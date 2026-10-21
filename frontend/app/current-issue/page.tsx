'use client'

import { useEffect, useState } from 'react'
import { issuesAPI, papersAPI, settingsAPI } from '@/lib/api'
import { Loader2, BookOpen } from 'lucide-react'
import Link from 'next/link'

interface Author {
  name: string
  affiliation?: string
  email?: string
}

interface Paper {
  _id: string
  title: string
  authors: Author[]
  abstract?: string
  pdfUrl?: string
}

interface Issue {
  _id: string
  volume: number
  issue: number
  year: number
  month: string
  description?: string
  isCurrent?: boolean
}

export default function CurrentIssuePage() {
  const [loading, setLoading] = useState(true)
  const [issue, setIssue] = useState<Issue | null>(null)
  const [papers, setPapers] = useState<Paper[]>([])
  const [customHtml, setCustomHtml] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch settings for custom HTML if configured
        try {
          const settingsRes = await settingsAPI.get()
          if (settingsRes.data?.currentIssueHtml && settingsRes.data.currentIssueHtml !== '<h2>Current Issue</h2>') {
            setCustomHtml(settingsRes.data.currentIssueHtml)
          }
        } catch (e) {
          console.error('Settings fetch error:', e)
        }

        // Try getting current issue
        let currentIssueData: Issue | null = null
        try {
          const issueRes = await issuesAPI.getCurrent()
          if (issueRes.data && issueRes.data._id) {
            currentIssueData = issueRes.data
          }
        } catch {
          // If 404, fallback to first published issue
          const allIssuesRes = await issuesAPI.getAll(true)
          if (allIssuesRes.data && allIssuesRes.data.length > 0) {
            currentIssueData = allIssuesRes.data[0]
          }
        }

        if (currentIssueData) {
          setIssue(currentIssueData)
          const papersRes = await papersAPI.getAll({ issueId: currentIssueData._id, published: true })
          if (papersRes.data) {
            setPapers(papersRes.data)
          }
        }
      } catch (err) {
        console.error('Failed to load current issue data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const resolvePdfUrl = (url?: string) => {
    if (!url) return '#'
    if (url.startsWith('http')) return url
    const base = process.env.NEXT_PUBLIC_API_URL
      ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '')
      : 'https://ijaiqt.onrender.com'
    return `${base}${url}`
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white w-full">
        <Loader2 className="animate-spin h-8 w-8 text-gray-400" />
      </div>
    )
  }

  return (
    <main className="w-full bg-white min-h-[600px] px-2 py-8 md:px-6 font-serif">
      <div className="max-w-5xl mx-auto bg-white p-4 md:p-6 text-slate-800 leading-relaxed">
        <h1 className="text-3xl md:text-4xl font-bold text-[#000044] mb-8 text-center border-b-2 border-orange-500 pb-4 inline-block mx-auto flex justify-center">
          Current Issue
        </h1>

        {customHtml && (
          <div 
            className="mb-8 prose max-w-none text-slate-800"
            dangerouslySetInnerHTML={{ __html: customHtml }}
          />
        )}

        {issue ? (
          <div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-[#000044]">
                  Volume {issue.volume}, Issue {issue.issue} ({issue.month} {issue.year})
                </h2>
                {issue.description && (
                  <p className="text-slate-600 text-sm mt-1 italic">
                    {issue.description}
                  </p>
                )}
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-100 text-orange-800 w-fit">
                Current Publication
              </span>
            </div>

            {papers.length > 0 ? (
              <div className="overflow-x-auto border border-gray-300 shadow-sm">
                <table className="w-full border-collapse text-left">
                  <thead>
                    <tr className="bg-[#fcb474] text-black border-b border-gray-300">
                      <th className="p-3 border-r border-gray-300 w-24 font-bold text-[16px] text-center">Paper #</th>
                      <th className="p-3 font-bold text-[16px]">Paper Title / Authors</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-300">
                    {papers.map((paper, index) => (
                      <tr key={paper._id} className="hover:bg-orange-50/20">
                        <td className="p-4 align-top font-bold text-lg text-center border-r border-gray-300 text-slate-800">
                          {index + 1}
                        </td>
                        <td className="p-4 align-top space-y-2">
                          <h3 className="font-bold text-lg text-slate-900 leading-snug">
                            {paper.title}
                          </h3>
                          <p className="text-[15px] text-slate-700">
                            {paper.authors?.map(a => a.name).join(', ')}
                          </p>
                          <div className="flex items-center gap-3 text-sm pt-1">
                            <Link 
                              href={`/paper/${paper._id}`} 
                              className="text-blue-800 font-semibold hover:underline"
                            >
                              Abstract
                            </Link>
                            <span className="text-gray-400">|</span>
                            {paper.pdfUrl ? (
                              <a 
                                href={resolvePdfUrl(paper.pdfUrl)} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-red-700 font-semibold hover:underline"
                              >
                                <img src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg" alt="PDF" className="w-4 h-4" />
                                Download Complete Paper
                              </a>
                            ) : (
                              <span className="text-gray-400 text-xs italic">PDF Available Upon Final Release</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8 bg-slate-50 border border-slate-200 text-center rounded-lg">
                <BookOpen className="w-12 h-12 text-[#000044] mx-auto mb-3 opacity-75" />
                <h3 className="text-xl font-bold text-[#000044] mb-2">
                  Volume {issue.volume}, Issue {issue.issue} ({issue.month} {issue.year})
                </h3>
                <p className="text-slate-600 max-w-xl mx-auto mb-5 text-[15px]">
                  Manuscripts for this upcoming issue are currently under review and editorial preparation. Published research articles will be listed here upon completion.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Link 
                    href="/call-for-papers"
                    className="inline-block bg-[#000044] text-white font-bold py-2.5 px-6 rounded hover:bg-[#1a1a66] transition-colors text-sm"
                  >
                    View Call for Papers
                  </Link>
                  <Link 
                    href="/authors"
                    className="inline-block bg-white text-[#000044] border border-[#000044] font-bold py-2.5 px-6 rounded hover:bg-slate-50 transition-colors text-sm"
                  >
                    Author Guidelines
                  </Link>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 bg-slate-50 border border-slate-200 text-center rounded-lg">
            <BookOpen className="w-12 h-12 text-[#000044] mx-auto mb-3 opacity-75" />
            <h3 className="text-xl font-bold text-[#000044] mb-2">
              Inaugural Issue Under Preparation
            </h3>
            <p className="text-slate-600 max-w-xl mx-auto mb-4 text-[15px]">
              The initial issue of the International Journal of Artificial Intelligence and Quantum Technologies (IJAIQT) is in progress. Submissions are welcome.
            </p>
            <Link 
              href="/call-for-papers"
              className="inline-block bg-[#000044] text-white font-bold py-2 px-6 rounded hover:bg-[#1a1a66] transition-colors text-sm"
            >
              Call for Papers
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
