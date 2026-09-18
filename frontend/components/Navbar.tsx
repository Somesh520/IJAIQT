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
    <header className="w-full bg-white flex flex-col">
      {/* Banner Image — flush to edges */}
      {bannerUrl ? (
        <div className="w-full">
          <img
            src={resolveUrl(bannerUrl)}
            alt="Site Banner"
            className="w-full h-auto block"
            onError={(e) => {
              const parent = e.currentTarget.parentElement
              if (parent) {
                parent.style.backgroundColor = '#f1f5f9'
                parent.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#94a3b8;font-size:14px;">Banner Image</div>'
              }
            }}
          />
        </div>
      ) : (
        <div className="w-full h-24 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
          No banner uploaded — Admin can set this in Dashboard → Settings.
        </div>
      )}

      {/* Navigation Bar */}
      <nav style={{ backgroundColor: themeColor }}>
        <ul className="flex flex-wrap w-full">
          {navLinks.map((link) => {
            const isActive = pathname === link.path
            return (
              <li
                key={link.path}
                className="flex-grow text-center border-r border-white/20 last:border-r-0 transition-colors"
                style={{
                  backgroundColor: isActive ? '#ff9900' : 'transparent'
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <Link
                  href={link.path}
                  className="block w-full h-full py-2 px-2 text-white font-bold text-[13px] whitespace-nowrap"
                >
                  {link.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}
