'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { settingsAPI } from '@/lib/api'
import { Loader2 } from 'lucide-react'

export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState<any>(null)

  const fetchSettings = async () => {
    try {
      const res = await settingsAPI.get()
      if (res.data) {
        setSettings(res.data)
      }
    } catch (e) {
      console.error('Failed to fetch settings', e)
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    fetchSettings()

    const handleUpdate = () => fetchSettings()
    window.addEventListener('settingsUpdated', handleUpdate)
    return () => window.removeEventListener('settingsUpdated', handleUpdate)
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-white">
        <Loader2 className="animate-spin h-8 w-8 text-gray-400" />
      </div>
    )
  }

  const s = settings || {}
  const themeColor = s.themeColor || '#00008b'
  const orangeColor = '#e67e22'

  const resolveUrl = (url: string) => {
    if (!url) return ''
    if (url.startsWith('http')) return url
    const base = process.env.NEXT_PUBLIC_API_URL
      ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '')
      : 'https://ijaiqt.onrender.com'
    return `${base}${url}`
  }

  return (
    <main className="w-full bg-white font-sans flex-grow">
      {/* Marquee animation styles */}
      <style>{`
        @keyframes marqueeUp {
          0% { transform: translateY(100%); }
          100% { transform: translateY(-100%); }
        }
        .marquee-vertical {
          animation: marqueeUp 18s linear infinite;
        }
        .marquee-vertical:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* ===== TABLE-STYLE 3-COLUMN LAYOUT ===== */}
      <table className="w-full border-collapse" style={{ tableLayout: 'fixed' }}>
        <colgroup>
          <col style={{ width: '150px' }} />
          <col />
          <col style={{ width: '220px' }} />
        </colgroup>
        <tbody>
          <tr className="align-top">

            {/* ──── LEFT SIDEBAR ──── */}
            <td className="p-2 align-top">
              <div className="border-2" style={{ borderColor: themeColor }}>
                {/* Header */}
                <div
                  className="text-white font-bold text-[12px] px-2 py-1.5"
                  style={{ backgroundColor: themeColor }}
                >
                  Indexing &amp; Citation:
                </div>
                {/* Scrolling indexing logos */}
                <div
                  className="overflow-hidden relative"
                  style={{
                    backgroundColor: orangeColor,
                    height: s.indexingImages && s.indexingImages.length > 2 ? '300px' : '200px'
                  }}
                >
                  <div className="marquee-vertical w-full flex flex-col items-center gap-3 p-2 absolute">
                    {s.indexingImages && s.indexingImages.length > 0 ? (
                      s.indexingImages.map((img: string, idx: number) => (
                        <div key={idx} className="bg-white p-2 w-full flex justify-center border border-gray-200">
                          <img
                            src={resolveUrl(img)}
                            alt={`Indexing ${idx + 1}`}
                            className="max-w-full h-auto object-contain"
                            style={{ maxHeight: '55px' }}
                          />
                        </div>
                      ))
                    ) : (
                      <div className="text-white text-[11px] text-center p-3">No indexing images uploaded.</div>
                    )}
                  </div>
                </div>
              </div>
            </td>

            {/* ──── CENTER CONTENT ──── */}
            <td className="px-4 py-3 align-top border-l border-r border-gray-200">

              {/* Welcome Section */}
              <section className="mb-5">
                <h1
                  className="text-[22px] font-serif font-bold mb-3"
                  style={{ color: '#000000' }}
                  dangerouslySetInnerHTML={{ __html: s.homeWelcomeTitle || 'Welcome to IJAIQT' }}
                />
                <div
                  className="text-gray-800 text-justify leading-[1.7] text-[14px] [&_p]:!text-justify [&_div]:!text-justify [&_li]:!text-justify [&_span]:!text-justify [&_p]:mb-4 [&_div]:mb-4 [&_ul]:mb-4 [&_ol]:mb-4 [&_li]:mb-2 [&_h1]:mb-4 [&_h2]:mb-4 [&_h3]:mb-4 [&>*:last-child]:mb-0"
                  dangerouslySetInnerHTML={{ __html: s.homeWelcomeText || 'Welcome to our journal.' }}
                />
              </section>


            </td>

            {/* ──── RIGHT SIDEBAR ──── */}
            <td className="p-2 align-top">
              <div className="flex flex-col gap-3">

                {/* Call for Papers */}
                <div className="border-2" style={{ borderColor: themeColor }}>
                  <div className="p-3" style={{ backgroundColor: orangeColor }}>
                    <div className="font-bold text-black text-[16px] leading-tight">Call for Papers</div>
                    <div className="text-black text-[12px] mt-0.5 mb-2">For Upcoming Issue</div>
                    
                    <div className="mt-2 text-[11px] text-black">
                      <div className="font-bold">Submission Deadline:</div>
                      <div className="mb-1">{s.submissionDeadline}</div>
                      <div className="font-bold">Notification of Acceptance:</div>
                      <div className="mb-1">{s.notificationOfAcceptance}</div>
                      <div className="font-bold">Final Camera-Ready Submission:</div>
                      <div className="mb-1">{s.finalCameraReady}</div>
                      <div className="font-bold">Online Publication:</div>
                      <div>{s.onlinePublication}</div>
                    </div>

                    <hr className="border-black/20 my-3" />

                    <div className="font-bold text-black text-[13px] mb-0.5">Send Manuscripts to:</div>
                    <div className="text-[11px] underline mb-2" style={{ color: themeColor }}>
                      ijespr@gmail.com<br />
                      ijeseditorinchief@gmail.com
                    </div>
                  </div>
                </div>

                {/* Important Links */}
                <div className="w-full" style={{ backgroundColor: themeColor }}>
                  <div className="px-3 py-2 border-b border-white/20">
                    <span className="font-bold underline text-[12px]" style={{ color: orangeColor }}>Important Links:</span>
                  </div>
                  {[
                    { label: 'Instructions to Authors', href: '/authors' },
                    { label: 'Review Process', href: '/review-process' },
                    { label: 'Ethics of Journal', href: '/ethics' },
                    { label: 'IJAIQT Paper Format', href: '/paper-format' },
                    { label: 'IJAIQT Copyright Form', href: '/copyright-form' },
                  ].map((link, idx) => (
                    <Link
                      key={idx}
                      href={link.href}
                      className="block px-3 py-1.5 text-white text-[12px] border-b border-white/15 hover:bg-white/10 transition-colors last:border-b-0"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                {/* Side Banner / Poster */}
                {s.sideBannerUrl && (
                  <img
                    src={resolveUrl(s.sideBannerUrl)}
                    alt="Journal Poster"
                    className="w-full h-auto object-contain border border-gray-200"
                  />
                )}
              </div>
            </td>

          </tr>
        </tbody>
      </table>
    </main>
  )
}
