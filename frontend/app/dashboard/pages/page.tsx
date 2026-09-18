'use client'

import { useEffect, useState, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useAuth } from '@/context/AuthContext'
import { settingsAPI } from '@/lib/api'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'

// Dynamically import JoditEditor to avoid SSR issues
const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false })

export default function ManagePages() {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Page Contents
  const [editorialBoardHtml, setEditorialBoardHtml] = useState('')
  const [callForPapersHtml, setCallForPapersHtml] = useState('')
  const [authorsHtml, setAuthorsHtml] = useState('')
  const [topicsHtml, setTopicsHtml] = useState('')
  const [faqHtml, setFaqHtml] = useState('')
  const [currentIssueHtml, setCurrentIssueHtml] = useState('')
  const [reviewProcessHtml, setReviewProcessHtml] = useState('')
  const [ethicsHtml, setEthicsHtml] = useState('')

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    } else if (user && user.role !== 'admin') {
      router.push('/')
    } else if (user && user.role === 'admin') {
      fetchSettings()
    }
  }, [user, isLoading, router])

  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.get()
      if (response.data) {
        const d = response.data
        setEditorialBoardHtml(d.editorialBoardHtml || '')
        setCallForPapersHtml(d.callForPapersHtml || '')
        setAuthorsHtml(d.authorsHtml || '')
        setTopicsHtml(d.topicsHtml || '')
        setFaqHtml(d.faqHtml || '')
        setCurrentIssueHtml(d.currentIssueHtml || '')
        setReviewProcessHtml(d.reviewProcessHtml || '')
        setEthicsHtml(d.ethicsHtml || '')
      }
    } catch (err: any) {
      console.error(err)
      setError('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsSubmitting(true)
    
    try {
      const formData = new FormData()
      
      formData.append('editorialBoardHtml', editorialBoardHtml)
      formData.append('callForPapersHtml', callForPapersHtml)
      formData.append('authorsHtml', authorsHtml)
      formData.append('topicsHtml', topicsHtml)
      formData.append('faqHtml', faqHtml)
      formData.append('currentIssueHtml', currentIssueHtml)
      formData.append('reviewProcessHtml', reviewProcessHtml)
      formData.append('ethicsHtml', ethicsHtml)

      await settingsAPI.update(formData)
      setSuccess('Pages updated successfully!')
      
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.error || 'Failed to update pages')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Jodit configuration
  const config = useMemo(() => ({
    readonly: false,
    height: 500,
    toolbarAdaptive: false,
    buttons: [
      'source', '|',
      'bold', 'strikethrough', 'underline', 'italic', '|',
      'superscript', 'subscript', '|',
      'ul', 'ol', '|',
      'outdent', 'indent', '|',
      'font', 'fontsize', 'brush', 'paragraph', '|',
      'image', 'video', 'table', 'link', '|',
      'align', 'undo', 'redo', '|',
      'hr', 'eraser', 'copyformat', '|',
      'fullsize'
    ]
  }), [])

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
      </div>
    )
  }

  const switchTab = (tab: string) => {
    const tabs = ['editorial', 'cfp', 'authors', 'topics', 'faq', 'current_issue', 'review_process', 'ethics'];
    tabs.forEach(t => {
      const el = document.getElementById(`tab-content-${t}`);
      const btn = document.getElementById(`tab-btn-${t}`);
      if (el && btn) {
        if (t === tab) {
          el.style.display = 'block';
          btn.className = 'whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm border-brand-500 text-brand-600';
        } else {
          el.style.display = 'none';
          btn.className = 'whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300';
        }
      }
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 max-w-6xl h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard"
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-700"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold text-slate-900">Manage Page Contents</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
            {error}
          </div>
        )}
        
        {success && (
          <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-xl border border-green-200">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Page Content Editor</h2>
            
            <div className="border-b border-slate-200 mb-6">
              <nav className="-mb-px flex space-x-4 overflow-x-auto">
                {['editorial', 'cfp', 'authors', 'topics', 'faq', 'current_issue', 'review_process', 'ethics'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => switchTab(tab)}
                    id={`tab-btn-${tab}`}
                    className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm ${tab === 'editorial' ? 'border-brand-500 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
                  >
                    {tab === 'editorial' && 'Editorial Board'}
                    {tab === 'cfp' && 'Call For Papers'}
                    {tab === 'authors' && 'Authors'}
                    {tab === 'topics' && 'Topics'}
                    {tab === 'faq' && 'FAQs'}
                    {tab === 'current_issue' && 'Current Issue'}
                    {tab === 'review_process' && 'Review Process'}
                    {tab === 'ethics' && 'Ethics'}
                  </button>
                ))}
              </nav>
            </div>

            <div className="space-y-8">
              
              <div id="tab-content-editorial" style={{ display: 'block' }}>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Editorial Board Page</label>
                <div className="bg-white">
                  <JoditEditor
                    value={editorialBoardHtml}
                    config={config}
                    onBlur={newContent => setEditorialBoardHtml(newContent)}
                  />
                </div>
              </div>

              <div id="tab-content-cfp" style={{ display: 'none' }}>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Call For Papers Page</label>
                <div className="bg-white">
                  <JoditEditor
                    value={callForPapersHtml}
                    config={config}
                    onBlur={newContent => setCallForPapersHtml(newContent)}
                  />
                </div>
              </div>

              <div id="tab-content-authors" style={{ display: 'none' }}>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Instruction To Authors Page</label>
                <div className="bg-white">
                  <JoditEditor
                    value={authorsHtml}
                    config={config}
                    onBlur={newContent => setAuthorsHtml(newContent)}
                  />
                </div>
              </div>

              <div id="tab-content-topics" style={{ display: 'none' }}>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Topics Covered Page</label>
                <div className="bg-white">
                  <JoditEditor
                    value={topicsHtml}
                    config={config}
                    onBlur={newContent => setTopicsHtml(newContent)}
                  />
                </div>
              </div>

              <div id="tab-content-faq" style={{ display: 'none' }}>
                <label className="block text-sm font-semibold text-slate-700 mb-2">FAQs Page</label>
                <div className="bg-white">
                  <JoditEditor
                    value={faqHtml}
                    config={config}
                    onBlur={newContent => setFaqHtml(newContent)}
                  />
                </div>
              </div>

              <div id="tab-content-current_issue" style={{ display: 'none' }}>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Current Issue Page</label>
                <div className="bg-white">
                  <JoditEditor
                    value={currentIssueHtml}
                    config={config}
                    onBlur={newContent => setCurrentIssueHtml(newContent)}
                  />
                </div>
              </div>

              <div id="tab-content-review_process" style={{ display: 'none' }}>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Review Process Page</label>
                <div className="bg-white">
                  <JoditEditor
                    value={reviewProcessHtml}
                    config={config}
                    onBlur={newContent => setReviewProcessHtml(newContent)}
                  />
                </div>
              </div>

              <div id="tab-content-ethics" style={{ display: 'none' }}>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Ethics Page</label>
                <div className="bg-white">
                  <JoditEditor
                    value={ethicsHtml}
                    config={config}
                    onBlur={newContent => setEthicsHtml(newContent)}
                  />
                </div>
              </div>

            </div>
          </div>

          <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] flex justify-center z-50">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full max-w-sm px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors shadow-sm disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {isSubmitting ? 'Saving Pages...' : 'Save Page Contents'}
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
