'use client'

import { useEffect, useState } from 'react'
import { settingsAPI } from '@/lib/api'
import { Loader2 } from 'lucide-react'

export default function FAQPage() {
  const [loading, setLoading] = useState(true)
  const [htmlContent, setHtmlContent] = useState('')

  useEffect(() => {
    settingsAPI.get()
      .then(res => {
        if (res.data && res.data.faqHtml) {
          setHtmlContent(res.data.faqHtml)
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
      <div className="max-w-5xl mx-auto bg-white p-6 text-[26px] leading-relaxed text-gray-900">
        <div
          className="prose max-w-none prose-slate text-justify [&_p]:!text-[18px] [&_span]:!text-[17px] [&_strong]:!text-[17px] [&_b]:!text-[17px] [&_li]:!text-[17px] [&_h3]:!text-[17px] [&_h4]:!text-[17px] [&_p]:!mb-1 [&_p]:!mt-0 [&_p:empty]:hidden [&_h3]:!mt-2 [&_h3]:!mb-0 [&_h4]:!mt-2 [&_h4]:!mb-0 [&_h1]:!text-[36px] [&_h1]:!font-bold [&_h1]:!mb-6 [&_h1]:!mt-4 [&_h2]:!text-[30px] [&_h2]:!font-bold [&_h2]:!mb-4 [&_h2]:!mt-8"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </main>
  )
}
