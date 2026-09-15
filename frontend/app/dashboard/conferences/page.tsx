'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { conferencesAPI } from '@/lib/api'
import { Trash2, Plus, Loader2 } from 'lucide-react'

export default function ManageConferencesPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [conferences, setConferences] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Form state
  const [title, setTitle] = useState('')
  const [order, setOrder] = useState('0')
  const [pdfFile, setPdfFile] = useState<File | null>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    } else if (user && user.role !== 'admin') {
      router.push('/')
    } else if (user && user.role === 'admin') {
      fetchConferences()
    }
  }, [user, isLoading, router])

  const fetchConferences = async () => {
    try {
      const response = await conferencesAPI.getAll()
      setConferences(response.data)
    } catch (err: any) {
      console.error(err)
      setError('Failed to load conferences')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !pdfFile) {
      setError('Title and PDF file are required')
      return
    }

    setError('')
    setIsSubmitting(true)
    
    try {
      const formData = new FormData()
      formData.append('title', title)
      formData.append('order', order)
      formData.append('pdfFile', pdfFile)

      await conferencesAPI.create(formData)
      
      // Reset form
      setTitle('')
      setOrder('0')
      setPdfFile(null)
      
      // Refresh list
      fetchConferences()
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.error || 'Failed to add conference')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this conference?')) return

    try {
      await conferencesAPI.delete(id)
      fetchConferences()
    } catch (err: any) {
      console.error(err)
      alert('Failed to delete conference')
    }
  }

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <Loader2 className="animate-spin h-8 w-8 text-brand-600" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900">Manage Conferences</h1>
          <p className="text-slate-500 mt-1">Upload and manage conference proceedings.</p>
        </div>
        <button
          onClick={() => router.push('/dashboard')}
          className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium text-sm"
        >
          Back to Dashboard
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Create Form */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-brand-600" />
              Add Conference
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Title / Description</label>
                <textarea
                  required
                  rows={4}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition-all text-sm"
                  placeholder="e.g. 1. National Conference on Information Technology..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Display Order</label>
                <input
                  type="number"
                  value={order}
                  onChange={(e) => setOrder(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none transition-all text-sm"
                />
                <p className="text-xs text-slate-500 mt-1">Lower numbers appear first.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">PDF File</label>
                <input
                  type="file"
                  required
                  accept=".pdf"
                  onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100 transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold py-2.5 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? 'Uploading...' : 'Upload Conference'}
              </button>
            </form>
          </div>
        </div>

        {/* Conferences List */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-200 bg-slate-50">
              <h2 className="text-xl font-bold text-slate-900">Uploaded Conferences</h2>
            </div>
            
            <div className="divide-y divide-slate-200">
              {conferences.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  No conferences uploaded yet.
                </div>
              ) : (
                conferences.map((conf) => (
                  <div key={conf._id} className="p-6 flex items-start gap-4 hover:bg-slate-50 transition-colors">
                    <div className="bg-brand-100 text-brand-700 text-xs font-bold px-2 py-1 rounded">
                      Order: {conf.order}
                    </div>
                    <div className="flex-1">
                      <p className="text-slate-900 font-medium leading-relaxed">{conf.title}</p>
                      <a 
                        href={`${process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') : 'http://localhost:5001'}${conf.pdfUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand-600 hover:underline text-sm font-medium mt-2 inline-block"
                      >
                        View PDF
                      </a>
                    </div>
                    <button
                      onClick={() => handleDelete(conf._id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                      title="Delete Conference"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
