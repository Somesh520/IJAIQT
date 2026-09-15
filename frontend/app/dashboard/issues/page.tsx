'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { issuesAPI } from '@/lib/api'
import { Plus, Edit2, Trash2, CheckCircle, XCircle, Loader2 } from 'lucide-react'

interface Issue {
  _id: string
  volume: number
  issue: number
  year: number
  month: string
  description?: string
  isCurrent: boolean
  isPublished: boolean
  createdAt: string
}

export default function ManageIssuesPage() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const router = useRouter()

  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    volume: 1,
    issue: 1,
    year: new Date().getFullYear(),
    month: 'January',
    description: '',
    isCurrent: false,
    isPublished: false
  })

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login')
    }
  }, [user, isAuthLoading, router])

  useEffect(() => {
    if (user) {
      fetchIssues()
    }
  }, [user])

  const fetchIssues = async () => {
    setLoading(true)
    try {
      const res = await issuesAPI.getAll(false) // fetch all, including unpublished
      setIssues(res.data)
    } catch (err) {
      setError('Failed to fetch issues.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement
    const checked = (e.target as HTMLInputElement).checked
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (editingId) {
        await issuesAPI.update(editingId, formData)
      } else {
        await issuesAPI.create(formData)
      }
      setIsFormOpen(false)
      setEditingId(null)
      fetchIssues()
    } catch (err) {
      alert('Error saving issue.')
    }
  }

  const handleEdit = (issue: Issue) => {
    setEditingId(issue._id)
    setFormData({
      volume: issue.volume,
      issue: issue.issue,
      year: issue.year,
      month: issue.month,
      description: issue.description || '',
      isCurrent: issue.isCurrent,
      isPublished: issue.isPublished
    })
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this issue?')) {
      try {
        await issuesAPI.delete(id)
        fetchIssues()
      } catch (err) {
        alert('Failed to delete issue.')
      }
    }
  }

  if (isAuthLoading || !user) return <div className="p-12 text-center"><Loader2 className="animate-spin h-8 w-8 mx-auto" /></div>

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-serif">Manage Issues</h1>
          <p className="text-slate-500 mt-2">Create and organize journal volumes and issues.</p>
        </div>
        <button 
          onClick={() => {
            setEditingId(null)
            setFormData({
              volume: 1, issue: 1, year: new Date().getFullYear(), month: 'January', description: '', isCurrent: false, isPublished: false
            })
            setIsFormOpen(true)
          }}
          className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-md shadow flex items-center gap-2 transition-colors"
        >
          <Plus size={20} /> Create Issue
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">{error}</div>}

      {isFormOpen && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-8">
          <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Issue' : 'Create New Issue'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Volume</label>
                <input type="number" name="volume" value={formData.volume} onChange={handleInputChange} required className="w-full border p-2 rounded focus:ring-2 focus:ring-brand-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Issue</label>
                <input type="number" name="issue" value={formData.issue} onChange={handleInputChange} required className="w-full border p-2 rounded focus:ring-2 focus:ring-brand-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Year</label>
                <input type="number" name="year" value={formData.year} onChange={handleInputChange} required className="w-full border p-2 rounded focus:ring-2 focus:ring-brand-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Month</label>
                <select name="month" value={formData.month} onChange={handleInputChange} required className="w-full border p-2 rounded focus:ring-2 focus:ring-brand-500 outline-none">
                  {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map(m => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Description (Optional)</label>
              <textarea name="description" value={formData.description} onChange={handleInputChange} rows={2} className="w-full border p-2 rounded focus:ring-2 focus:ring-brand-500 outline-none" />
            </div>

            <div className="flex gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="isCurrent" checked={formData.isCurrent} onChange={handleInputChange} className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded" />
                <span className="text-sm font-medium text-slate-700">Set as Current Issue</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="isPublished" checked={formData.isPublished} onChange={handleInputChange} className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded" />
                <span className="text-sm font-medium text-slate-700">Published to public</span>
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2 rounded-md font-medium transition-colors">
                {editingId ? 'Update Issue' : 'Save Issue'}
              </button>
              <button type="button" onClick={() => setIsFormOpen(false)} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-5 py-2 rounded-md font-medium transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-slate-400 h-8 w-8" /></div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 font-semibold text-sm text-slate-600">Issue Details</th>
                <th className="p-4 font-semibold text-sm text-slate-600">Status</th>
                <th className="p-4 font-semibold text-sm text-slate-600">Published</th>
                <th className="p-4 font-semibold text-sm text-slate-600 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {issues.map(issue => (
                <tr key={issue._id} className="hover:bg-slate-50">
                  <td className="p-4">
                    <div className="font-bold text-slate-900">Volume {issue.volume}, Issue {issue.issue}</div>
                    <div className="text-sm text-slate-500">{issue.month} {issue.year}</div>
                  </td>
                  <td className="p-4">
                    {issue.isCurrent ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle size={14} /> Current
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                        Archive
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    {issue.isPublished ? <CheckCircle className="text-green-500" size={20} /> : <XCircle className="text-red-500" size={20} />}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleEdit(issue)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(issue._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {issues.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">No issues found. Create one to get started.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
