'use client'

import { useEffect, useState } from 'react'
import { issuesAPI } from '@/lib/api'
import Link from 'next/link'
import { Loader2, Archive, ArrowRight } from 'lucide-react'

interface Issue {
  _id: string
  volume: number
  issue: number
  year: number
  month: string
  description?: string
  isCurrent?: boolean
  publishedDate?: string
}

export default function ArchivePage() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    issuesAPI.getAll(true)
      .then(response => {
        if (response.data && Array.isArray(response.data)) {
          setIssues(response.data)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white w-full">
        <Loader2 className="animate-spin h-8 w-8 text-gray-400" />
      </div>
    )
  }

  return (
    <main className="w-full bg-white min-h-[600px] px-2 py-8 md:px-6 font-serif">
      <div className="max-w-5xl mx-auto bg-white p-4 md:p-6 text-slate-800 leading-relaxed pt-2">

        {issues.length === 0 ? (
          <div className="p-8 bg-slate-50 border border-slate-200 text-center rounded-lg mt-6">
            <Archive className="w-12 h-12 text-[#000044] mx-auto mb-3 opacity-75" />
            <h3 className="text-xl font-bold text-[#000044] mb-2">No Archived Issues Yet</h3>
            <p className="text-slate-600 max-w-xl mx-auto mb-4 text-[15px]">
              Archived volumes and issues will appear here as publication cycles complete.
            </p>
            <Link
              href="/current-issue"
              className="inline-block bg-[#000044] text-white font-bold py-2 px-6 rounded hover:bg-[#1a1a66] transition-colors text-sm"
            >
              View Current Issue
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-300 shadow-sm mt-6">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-[#2B4E9B] text-white border-b border-gray-300">
                  <th className="p-3.5 border-r border-gray-300 w-44 md:w-52 font-bold text-[16px]">Issue</th>
                  <th className="p-3.5 font-bold text-[16px]">Issue Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-300">
                {issues.map(issue => (
                  <tr key={issue._id} className="hover:bg-orange-50/20">
                    <td className="p-4 align-top font-bold text-[16px] text-slate-900 border-r border-gray-300">
                      {issue.month} {issue.year}
                    </td>
                    <td className="p-4 align-top space-y-2">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <Link
                          href={`/issue/${issue._id}`}
                          className="font-bold text-lg text-blue-800 hover:underline"
                        >
                          Volume {issue.volume}, Issue {issue.issue}
                        </Link>
                        {issue.isCurrent && (
                          <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            Current Issue
                          </span>
                        )}
                      </div>
                      <p className="text-[15px] text-slate-700">
                        {issue.description || 'General Publication Issue'}
                      </p>
                      <div className="pt-1">
                        <Link
                          href={`/issue/${issue._id}`}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-700 hover:text-blue-900 hover:underline"
                        >
                          <span>View Papers in this Issue</span>
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}
