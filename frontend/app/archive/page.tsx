'use client'

import { useEffect, useState } from 'react'
import { issuesAPI } from '@/lib/api'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

export default function ArchivePage() {
  const [issues, setIssues] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    issuesAPI.getAll(true)
      .then(response => setIssues(response.data))
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
    <main className="w-full bg-white min-h-[600px] px-2 py-8 md:px-6">
      <div className="max-w-5xl mx-auto bg-white p-2 text-[15px] leading-relaxed text-gray-900">
        <h2 className="text-2xl font-bold text-[#000044] mb-4">Archive</h2>
        <p className="mb-8 font-bold">
          Browse the complete archive of all past issues published in the journal. All papers are open-access and available for download.
        </p>
        
        {issues.length === 0 ? (
          <div className="p-4 bg-gray-50 border border-gray-200 text-center text-gray-500">
            No past issues found in the archive.
          </div>
        ) : (
          <div className="overflow-x-auto border border-gray-300">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-[#fcb474] text-black">
                  <th className="p-3 border border-gray-300 w-48 font-bold text-lg">Date</th>
                  <th className="p-3 border border-gray-300 font-bold text-lg">Issue Details</th>
                </tr>
              </thead>
              <tbody>
                {issues.map((issue) => (
                  <tr key={issue._id} className="border-b border-gray-300 hover:bg-orange-50/30">
                    <td className="p-4 align-top font-bold text-base border-r border-gray-300">
                      {issue.month} {issue.year}
                    </td>
                    <td className="p-4 align-top">
                      <Link href={`/issue/${issue._id}`} className="font-bold text-lg text-blue-800 hover:underline">
                        Volume {issue.volume}, Issue {issue.issue}
                      </Link>
                      <p className="mt-2 text-[15px] text-gray-800">
                        {issue.description || 'General Publication Issue'}
                      </p>
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
