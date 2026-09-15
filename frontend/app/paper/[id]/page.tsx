'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { papersAPI } from '@/lib/api'
import Link from 'next/link'
import { AnimatedLink } from '@/components/ui/animated-link'
import { Loader2 } from 'lucide-react'

export default function PaperAbstractDetailsPage() {
  const { id } = useParams()
  const [paper, setPaper] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) {
      papersAPI.getById(id as string)
        .then(res => setPaper(res.data))
        .catch(err => setError('Paper not found'))
        .finally(() => setLoading(false))
    }
  }, [id])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex justify-center items-center">
        <Loader2 className="animate-spin h-10 w-10 text-slate-400" />
      </div>
    )
  }

  if (error || !paper) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center items-center font-serif">
        <h1 className="text-3xl font-bold mb-4">Error</h1>
        <p className="text-slate-600">The requested paper details could not be found.</p>
        <Link href="/" className="mt-6 text-blue-600 hover:underline">Return to Home</Link>
      </div>
    )
  }

  return (
    <main className="w-full bg-white min-h-screen pt-12 pb-24 px-6 font-serif">
      <div className="max-w-5xl mx-auto">
        <button 
          onClick={() => window.history.back()}
          className="mb-6 flex items-center gap-2 text-slate-500 hover:text-brand-600 transition-colors font-sans text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>

        <h1 className="text-3xl font-bold italic mb-6 text-black tracking-tight">
          Abstract Details
        </h1>

        <div className="w-full border-t border-b border-slate-300">
          <table className="w-full text-left border-collapse">
            <tbody className="divide-y divide-slate-300">
              
              {/* Title Row */}
              <tr>
                <td className="w-48 p-4 align-top border-r border-slate-300 font-bold text-black text-[17px]">
                  Title:
                </td>
                <td className="p-4 align-top text-black text-[17px]">
                  {paper.title}
                </td>
              </tr>

              {/* Author Row */}
              <tr>
                <td className="w-48 p-4 align-top border-r border-slate-300 font-bold text-black text-[17px]">
                  Author:
                </td>
                <td className="p-4 align-top text-black text-[17px]">
                  {paper.authors?.map((a: any) => a.name).join(', ')}
                </td>
              </tr>

              {/* Keywords Row */}
              {paper.keywords && paper.keywords.length > 0 && (
                <tr>
                  <td className="w-48 p-4 align-top border-r border-slate-300 font-bold text-black text-[17px]">
                    Keywords:
                  </td>
                  <td className="p-4 align-top text-black text-[17px]">
                    {paper.keywords.join(', ')}
                  </td>
                </tr>
              )}

              {/* Abstract Row */}
              <tr>
                <td className="w-48 p-4 align-top border-r border-slate-300 font-bold text-black text-[17px]">
                  Abstract:
                </td>
                <td className="p-4 align-top text-black text-[17px] leading-relaxed text-justify">
                  {paper.abstract}
                </td>
              </tr>

              {/* Download Row */}
              <tr>
                <td className="w-48 p-4 align-top border-r border-slate-300 font-bold text-black text-[17px]">
                  Download Paper:
                </td>
                <td className="p-4 align-top">
                  <AnimatedLink
                    href={`${process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') : 'https://ijaiqt.onrender.com'}${paper.pdfUrl}`}
                    target="_blank"
                    className="text-[#3b00ff] text-[17px]"
                  >
                    <span className="flex items-center gap-2">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg" alt="PDF" className="w-6 h-6" />
                      Download Complete Paper
                    </span>
                  </AnimatedLink>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
