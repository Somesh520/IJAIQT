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
  const themeColor = s.themeColor || '#00008b' // default to blue as requested
  const secondaryColor = '#e67e22' // Standard orange for contrast, typical in these journals

  return (
    <main className="w-full bg-white font-sans min-h-screen">
      <div className="max-w-7xl mx-auto px-2 lg:px-4 py-6 flex flex-col lg:flex-row border-x border-b border-green-600/40 min-h-screen">
        
        {/* Left Sidebar: Indexing Box */}
        <aside className="lg:w-[25%] w-full p-4 lg:border-r border-green-600/40 mb-6 lg:mb-0">
          <div className="rounded-md p-[6px] flex flex-col gap-[6px]" style={{ backgroundColor: themeColor }}>
            <div className="font-bold text-white text-[16px] underline">
              Indexing & Citation:
            </div>
            <style>{`
              @keyframes marqueeUp {
                0% { transform: translateY(350px); }
                100% { transform: translateY(-100%); }
              }
              .marquee-vertical {
                animation: marqueeUp 15s linear infinite;
              }
              .marquee-vertical:hover {
                animation-play-state: paused;
              }
              
              @keyframes marqueeUpCfp {
                0% { transform: translateY(200px); }
                100% { transform: translateY(-100%); }
              }
              .marquee-vertical-cfp {
                animation: marqueeUpCfp 10s linear infinite;
              }
              .marquee-vertical-cfp:hover {
                animation-play-state: paused;
              }
            `}</style>
            <div className="bg-[#f39c12] w-full h-[350px] overflow-hidden relative flex justify-center shadow-inner">
              <div className="marquee-vertical w-full flex flex-col items-center gap-4 py-3 absolute">
                {s.indexingImages && s.indexingImages.length > 0 ? (
                  s.indexingImages.map((img: string, idx: number) => (
                    <div key={idx} className="bg-white p-3 w-[85%] flex justify-center shadow-sm">
                      <img 
                        src={img.startsWith('http') ? img : `${process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') : 'http://localhost:5001'}${img}`} 
                        alt={`Indexing logo ${idx + 1}`} 
                        className="max-w-full h-auto object-contain"
                      />
                    </div>
                  ))
                ) : null}
              </div>
            </div>
          </div>
        </aside>

        {/* Center Main Content */}
        <div className="lg:w-[50%] w-full p-4 lg:border-r border-green-600/40 flex flex-col mb-6 lg:mb-0">
          
          {/* Welcome Section */}
          <section className="mb-6">
            <h1 
              className="text-2xl md:text-3xl font-serif font-bold mb-4 text-[#00008b]" 
              style={{ color: '#008000' }} // Overriding to green as seen in the screenshot
              dangerouslySetInnerHTML={{ __html: s.homeWelcomeTitle || 'Welcome' }}
            />
            <div 
              className="text-gray-900 text-justify leading-relaxed text-[15px] space-y-4"
              dangerouslySetInnerHTML={{ __html: s.homeWelcomeText || 'Welcome to our journal.' }}
            />
          </section>

          {/* Scope and News Section */}
          <section className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-gray-200">
            {/* Scope */}
            <div className="flex flex-col">
              <div 
                className="text-white font-bold py-2 px-3 text-[15px]" 
                style={{ backgroundColor: secondaryColor }}
                dangerouslySetInnerHTML={{ __html: s.scopeTitle || 'example' }}
              />
              <div 
                className="p-4 text-center text-white text-xl flex-grow flex items-center justify-center mt-[1px]"
                style={{ backgroundColor: secondaryColor }}
                dangerouslySetInnerHTML={{ __html: s.scopeText || 'example' }}
              />
            </div>

            {/* News */}
            <div className="flex flex-col">
              <div 
                className="text-white font-bold py-2 px-3 text-[15px]" 
                style={{ backgroundColor: secondaryColor }}
              >
                Journal News
              </div>
              <div className="p-4 flex-grow bg-white mt-[2px]" style={{ border: `1px solid ${secondaryColor}` }}>
                <ul className="space-y-3">
                  {s.newsLinks && s.newsLinks.length > 0 ? (
                    s.newsLinks.map((link: any, idx: number) => (
                      <li key={idx}>
                        <Link 
                          href={link.content ? `/news/${link._id}` : (link.url || '#')} 
                          className="hover:underline text-[14px]"
                          style={{ color: themeColor }}
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500 text-sm">No news available.</li>
                  )}
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <aside className="lg:w-[25%] w-full p-4 flex flex-col gap-6">
          
          {/* Call for papers box */}
          <div className="w-full rounded-md p-[6px]" style={{ backgroundColor: themeColor }}>
            <div className="bg-[#f39c12] w-full overflow-hidden h-[180px] relative flex justify-center">
              <div className="marquee-vertical-cfp absolute w-full flex flex-col gap-4 p-4">
                {/* Block 1 */}
                <div>
                  <div>
                    <div className="font-bold text-black text-xl leading-tight">Call for Papers</div>
                    <div className="text-black text-[15px] mt-1">For Upcoming Issue</div>
                  </div>
                  <hr className="border-black/20 my-3" />
                  <div>
                    <div className="font-bold text-black text-[15px] mb-1">Send Manuscripts to:</div>
                    <div className="text-[#00008b] text-[15px]">
                      ijespr@gmail.com,
                      <br />
                      ijeseditorinchief@gmail.com
                    </div>
                  </div>
                </div>
                {/* Duplicate Block 1 for seamless scroll */}
                <div className="mt-8">
                  <div>
                    <div className="font-bold text-black text-xl leading-tight">Call for Papers</div>
                    <div className="text-black text-[15px] mt-1">For Upcoming Issue</div>
                  </div>
                  <hr className="border-black/20 my-3" />
                  <div>
                    <div className="font-bold text-black text-[15px] mb-1">Send Manuscripts to:</div>
                    <div className="text-[#00008b] text-[15px]">
                      ijespr@gmail.com,
                      <br />
                      ijeseditorinchief@gmail.com
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Important Links box */}
          <div className="w-full rounded-md overflow-hidden pb-2" style={{ backgroundColor: themeColor }}>
            <div className="p-3">
              <div className="text-[#f39c12] font-bold underline text-[15px]">Important Links:</div>
            </div>
            <div className="flex flex-col">
              <Link href="/authors" className="px-4 py-2 text-white text-[13px] border-t border-white/20 hover:bg-white/10 transition-colors">
                Instructions to Authors
              </Link>
              <Link href="/review-process" className="px-4 py-2 text-white text-[13px] border-t border-white/20 hover:bg-white/10 transition-colors">
                Review Process
              </Link>
              <Link href="/ethics" className="px-4 py-2 text-white text-[13px] border-t border-white/20 hover:bg-white/10 transition-colors">
                Ethics of Journal
              </Link>
              <Link href="/paper-format" className="px-4 py-2 text-white text-[13px] border-t border-white/20 hover:bg-white/10 transition-colors">
                IJESPR Paper Format
              </Link>
              <Link href="/copyright-form" className="px-4 py-2 text-white text-[13px] border-t border-white/20 hover:bg-white/10 transition-colors">
                IJESPR Copyright Form
              </Link>
            </div>
          </div>

          {/* Vertical Side Banner */}
          {s.sideBannerUrl ? (
            <img 
              src={s.sideBannerUrl.startsWith('http') ? s.sideBannerUrl : `${process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') : 'http://localhost:5001'}${s.sideBannerUrl}`} 
              alt="Sidebar Banner" 
              className="w-full max-w-[280px] h-auto object-contain border border-gray-200 shadow-sm rounded mx-auto mt-2"
            />
          ) : null}

        </aside>

      </div>
    </main>
  )
}
