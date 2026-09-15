'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { contactAPI } from '@/lib/api'
import { Loader2, Mail, CheckCircle, Archive, AlertCircle } from 'lucide-react'

interface ContactSubmission {
  _id: string
  name: string
  email: string
  subject: string
  message: string
  status: 'new' | 'read' | 'replied' | 'archived'
  createdAt: string
}

export default function ContactDashboardPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('')

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (user) {
      fetchSubmissions(filter)
    }
  }, [user, filter])

  const fetchSubmissions = async (statusFilter?: string) => {
    setLoading(true)
    try {
      const res = await contactAPI.getAll(statusFilter)
      setSubmissions(res.data)
    } catch (err: any) {
      setError('Failed to fetch contact submissions.')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await contactAPI.updateStatus(id, newStatus)
      // Optimistically update UI
      setSubmissions(prev => 
        prev.map(sub => sub._id === id ? { ...sub, status: newStatus as any } : sub)
      )
    } catch (err) {
      alert('Failed to update status.')
    }
  }

  if (isLoading || !user) return <div className="p-12 text-center">Loading...</div>

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-serif">Contact Submissions</h1>
          <p className="text-slate-500 mt-2">Manage messages received from the contact form.</p>
        </div>
        
        <select 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-white border border-slate-300 text-slate-700 rounded-md px-4 py-2 shadow-sm focus:ring-2 focus:ring-brand-500 outline-none"
        >
          <option value="">All Statuses</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center p-12 text-slate-400">
          <Loader2 className="animate-spin h-8 w-8" />
        </div>
      ) : submissions.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-500">
          No contact submissions found.
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <ul className="divide-y divide-slate-100">
            {submissions.map((sub) => (
              <li key={sub._id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-slate-900 text-lg">{sub.subject}</h3>
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        sub.status === 'new' ? 'bg-blue-100 text-blue-700' :
                        sub.status === 'read' ? 'bg-amber-100 text-amber-700' :
                        sub.status === 'replied' ? 'bg-green-100 text-green-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {sub.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-3">
                      <span className="flex items-center gap-1.5"><Mail size={16} /> {sub.name} ({sub.email})</span>
                      <span>{new Date(sub.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-slate-700">{sub.message}</p>
                  </div>
                  
                  <div className="flex flex-col gap-2 min-w-[140px]">
                    {sub.status === 'new' && (
                      <button 
                        onClick={() => updateStatus(sub._id, 'read')}
                        className="text-sm bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-md flex items-center justify-center gap-2 transition-colors"
                      >
                        Mark as Read
                      </button>
                    )}
                    {(sub.status === 'new' || sub.status === 'read') && (
                      <button 
                        onClick={() => updateStatus(sub._id, 'replied')}
                        className="text-sm bg-brand-50 text-brand-700 border border-brand-200 hover:bg-brand-100 px-3 py-1.5 rounded-md flex items-center justify-center gap-2 transition-colors"
                      >
                        <CheckCircle size={16} /> Mark Replied
                      </button>
                    )}
                    {sub.status !== 'archived' && (
                      <button 
                        onClick={() => updateStatus(sub._id, 'archived')}
                        className="text-sm bg-white border border-red-200 hover:bg-red-50 text-red-600 px-3 py-1.5 rounded-md flex items-center justify-center gap-2 transition-colors"
                      >
                        <Archive size={16} /> Archive
                      </button>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
