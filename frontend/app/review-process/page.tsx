'use client'

import { useEffect, useState } from 'react'
import { settingsAPI } from '@/lib/api'
import { Loader2 } from 'lucide-react'

export default function ReviewProcessPage() {
  const [loading, setLoading] = useState(true)
  const [htmlContent, setHtmlContent] = useState('')

  useEffect(() => {
    settingsAPI.get()
      .then(res => {
        if (res.data && res.data.reviewProcessHtml) {
          setHtmlContent(res.data.reviewProcessHtml)
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
    <main className="w-full bg-white min-h-[600px] px-2 py-4 md:px-6">
      <div className="max-w-5xl mx-auto bg-white p-6 text-[15px] leading-relaxed text-gray-900 prose prose-slate text-justify">
        <div 
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </main>
  )
}
