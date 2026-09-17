'use client'

import { useEffect, useState } from 'react'
import { settingsAPI } from '@/lib/api'
import { Loader2 } from 'lucide-react'

export default function CallForPapersPage() {
  const [loading, setLoading] = useState(true)
  const [htmlContent, setHtmlContent] = useState('')
  const [settings, setSettings] = useState<any>(null)

  useEffect(() => {
    settingsAPI.get()
      .then(res => {
        if (res.data) {
          setSettings(res.data)
          if (res.data.callForPapersHtml) {
            setHtmlContent(res.data.callForPapersHtml)
          }
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
        
        {settings && (settings.submissionDeadline || settings.notificationOfAcceptance || settings.finalCameraReady || settings.onlinePublication) && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-[#000033] mb-4">Submission Timeline & Process</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <th className="text-left p-3 font-semibold text-gray-800 w-1/2">Event</th>
                    <th className="text-left p-3 font-semibold text-gray-800 w-1/2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {settings.submissionDeadline && (
                    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="p-3 text-gray-700">Submission Deadline</td>
                      <td className="p-3 text-gray-700">{settings.submissionDeadline}</td>
                    </tr>
                  )}
                  {settings.notificationOfAcceptance && (
                    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="p-3 text-gray-700">Notification of Acceptance</td>
                      <td className="p-3 text-gray-700">{settings.notificationOfAcceptance}</td>
                    </tr>
                  )}
                  {settings.finalCameraReady && (
                    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="p-3 text-gray-700">Final Camera-Ready Submission</td>
                      <td className="p-3 text-gray-700">{settings.finalCameraReady}</td>
                    </tr>
                  )}
                  {settings.onlinePublication && (
                    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="p-3 text-gray-700">Online Publication</td>
                      <td className="p-3 text-gray-700">{settings.onlinePublication}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div 
          className="prose max-w-none prose-slate text-justify"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </main>
  )
}
