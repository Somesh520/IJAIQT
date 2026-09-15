'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { settingsAPI } from '@/lib/api'
import { Loader2 } from 'lucide-react'

export default function NewsDetailPage() {
  const params = useParams()
  const { id } = params
  
  const [loading, setLoading] = useState(true)
  const [newsItem, setNewsItem] = useState<any>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchNewsItem = async () => {
      try {
        const res = await settingsAPI.get()
        if (res.data && res.data.newsLinks) {
          const item = res.data.newsLinks.find((n: any) => n._id === id)
          if (item) {
            setNewsItem(item)
          } else {
            setError('News item not found')
          }
        }
      } catch (e) {
        console.error('Failed to fetch news', e)
        setError('Failed to load content')
      } finally {
        setLoading(false)
      }
    }
    fetchNewsItem()
  }, [id])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white w-full">
        <Loader2 className="animate-spin h-8 w-8 text-gray-400" />
      </div>
    )
  }

  if (error || !newsItem) {
    return (
      <div className="w-full bg-white min-h-screen px-4 py-8 text-center text-red-600 font-bold">
        {error || 'News item not found'}
      </div>
    )
  }

  return (
    <main className="w-full bg-white min-h-[600px] px-2 py-4 md:px-6">
      <div className="max-w-5xl mx-auto border border-gray-300 min-h-[500px] bg-white">
        
        {/* Top Orange Banner */}
        <div 
          className="w-full py-2 border-b border-gray-300"
          style={{ backgroundColor: '#ff9933' }}
        >
          <h1 className="text-center font-bold text-[#8b0000] text-xl underline">
            {newsItem.label}
          </h1>
        </div>

        {/* Date and Content Area */}
        <div className="p-6">
          {newsItem.date && (
            <div className="mb-6 font-bold text-[#8b0000] underline">
              {newsItem.date}
            </div>
          )}

          <div 
            className="text-gray-900 leading-relaxed text-[15px] text-justify"
            dangerouslySetInnerHTML={{ __html: newsItem.content || 'No content provided.' }}
          />
        </div>

      </div>
    </main>
  )
}
