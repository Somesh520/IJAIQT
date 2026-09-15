'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { papersAPI, issuesAPI } from '@/lib/api'
import { Plus, Edit2, Trash2, Loader2, FileText, Upload } from 'lucide-react'

interface Paper {
  _id: string
  title: string
  authors: { name: string; affiliation: string; email: string }[]
  abstract: string
  keywords: string[]
  issueId: { _id: string; volume: number; issue: number } | string
  pdfUrl: string
  isPublished: boolean
}

interface Issue {
  _id: string
  volume: number
  issue: number
  isCurrent: boolean
}

export default function ManagePapersPage() {
  const { user, isLoading: isAuthLoading } = useAuth()
  const router = useRouter()

  const [papers, setPapers] = useState<Paper[]>([])
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Form state
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const [title, setTitle] = useState('')
  const [abstract, setAbstract] = useState('')
  const [keywords, setKeywords] = useState('')
  const [issueId, setIssueId] = useState('')
  const [isPublished, setIsPublished] = useState(false)
  
  const [authors, setAuthors] = useState([{ name: '', affiliation: '', email: '' }])
  
  const [file, setFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push('/login')
    }
  }, [user, isAuthLoading, router])

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    setLoading(true)
    try {
      const [papersRes, issuesRes] = await Promise.all([
        papersAPI.getAll(),
        issuesAPI.getAll(false)
      ])
      setPapers(papersRes.data)
      setIssues(issuesRes.data)
      if (issuesRes.data.length > 0 && !issueId) {
        setIssueId(issuesRes.data[0]._id)
      }
    } catch (err) {
      setError('Failed to fetch data.')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNew = () => {
    setEditingId(null)
    setTitle('')
    setAbstract('')
    setKeywords('')
    setAuthors([{ name: '', affiliation: '', email: '' }])
    setFile(null)
    setIsPublished(false)
    if (issues.length > 0) setIssueId(issues[0]._id)
    setIsFormOpen(true)
  }

  const handleEdit = (paper: Paper) => {
    setEditingId(paper._id)
    setTitle(paper.title)
    setAbstract(paper.abstract)
    setKeywords(paper.keywords?.join(', ') || '')
    setIssueId(typeof paper.issueId === 'object' ? paper.issueId._id : paper.issueId)
    setIsPublished(paper.isPublished)
    
    if (paper.authors && paper.authors.length > 0) {
      setAuthors(paper.authors.map(a => ({ name: a.name || '', affiliation: a.affiliation || '', email: a.email || '' })))
    } else {
      setAuthors([{ name: '', affiliation: '', email: '' }])
    }
    
    setFile(null)
    setIsFormOpen(true)
  }

  const handleAddAuthor = () => {
    setAuthors([...authors, { name: '', affiliation: '', email: '' }])
  }

  const handleRemoveAuthor = (index: number) => {
    setAuthors(authors.filter((_, i) => i !== index))
  }

  const handleAuthorChange = (index: number, field: string, value: string) => {
    const newAuthors = [...authors]
    newAuthors[index] = { ...newAuthors[index], [field]: value }
    setAuthors(newAuthors)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!editingId && !file) {
      alert('A PDF file is required for new papers.')
      return
    }

    const formData = new FormData()
    formData.append('title', title)
    formData.append('abstract', abstract)
    formData.append('issueId', issueId)
    formData.append('isPublished', String(isPublished))
    
    const keywordsArray = keywords.split(',').map(k => k.trim()).filter(k => k)
    formData.append('keywords', JSON.stringify(keywordsArray))
    
    formData.append('authors', JSON.stringify(authors))
    
    if (file) {
      formData.append('pdf', file)
    }

    try {
      if (editingId) {
        await papersAPI.update(editingId, formData)
      } else {
        await papersAPI.create(formData)
      }
      setIsFormOpen(false)
      fetchData()
    } catch (err) {
      alert('Error saving paper. Ensure the file is a PDF and under 10MB.')
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this paper?')) {
      try {
        await papersAPI.delete(id)
        fetchData()
      } catch (err) {
        alert('Failed to delete paper.')
      }
    }
  }

  if (isAuthLoading || !user) return <div className="p-12 text-center"><Loader2 className="animate-spin h-8 w-8 mx-auto" /></div>

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 font-serif">Manage Papers</h1>
          <p className="text-slate-500 mt-2">Upload research papers and attach PDFs.</p>
        </div>
        <button 
          onClick={handleCreateNew}
          className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-md shadow flex items-center gap-2 transition-colors"
        >
          <Plus size={20} /> Upload Paper
        </button>
      </div>

      {error && <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">{error}</div>}

      {isFormOpen && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-200 mb-8">
          <h2 className="text-xl font-bold mb-4">{editingId ? 'Edit Paper' : 'Upload New Paper'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <label className="block text-sm font-medium mb-1">Paper Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="w-full border p-2 rounded focus:ring-2 focus:ring-brand-500 outline-none" />
            </div>

            <div className="border p-4 rounded-md bg-slate-50 space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold text-slate-700">Authors</label>
                <button type="button" onClick={handleAddAuthor} className="text-xs font-medium text-brand-600 hover:text-brand-800 flex items-center gap-1">
                  <Plus size={14} /> Add Author
                </button>
              </div>
              
              {authors.map((author, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center relative bg-white p-3 border rounded">
                  <div className="md:col-span-11">
                    <label className="block text-xs font-medium mb-1">Name</label>
                    <input type="text" value={author.name} onChange={e => handleAuthorChange(index, 'name', e.target.value)} required className="w-full border p-2 rounded outline-none" />
                  </div>
                  <div className="md:col-span-1 flex justify-center mt-4">
                    {authors.length > 1 && (
                      <button type="button" onClick={() => handleRemoveAuthor(index)} className="text-red-500 hover:text-red-700 p-2" title="Remove Author">
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Keywords</label>
              <div className="w-full border p-2 rounded focus-within:ring-2 focus-within:ring-brand-500 bg-white min-h-[42px] flex flex-wrap gap-2 items-center">
                {keywords.split(',').filter(k => k.trim()).map((kw, i) => (
                  <span key={i} className="bg-brand-100 text-brand-800 text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                    {kw.trim()}
                    <button type="button" onClick={() => {
                      const newKws = keywords.split(',').map(k => k.trim()).filter(k => k);
                      newKws.splice(i, 1);
                      setKeywords(newKws.join(', '));
                    }} className="text-brand-600 hover:text-brand-900 font-bold ml-1">×</button>
                  </span>
                ))}
                <input 
                  type="text" 
                  className="flex-1 outline-none min-w-[120px] text-sm" 
                  placeholder={keywords ? "" : "Type a keyword and press comma..."} 
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = (e.target as HTMLInputElement).value.trim();
                      if (val) {
                        setKeywords(prev => prev ? `${prev}, ${val}` : val);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                  onBlur={e => {
                    const val = e.target.value.trim();
                    if (val) {
                      setKeywords(prev => prev ? `${prev}, ${val}` : val);
                      e.target.value = '';
                    }
                  }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Abstract</label>
              <textarea value={abstract} onChange={e => setAbstract(e.target.value)} required rows={4} className="w-full border p-2 rounded focus:ring-2 focus:ring-brand-500 outline-none" placeholder="Paste the full paper abstract here..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Assign to Issue</label>
                <select value={issueId} onChange={e => setIssueId(e.target.value)} required className="w-full border p-2 rounded focus:ring-2 focus:ring-brand-500 outline-none">
                  {issues.map(iss => (
                    <option key={iss._id} value={iss._id}>
                      Vol {iss.volume}, Issue {iss.issue} {iss.isCurrent ? '(Current)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Upload PDF</label>
                <div className="flex items-center gap-3">
                  <input 
                    type="file" 
                    accept="application/pdf"
                    onChange={e => setFile(e.target.files?.[0] || null)}
                    ref={fileInputRef}
                    className="hidden"
                  />
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-slate-100 border border-slate-300 text-slate-700 hover:bg-slate-200 px-4 py-2 rounded flex items-center gap-2 transition-colors"
                  >
                    <Upload size={18} /> {file ? file.name : 'Choose PDF File'}
                  </button>
                  {editingId && !file && <span className="text-xs text-slate-500 italic">Leave empty to keep existing PDF</span>}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300 rounded" />
                <span className="text-sm font-medium text-slate-700">Publish this paper immediately</span>
              </label>
            </div>

            <div className="flex gap-3 pt-4">
              <button type="submit" className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2 rounded-md font-medium transition-colors">
                {editingId ? 'Update Paper' : 'Upload Paper'}
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
          <ul className="divide-y divide-slate-100">
            {papers.map((paper) => (
              <li key={paper._id} className="p-5 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-slate-900 text-lg mb-1">{paper.title}</h3>
                    <div className="text-sm text-slate-600 mb-2">
                      {paper.authors?.map(a => a.name).join(', ') || 'No authors listed'}
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs font-medium">
                      {paper.issueId && typeof paper.issueId === 'object' && (
                        <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md">
                          Vol {paper.issueId.volume}, Issue {paper.issueId.issue}
                        </span>
                      )}
                      
                      <a href={`${process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') : 'http://localhost:5001'}${paper.pdfUrl}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-red-600 hover:text-red-700 hover:underline">
                        <FileText size={14} /> View PDF
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => handleEdit(paper)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(paper._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
            {papers.length === 0 && (
              <li className="p-8 text-center text-slate-500">No papers found. Upload one to get started.</li>
            )}
          </ul>
        </div>
      )}
    </div>
  )
}
