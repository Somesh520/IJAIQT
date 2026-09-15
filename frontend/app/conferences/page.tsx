'use client'

import { useEffect, useState } from 'react'
import { conferencesAPI } from '@/lib/api'
import { Loader2 } from 'lucide-react'

export default function ConferencesPage() {
  const [conferences, setConferences] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    conferencesAPI.getAll()
      .then(res => setConferences(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="w-full bg-white min-h-screen pt-12 pb-24 px-6 font-serif">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-black tracking-tight border-b border-slate-200 pb-4">
          Conferences:
        </h1>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin h-8 w-8 text-brand-600" />
          </div>
        ) : conferences.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 p-8 text-center text-slate-500 rounded-xl font-sans">
            No conferences have been published yet.
          </div>
        ) : (
          <div className="space-y-6">
            {conferences.map((conf) => (
              <div key={conf._id} className="bg-[#f5f5f5] p-6 text-black border border-slate-200">
                <p className="text-[17px] leading-relaxed mb-4">
                  {conf.title}
                </p>
                <div className="flex items-center text-[17px] font-bold">
                  <span className="text-[#f97316] mr-2">Download Conference Proceeding</span>
                  <a
                    href={`http://localhost:5001${conf.pdfUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#008cba] underline underline-offset-2 decoration-1 hover:text-[#006b8f] transition-colors"
                  >
                    Click Here
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
