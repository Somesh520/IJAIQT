'use client'

import { useEffect, useState } from 'react'
import { settingsAPI } from '@/lib/api'
import { Loader2 } from 'lucide-react'

export default function TopicsPage() {
  const [loading, setLoading] = useState(true)
  const [htmlContent, setHtmlContent] = useState('')

  useEffect(() => {
    settingsAPI.get()
      .then(res => {
        if (res.data && res.data.topicsHtml) {
          setHtmlContent(res.data.topicsHtml)
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
      <div className="max-w-5xl mx-auto bg-white p-6 text-[15px] leading-relaxed text-gray-900">
        <div
          className="text-gray-800 text-justify leading-[1.7] text-[14px] [&_p]:mb-4 [&_div]:mb-4 [&_ul]:mb-4 [&_ol]:mb-4 [&_li]:mb-2 [&_h1]:mb-4 [&_h2]:mb-4 [&_h3]:mb-4 [&>*:last-child]:mb-0"
          dangerouslySetInnerHTML={{ __html: htmlContent || 'No topics content available.' }}
        />
      </div>
    </main>
  )
}
