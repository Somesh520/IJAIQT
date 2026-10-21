'use client'

import { useEffect, useState } from 'react'
import { settingsAPI } from '@/lib/api'
import { Loader2 } from 'lucide-react'

function sanitizeEditorialHtml(rawHtml: string): string {
  if (!rawHtml) return ''

  let content = rawHtml.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

  // Remove Google docs wrapper tags & styles
  content = content
    .replace(/<strong[^>]*id="docs-[^>]*>([\s\S]*?)<\/strong>/gi, '$1')
    .replace(/<\/?strong[^>]*id="docs-[^>]*>/gi, '')
    .replace(/style="[^"]*white-space:\s*pre-wrap;?[^"]*"/gi, '')
    .replace(/<\/?span[^>]*>/gi, '')

  // Collapse </p><p> immediately following </strong> into a single break
  content = content.replace(/<\/strong>\s*<\/p>\s*<p>\s*/gi, '</strong><br />')

  // Clean trailing/leading spaces inside <strong>
  content = content.replace(/<strong[^>]*>\s+/gi, '<strong>')
  content = content.replace(/\s+<\/strong>/gi, '</strong>')

  // Collapse multiple breaks after </strong> into single <br />
  content = content.replace(/(<\/strong>)(?:\s*<br\s*\/?>|\s*\n|\s)+/gi, '$1<br />')

  // Convert plain newlines to <br />
  content = content.replace(/\n+/g, '<br />')

  // Collapse 3+ consecutive <br> into 2
  content = content.replace(/(?:<br\s*\/?>\s*){3,}/gi, '<br /><br />')

  // Remove empty paragraphs
  content = content.replace(/<p>\s*(?:<br\s*\/?>|&nbsp;|\s)*<\/p>/gi, '')

  return content
}

export default function EditorialBoardPage() {
  const [loading, setLoading] = useState(true)
  const [htmlContent, setHtmlContent] = useState('')

  useEffect(() => {
    settingsAPI.get()
      .then(res => {
        if (res.data && res.data.editorialBoardHtml) {
          setHtmlContent(res.data.editorialBoardHtml)
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
    <main className="w-full bg-white min-h-[600px] px-2 py-8 md:px-6">
      <div className="max-w-5xl mx-auto bg-white p-6 text-[16px] leading-relaxed text-gray-900">
        <h1 className="text-3xl md:text-4xl font-bold text-[#000044] mb-8 text-center border-b-2 border-orange-500 pb-4 inline-block mx-auto flex justify-center">
          Editorial Board
        </h1>
        {htmlContent ? (
          <div 
            className="editorial-board-content max-w-none font-serif text-[16px] text-slate-800 leading-relaxed
              [&_*]:!font-serif [&_*]:!text-[16px] [&_*]:!text-slate-800 [&_*]:!bg-transparent [&_*]:!whitespace-normal
              [&_strong]:!text-[#000044] [&_strong]:!font-bold [&_strong]:!text-[17px] [&_strong]:block [&_strong]:mt-6 [&_strong]:mb-1 [&_strong:first-child]:mt-0
              [&_strong_+_br]:hidden
              [&_p]:mb-6 [&_p]:mt-0 [&_p]:leading-relaxed
              [&_p:empty]:hidden"
            dangerouslySetInnerHTML={{ __html: sanitizeEditorialHtml(htmlContent) }}
          />
        ) : (
          <div className="text-center p-8 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-xl font-medium text-gray-600">Editorial board members are currently being updated.</p>
          </div>
        )}
      </div>
    </main>
  )
}
