"use client";

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { settingsAPI } from '@/lib/api'

export default function Navbar() {
  const pathname = usePathname()
  const [bannerUrl, setBannerUrl] = useState('')
  const [themeColor, setThemeColor] = useState('#00008b')

  const fetchSettings = async () => {
    try {
      const res = await settingsAPI.get()
      if (res.data) {
        if (res.data.bannerImageUrl) setBannerUrl(res.data.bannerImageUrl)
        if (res.data.themeColor) setThemeColor(res.data.themeColor)
      }
    } catch (e) {
      console.error("Failed to fetch settings", e)
    }
  }

  useEffect(() => {
    fetchSettings()

    const handleSettingsUpdate = () => {
      fetchSettings()
    }

    window.addEventListener('settingsUpdated', handleSettingsUpdate)
    return () => window.removeEventListener('settingsUpdated', handleSettingsUpdate)
  }, [])

  if (pathname.startsWith('/dashboard') || pathname.startsWith('/login')) {
    return null;
  }

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Editors', path: '/editorial-board' },
    { name: 'Call For Papers', path: '/call-for-papers' },
    { name: 'Authors', path: '/authors' },
    { name: 'Current Issue', path: '/current-issue' },
    { name: 'Archive', path: '/archive' },

    { name: 'Topics Covered', path: '/topics' },
    { name: 'FAQs', path: '/faq' },
  ]

  return (
    <header className="w-full bg-white flex flex-col items-center border-b shadow-sm pb-4">
      <div className="w-full max-w-6xl mx-auto flex flex-col">
        {/* Banner Image */}
        {bannerUrl ? (
          <div className="w-full flex justify-center mb-1">
            <img 
              src={bannerUrl.startsWith('http') ? bannerUrl : `http://localhost:5001${bannerUrl}`} 
              alt="Site Banner" 
              className="object-cover border border-gray-300 shadow-sm"
              style={{ width: '1017px', height: '179px' }}
            />
          </div>
        ) : (
          <div className="w-full h-32 bg-gray-100 flex items-center justify-center text-gray-500 mb-1 border border-gray-300">
            No banner uploaded. Admin can change this in Settings.
          </div>
        )}

        {/* Navbar */}
        <nav 
          className="w-full border-t border-b border-gray-400"
          style={{ backgroundColor: themeColor }}
        >
          <ul className="flex flex-wrap w-full">
            {navLinks.map((link, index) => {
              const isActive = pathname === link.path
              return (
                <li 
                  key={link.path}
                  className="flex-grow text-center border-r border-gray-300/30 last:border-r-0 transition-colors"
                  style={{
                    backgroundColor: isActive ? '#ff9900' : 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  <Link 
                    href={link.path} 
                    className="block w-full h-full py-2 px-3 text-white font-bold text-sm sm:text-base whitespace-nowrap"
                  >
                    {link.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </header>
  )
}
