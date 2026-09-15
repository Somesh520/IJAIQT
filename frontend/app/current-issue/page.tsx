'use client'

import { useEffect, useState } from 'react'
import { issuesAPI, papersAPI } from '@/lib/api'
import { Loader2, FileText } from 'lucide-react'
import Link from 'next/link'

interface Author {
  name: string;
  affiliation?: string;
  email?: string;
}

interface Paper {
  _id: string;
  title: string;
  authors: Author[];
  abstract: string;
  pdfUrl: string;
}

interface Issue {
  _id: string;
  volume: number;
  issue: number;
  year: number;
  month: string;
  description: string;
}

export default function CurrentIssuePage() {
  const [loading, setLoading] = useState(true)
  const [issue, setIssue] = useState<Issue | null>(null)
  const [papers, setPapers] = useState<Paper[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const issueRes = await issuesAPI.getCurrent()
        
        if (issueRes.data && issueRes.data._id) {
          setIssue(issueRes.data)
          
          const papersRes = await papersAPI.getAll({ issueId: issueRes.data._id, published: true })
          if (papersRes.data) {
            setPapers(papersRes.data)
          }
        }
      } catch (err: any) {
        console.error(err)
        setError('Failed to load the current issue. Please check back later.')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white w-full">
        <Loader2 className="animate-spin h-8 w-8 text-gray-400" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64 bg-white w-full text-red-600 font-bold">
        {error}
      </div>
    )
  }

  if (!issue) {
    return (
      <div className="flex justify-center items-center h-64 bg-white w-full text-gray-600 font-bold">
        No current issue is available at the moment.
      </div>
    )
  }

  return (
    <main className="w-full bg-white min-h-[600px] px-2 py-8 md:px-6">
      <div className="max-w-5xl mx-auto bg-white p-2">
        <h2 className="text-2xl font-bold text-[#000044] mb-6">Current Issue: Volume {issue.volume}, Issue {issue.issue} ({issue.month} {issue.year})</h2>
        
        {papers.length > 0 ? (
          <div className="overflow-x-auto border border-gray-300">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-[#fcb474] text-black">
                  <th className="p-3 border border-gray-300 w-24 font-bold text-lg">Paper #</th>
                  <th className="p-3 border border-gray-300 font-bold text-lg">Paper Title/ Authors</th>
                </tr>
              </thead>
              <tbody>
                {papers.map((paper, index) => (
                  <tr key={paper._id} className="border-b border-gray-300 hover:bg-orange-50/30">
                    <td className="p-4 align-top font-bold text-lg border-r border-gray-300">
                      {index + 1}
                    </td>
                    <td className="p-4 align-top">
                      <div className="font-bold text-base mb-4">
                        {paper.title}
                      </div>
                      <div className="text-[15px] mb-4 text-gray-800">
                        {paper.authors.map(a => a.name).join(', ')}
                      </div>
                      <div className="flex items-center gap-2 text-[15px] text-blue-800">
                        <Link href={`/paper/${paper._id}`} className="hover:underline">
                          Abstract
                        </Link>
                        <span className="text-gray-400">|</span>
                        <div className="flex items-center gap-1 text-red-600 hover:underline">
                          <FileText className="w-5 h-5" />
                          <a href={`http://localhost:5001${paper.pdfUrl}`} target="_blank" rel="noopener noreferrer" className="text-blue-800">
                            Download Complete Paper
                          </a>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 bg-gray-50 border border-gray-200 text-center text-gray-500">
            No papers have been published in this issue yet.
          </div>
        )}
      </div>
    </main>
  )
}
