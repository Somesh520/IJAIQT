'use client'

import React, { useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { Unplug } from 'lucide-react'

export default function NotFound() {
  useEffect(() => {
    document.body.classList.add('hide-nav-footer')
    return () => document.body.classList.remove('hide-nav-footer')
  }, [])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center font-serif">
      
      {/* 404 Heading */}
      <h1 className="text-[120px] md:text-[150px] font-normal leading-none text-black tracking-tight mb-8">
        404
      </h1>

      {/* Minimal Graphic Area */}
      <div className="relative mb-12 flex items-end justify-center h-40 w-full max-w-sm">
        {/* Simple grey stones */}
        <div className="absolute left-12 bottom-0 h-20 w-12 rounded-t-full bg-slate-200" />
        <div className="absolute left-10 bottom-6 h-8 w-16 rounded-full bg-slate-200" />
        <div className="absolute right-12 bottom-0 h-32 w-20 rounded-t-full bg-slate-200" />

        {/* Unplugged Icon */}
        <motion.div
          className="relative z-10 text-slate-800"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <Unplug strokeWidth={1} className="h-24 w-24" />
        </motion.div>
        
        {/* Wire paths */}
        <svg className="absolute inset-0 h-full w-full pointer-events-none" preserveAspectRatio="none">
           <path d="M 0 160 Q 100 160 150 140" fill="none" stroke="#1e293b" strokeWidth="2" />
           <path d="M 384 160 Q 284 160 234 140" fill="none" stroke="#1e293b" strokeWidth="2" />
        </svg>
      </div>

      {/* Text Content */}
      <h2 className="mb-3 text-3xl font-bold text-black">
        Look like you're lost
      </h2>
      <p className="mb-8 text-lg text-slate-600">
        The page you are looking for is not available!
      </p>

      {/* Go to Home Button */}
      <Link 
        href="/"
        className="rounded bg-[#22c55e] px-8 py-2.5 text-[15px] text-white transition-colors hover:bg-[#16a34a]"
      >
        Go to Home
      </Link>
    </div>
  )
}
