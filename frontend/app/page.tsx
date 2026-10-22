'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { settingsAPI } from '@/lib/api'
import { ExternalLink } from 'lucide-react'

function HomeSkeleton() {
  return (
    <main className="w-full bg-white font-sans flex-grow">
      <div className="w-full flex flex-col md:flex-row md:items-start animate-pulse">
        {/* ──── LEFT SIDEBAR SKELETON ──── */}
        <div className="w-full md:w-[210px] shrink-0 p-4 md:p-2 order-3 md:order-1">
          <div className="flex flex-col gap-3">
            {/* Call for Papers Skeleton */}
            <div className="border-2 border-slate-200">
              <div className="p-3 bg-slate-100">
                <div className="h-5 bg-slate-300 rounded w-3/4 mx-auto mb-2" />
                <div className="h-3.5 bg-slate-200 rounded w-1/2 mb-3" />
                <div className="space-y-2">
                  <div className="h-3 bg-slate-300 rounded w-2/3" />
                  <div className="h-3 bg-slate-200 rounded w-1/2 mb-2" />
                  <div className="h-3 bg-slate-300 rounded w-2/3" />
                  <div className="h-3 bg-slate-200 rounded w-1/2 mb-2" />
                  <div className="h-3 bg-slate-300 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 rounded w-1/2" />
                </div>
                <hr className="border-slate-200 my-3" />
                <div className="h-3.5 bg-slate-300 rounded w-2/3 mb-1.5" />
                <div className="h-4 bg-slate-200 rounded w-4/5 mx-auto" />
              </div>
            </div>

            {/* Indexing Skeleton */}
            <div className="border-2 border-slate-200">
              <div className="h-7 bg-slate-300" />
              <div className="p-2.5 bg-slate-50 flex flex-col gap-2">
                <div className="h-12 bg-white rounded border border-slate-200" />
                <div className="h-12 bg-white rounded border border-slate-200" />
                <div className="h-12 bg-white rounded border border-slate-200" />
              </div>
            </div>
          </div>
        </div>

        {/* ──── CENTER CONTENT SKELETON ──── */}
        <div className="w-full md:flex-grow p-4 md:border-l md:border-r border-slate-200 order-1 md:order-2">
          {/* Welcome title skeleton */}
          <div className="h-7 bg-slate-300 rounded w-2/5 mb-4" />

          {/* Paragraph 1 */}
          <div className="space-y-2 mb-4">
            <div className="h-3.5 bg-slate-200 rounded w-full" />
            <div className="h-3.5 bg-slate-200 rounded w-full" />
            <div className="h-3.5 bg-slate-200 rounded w-11/12" />
            <div className="h-3.5 bg-slate-200 rounded w-full" />
            <div className="h-3.5 bg-slate-200 rounded w-4/5" />
          </div>

          {/* Paragraph 2 */}
          <div className="space-y-2 mb-6">
            <div className="h-3.5 bg-slate-200 rounded w-full" />
            <div className="h-3.5 bg-slate-200 rounded w-full" />
            <div className="h-3.5 bg-slate-200 rounded w-5/6" />
          </div>

          {/* Subtitle skeleton */}
          <div className="h-5 bg-slate-300 rounded w-1/3 mb-3.5 mt-6" />

          {/* Bullet points */}
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-2.5 items-start">
                <div className="w-2 h-2 rounded-full bg-slate-300 mt-1.5 shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="h-3.5 bg-slate-200 rounded w-full" />
                  <div className="h-3.5 bg-slate-200 rounded w-4/5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ──── RIGHT SIDEBAR SKELETON ──── */}
        <div className="w-full md:w-[220px] shrink-0 p-4 md:p-2 order-2 md:order-3">
          <div className="flex flex-col gap-3">
            {/* Important Links Skeleton */}
            <div className="border border-slate-200">
              <div className="h-9 bg-slate-300" />
              <div className="divide-y divide-slate-100 bg-slate-50">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="px-3 py-2">
                    <div className="h-3 bg-slate-200 rounded w-4/5" />
                  </div>
                ))}
              </div>
            </div>

            {/* Explore KIET University Skeleton */}
            <div className="border-2 border-slate-200 bg-white">
              <div className="h-8 bg-slate-300" />
              <div className="p-2.5 flex flex-col items-center gap-2">
                <div className="w-full h-14 bg-slate-100 rounded border border-slate-200" />
                <div className="w-full h-7 bg-slate-200 rounded" />
              </div>
            </div>

            {/* Poster Skeleton */}
            <div className="w-full aspect-square bg-slate-50 border border-slate-200 flex items-center justify-center p-4">
              <div className="w-32 h-32 rounded-full bg-slate-200 border-4 border-slate-100" />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

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
    return <HomeSkeleton />
  }

  const s = settings || {}
  const themeColor = s.themeColor || '#00008b'
  const orangeColor = '#e67e22'

  const resolveUrl = (url: string) => {
    if (!url) return ''
    if (url.includes('drive.google.com/file/d/')) {
      const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/)
      if (match && match[1]) {
        return `https://lh3.googleusercontent.com/d/${match[1]}=w2000`
      }
    }
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

      {/* ===== RESPONSIVE FLEX LAYOUT ===== */}
      <div className="w-full flex flex-col md:flex-row md:items-start">

        {/* ──── LEFT SIDEBAR (Mobile: 3rd, Desktop: 1st) ──── */}
        <div className="w-full md:w-[210px] shrink-0 p-4 md:p-2 order-3 md:order-1">
          <div className="flex flex-col gap-3">
            {/* Call for Papers */}
            <div className="border-2" style={{ borderColor: themeColor }}>
              <div className="p-3" style={{ backgroundColor: orangeColor }}>
                <div className="font-bold text-black text-[16px] leading-tight text-center">Call for Papers</div>
                <div className="font-bold text-black text-[13px] mt-0.5 mb-2">For Upcoming Issue</div>

                {(() => {
                  const extractDate = (html: string, label: string): string => {
                    if (!html) return '';
                    const regex = new RegExp(`<td>\\s*${label}\\s*</td>\\s*<td>(.*?)(?:<br>)?\\s*</td>`, 'i');
                    const match = html.match(regex);
                    if (match) {
                      return match[1].replace(/<[^>]*>?/gm, '').trim();
                    }
                    return '';
                  };

                  const deadline = s.submissionDeadline || extractDate(s.callForPapersHtml, 'Submission Deadline');
                  const notification = s.notificationOfAcceptance || extractDate(s.callForPapersHtml, 'Notification of Acceptance');
                  const cameraReady = s.finalCameraReady || extractDate(s.callForPapersHtml, 'Final Camera-Ready Submission');
                  const publication = s.onlinePublication || extractDate(s.callForPapersHtml, 'Online Publication');

                  if (!deadline && !notification && !cameraReady && !publication) return null;

                  return (
                    <div className="mt-2 text-[11px] text-black">
                      {deadline && (
                        <>
                          <div className="font-bold">Submission Deadline:</div>
                          <div className="mb-1">{deadline}</div>
                        </>
                      )}
                      {notification && (
                        <>
                          <div className="font-bold">Notification of Acceptance:</div>
                          <div className="mb-1">{notification}</div>
                        </>
                      )}
                      {cameraReady && (
                        <>
                          <div className="font-bold">Final Camera-Ready Submission:</div>
                          <div className="mb-1">{cameraReady}</div>
                        </>
                      )}
                      {publication && (
                        <>
                          <div className="font-bold">Online Publication:</div>
                          <div>{publication}</div>
                        </>
                      )}
                    </div>
                  );
                })()}

                <hr className="border-black/20 my-3" />

                <div className="font-bold text-black text-[13px] mb-0.5">Send Manuscripts to:</div>
                <div className="text-[15px] underline mb-2 break-all text-center" style={{ color: themeColor }}>
                  ijaiqt@kiet.edu<br />

                </div>
              </div>
            </div>


            {/* Indexing & Citation */}
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
          </div>
        </div>

        {/* ──── CENTER CONTENT (Mobile: 1st, Desktop: 2nd) ──── */}
        <div className="w-full md:flex-grow p-4 md:border-l md:border-r border-gray-200 order-1 md:order-2">

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


        </div>

        {/* ──── RIGHT SIDEBAR (Mobile: 2nd, Desktop: 3rd) ──── */}
        <div className="w-full md:w-[220px] shrink-0 p-4 md:p-2 order-2 md:order-3">
          <div className="flex flex-col gap-3">



            {/* Important Links */}
            <div className="w-full" style={{ backgroundColor: themeColor }}>
              <div className="px-3 py-2 border-b border-white/20 text-center">
                <span className="font-bold  text-[16px] leading-tight " style={{ color: orangeColor }}>Important Links</span>
              </div>
              {[
                { label: 'Instructions to Authors', href: '/authors' },
                { label: 'Review Process', href: '/review-process' },
                { label: 'Ethics of Journal', href: '/ethics' },
                { label: 'IJAIQT Paper Format', href: '/IJAIQT_Paper_Template_v2.docx', download: true },
                { label: 'IJAIQT Copyright Form', href: '/IJAIQT_Copyright_Transfer_Form.pdf', download: true },
              ].map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  target={link.download ? "_blank" : undefined}
                  download={link.download ? true : undefined}
                  className="block px-3 py-1.5 text-white text-[12px] border-b border-white/15 hover:bg-white/10 transition-colors last:border-b-0"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Explore KIET University */}
            <div className="border-2 bg-white flex flex-col" style={{ borderColor: themeColor }}>
              <a
                href="https://kiet.edu/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-1.5 text-center flex items-center justify-center gap-1.5 hover:opacity-95 transition-opacity"
                style={{ backgroundColor: themeColor }}
              >
                <span className="font-bold text-white text-[14px]  leading-tight" >
                  Explore KIET University
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-white" />
              </a>
              <div className="p-2.5 flex flex-col items-center">
                <a
                  href="https://kiet.edu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full transition-transform duration-200 hover:scale-[1.02]"
                  title="Visit KIET (Deemed to be University)"
                >
                  <img
                    src="/KIET-Logo.webp"
                    alt="KIET (Deemed to be University)"
                    className="w-full h-auto object-contain"
                  />
                </a>
                <a
                  href="https://kiet.edu/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2.5 w-full py-1.5 px-2 text-center text-white text-[12px] font-bold flex items-center justify-center gap-1.5 transition-all duration-200 hover:opacity-90 shadow-sm"
                  style={{ backgroundColor: 'blue' }}
                >
                  <span>Visit kiet.edu</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
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
        </div>

      </div>
    </main>
  )
}
