'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { VCard } from '@/components/ui/v-card'
import { 
  FileText, 
  BookOpen, 
  Inbox,
  Presentation,
  Settings
} from 'lucide-react'

export default function DashboardPage() {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden font-sans pb-24">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-200/40 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-accent-500/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="container mx-auto px-4 py-12 max-w-6xl relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 space-y-6 md:space-y-0 bg-white/40 backdrop-blur-md p-8 rounded-3xl border border-slate-200/50 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <Link href="/" className="flex-shrink-0 bg-white p-2 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <Image
                src="/KIET-Logo.webp"
                alt="KIET Logo"
                width={70}
                height={70}
                className="object-contain"
              />
            </Link>
            <div>
              <h1 className="text-4xl font-serif font-extrabold text-slate-900 tracking-tight">Dashboard</h1>
              <div className="flex items-center gap-3 mt-3">
                <div className="h-8 w-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <p className="text-slate-600 font-medium">Welcome back, <span className="text-slate-900 font-bold">{user.name}</span></p>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 text-xs font-bold uppercase tracking-wider">
                  {user.role}
                </span>
              </div>
            </div>
          </div>
          
          <button
            onClick={logout}
            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-white px-6 py-3 font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200/50 transition-all hover:bg-red-50 hover:text-red-600 hover:ring-red-200 hover:shadow-md"
          >
            <span>Log Out</span>
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </div>

        {/* Dashboard Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 relative">
          <VCard
            href="/dashboard/issues"
            title="Manage Issues"
            description="Create, edit, publish, and organize journal issues and volumes."
            icon={<FileText className="h-7 w-7" />}
          />

          <VCard
            href="/dashboard/papers"
            title="Manage Papers"
            description="Upload research papers, assign to issues, and manage authors."
            icon={<BookOpen className="h-7 w-7" />}
          />



          <VCard
            href="/dashboard/contact"
            title="Contact Submissions"
            description="View and respond to inquiries from the public contact form."
            icon={<Inbox className="h-7 w-7" />}
          />

          <VCard
            href="/dashboard/pages"
            title="Manage Page Contents"
            description="Edit the HTML content for Editorial Board, Authors, CFP, FAQs, etc."
            icon={<FileText className="h-7 w-7" />}
          />

          <VCard
            href="/dashboard/settings"
            title="Site Settings"
            description="Manage site configuration, banners, and layout settings."
            icon={<Settings className="h-7 w-7" />}
          />
        </div>
      </div>
    </div>
  )
}
