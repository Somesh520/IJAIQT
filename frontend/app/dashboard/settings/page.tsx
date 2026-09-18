'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { settingsAPI } from '@/lib/api'
import { Loader2, Save, ImageIcon, Settings as SettingsIcon, Plus, Trash2 } from 'lucide-react'
import dynamic from 'next/dynamic'

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false })

export default function SettingsPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Settings State
  const [themeColor, setThemeColor] = useState('#00008b')
  const [homeWelcomeTitle, setHomeWelcomeTitle] = useState('')
  const [homeWelcomeText, setHomeWelcomeText] = useState('')
  const [scopeTitle, setScopeTitle] = useState('')
  const [scopeText, setScopeText] = useState('')
  const [footerText, setFooterText] = useState('')
  const [sideButton1Text, setSideButton1Text] = useState('')
  const [sideButton1Url, setSideButton1Url] = useState('')
  const [sideButton2Text, setSideButton2Text] = useState('')
  const [sideButton2Url, setSideButton2Url] = useState('')
  
  // Page Contents
  const [editorialBoardHtml, setEditorialBoardHtml] = useState('')
  const [callForPapersHtml, setCallForPapersHtml] = useState('')
  const [authorsHtml, setAuthorsHtml] = useState('')
  const [topicsHtml, setTopicsHtml] = useState('')
  const [faqHtml, setFaqHtml] = useState('')
  const [currentIssueHtml, setCurrentIssueHtml] = useState('')

  // Timeline Dates
  const [submissionDeadline, setSubmissionDeadline] = useState('')
  const [notificationOfAcceptance, setNotificationOfAcceptance] = useState('')
  const [finalCameraReady, setFinalCameraReady] = useState('')
  const [onlinePublication, setOnlinePublication] = useState('')

  // Files and URLs
  const [bannerFile, setBannerFile] = useState<File | null>(null)
  const [bannerUrlInput, setBannerUrlInput] = useState('')
  const [currentBannerUrl, setCurrentBannerUrl] = useState('')

  const [sideBannerFile, setSideBannerFile] = useState<File | null>(null)
  const [sideBannerUrlInput, setSideBannerUrlInput] = useState('')
  const [currentSideBannerUrl, setCurrentSideBannerUrl] = useState('')

  const [currentIndexingImages, setCurrentIndexingImages] = useState<string[]>([])
  const [indexingImageFiles, setIndexingImageFiles] = useState<FileList | null>(null)

  // News Links
  const [newsLinks, setNewsLinks] = useState<{_id?: string, label: string, url: string, date: string, content: string}[]>([])

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
        if (d.bannerImageUrl) setCurrentBannerUrl(d.bannerImageUrl)
        if (d.sideBannerUrl) setCurrentSideBannerUrl(d.sideBannerUrl)
        if (d.indexingImages) setCurrentIndexingImages(d.indexingImages)
        setThemeColor(d.themeColor || '#00008b')
        setHomeWelcomeTitle(d.homeWelcomeTitle || '')
        setHomeWelcomeText(d.homeWelcomeText || '')
        setScopeTitle(d.scopeTitle || '')
        setScopeText(d.scopeText || '')
        setFooterText(d.footerText || '')
        setSideButton1Text(d.sideButton1Text || '')
        setSideButton1Url(d.sideButton1Url || '')
        setSideButton2Text(d.sideButton2Text || '')
        setSideButton2Url(d.sideButton2Url || '')
        setEditorialBoardHtml(d.editorialBoardHtml || '')
        setCallForPapersHtml(d.callForPapersHtml || '')
        setAuthorsHtml(d.authorsHtml || '')
        setTopicsHtml(d.topicsHtml || '')
        setFaqHtml(d.faqHtml || '')
        setCurrentIssueHtml(d.currentIssueHtml || '')
        setSubmissionDeadline(d.submissionDeadline || '')
        setNotificationOfAcceptance(d.notificationOfAcceptance || '')
        setFinalCameraReady(d.finalCameraReady || '')
        setOnlinePublication(d.onlinePublication || '')
        setNewsLinks(d.newsLinks || [])
      }
    } catch (err: any) {
      console.error(err)
      setError('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const addNewsLink = () => {
    setNewsLinks([...newsLinks, { label: '', url: '', date: '', content: '' }])
  }

  const removeNewsLink = (index: number) => {
    const newLinks = [...newsLinks]
    newLinks.splice(index, 1)
    setNewsLinks(newLinks)
  }

  const updateNewsLink = (index: number, field: 'label' | 'url' | 'date' | 'content', value: string) => {
    const newLinks = [...newsLinks]
    newLinks[index][field] = value
    setNewsLinks(newLinks)
  }

  // Shared Jodit config — allows paste without popups
  const joditConfig = (height: number = 250, placeholder: string = '') => ({
    readonly: false,
    height,
    placeholder,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: 'insert_clear_html' as const,
    defaultActionOnPasteFromWord: 'insert_clear_html' as const,
    processPasteHTML: true,
    buttons: [
      'bold', 'italic', 'underline', 'strikethrough', '|',
      'ul', 'ol', '|',
      'font', 'fontsize', 'brush', '|',
      'align', 'indent', 'outdent', '|',
      'link', 'image', 'table', '|',
      'hr', 'eraser', 'copyformat', '|',
      'undo', 'redo', '|',
      'fullsize', 'source', 'print'
    ],
  })


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsSubmitting(true)
    
    try {
      const formData = new FormData()
      
      // Basic text fields
      formData.append('themeColor', themeColor)
      formData.append('homeWelcomeTitle', homeWelcomeTitle)
      formData.append('homeWelcomeText', homeWelcomeText)
      formData.append('scopeTitle', scopeTitle)
      formData.append('scopeText', scopeText)
      formData.append('footerText', footerText)
      formData.append('sideButton1Text', sideButton1Text)
      formData.append('sideButton1Url', sideButton1Url)
      formData.append('sideButton2Text', sideButton2Text)
      formData.append('sideButton2Url', sideButton2Url)
      formData.append('submissionDeadline', submissionDeadline)
      formData.append('notificationOfAcceptance', notificationOfAcceptance)
      formData.append('finalCameraReady', finalCameraReady)
      formData.append('onlinePublication', onlinePublication)
      formData.append('newsLinks', JSON.stringify(newsLinks))

      // Images
      if (bannerFile) {
        formData.append('bannerImage', bannerFile)
      } else if (bannerUrlInput) {
        formData.append('bannerImageUrl', bannerUrlInput)
      }

      if (sideBannerFile) {
        formData.append('sideBannerImage', sideBannerFile)
      } else if (sideBannerUrlInput) {
        formData.append('sideBannerUrl', sideBannerUrlInput)
      } else if (!currentSideBannerUrl) {
        // User deleted the sidebar banner — send empty to clear it
        formData.append('sideBannerUrl', '')
      }

      if (indexingImageFiles) {
        for (let i = 0; i < indexingImageFiles.length; i++) {
          formData.append('indexingImages', indexingImageFiles[i])
        }
      }
      formData.append('keptIndexingImages', JSON.stringify(currentIndexingImages))

      const response = await settingsAPI.update(formData)
      if (response.data.bannerImageUrl) setCurrentBannerUrl(response.data.bannerImageUrl)
      if (response.data.sideBannerUrl) setCurrentSideBannerUrl(response.data.sideBannerUrl)
      if (response.data.indexingImages) setCurrentIndexingImages(response.data.indexingImages)
      
      setSuccess('Settings updated successfully')
      setBannerFile(null)
      setBannerUrlInput('')
      setSideBannerFile(null)
      setSideBannerUrlInput('')
      setIndexingImageFiles(null)
      
      // Trigger a reload for the navbar and homepage
      window.dispatchEvent(new Event('settingsUpdated'))
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.error || 'Failed to update settings')
    } finally {
      setIsSubmitting(false)
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
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold text-slate-900">Site Settings</h1>
          <p className="text-slate-500 mt-1">Manage global site configuration and layout.</p>
        </div>
        <button
          onClick={() => router.push('/dashboard')}
          className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors font-medium text-sm"
        >
          Back to Dashboard
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200 sticky top-4 z-50">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg mb-6 border border-green-200 sticky top-4 z-50">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 pb-20">
        
        {/* Theme Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-brand-600" />
            Theme Configuration
          </h2>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Theme Color</label>
            <div className="flex items-center gap-4">
              <input
                type="color"
                value={themeColor}
                onChange={(e) => setThemeColor(e.target.value)}
                className="h-10 w-20 p-1 border border-slate-200 rounded cursor-pointer"
              />
              <input
                type="text"
                value={themeColor}
                onChange={(e) => setThemeColor(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm uppercase font-mono"
              />
            </div>
          </div>
        </div>

        {/* Images Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-brand-600" />
            Banner Images
          </h2>
          
          <div className="space-y-8">
            {/* Top Banner */}
            <div>
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-lg font-semibold">Top Banner</h3>
                <span className="text-xs text-brand-600 bg-brand-50 px-2 py-1 rounded font-medium border border-brand-100">
                  Recommended Size: 1017px × 179px
                </span>
              </div>
              {currentBannerUrl && (
                <div className="mb-4">
                  <div className="border border-slate-200 rounded-lg p-2 bg-slate-50">
                    <img 
                      src={currentBannerUrl.startsWith('http') ? currentBannerUrl : `${process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') : 'https://ijaiqt.onrender.com'}${currentBannerUrl}`} 
                      alt="Top Banner" 
                      className="w-full h-auto max-h-32 object-contain rounded"
                    />
                  </div>
                </div>
              )}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      setBannerFile(e.target.files?.[0] || null)
                      setBannerUrlInput('')
                    }}
                    className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-slate-100"
                  />
                </div>
                <div>
                  <input
                    type="url"
                    value={bannerUrlInput}
                    onChange={(e) => {
                      setBannerUrlInput(e.target.value)
                      setBannerFile(null)
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                    placeholder="Or Image URL"
                  />
                </div>
              </div>
            </div>

            <hr className="border-slate-200" />

            {/* Side Banner */}
            <div>
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-lg font-semibold">Sidebar Banner</h3>
                <span className="text-xs text-brand-600 bg-brand-50 px-2 py-1 rounded font-medium border border-brand-100">
                  Recommended Size: 280px × 400px
                </span>
              </div>
              {currentSideBannerUrl && (
                <div className="mb-4">
                  <div className="border border-slate-200 rounded-lg p-2 bg-slate-50 w-32 relative group">
                    <img 
                      src={currentSideBannerUrl.startsWith('http') ? currentSideBannerUrl : `${process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') : 'https://ijaiqt.onrender.com'}${currentSideBannerUrl}`} 
                      alt="Side Banner" 
                      className="w-full h-auto object-contain rounded"
                    />
                    <button
                      type="button"
                      onClick={() => setCurrentSideBannerUrl('')}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remove sidebar banner"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      setSideBannerFile(e.target.files?.[0] || null)
                      setSideBannerUrlInput('')
                    }}
                    className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-slate-100"
                  />
                </div>
                <div>
                  <input
                    type="url"
                    value={sideBannerUrlInput}
                    onChange={(e) => {
                      setSideBannerUrlInput(e.target.value)
                      setSideBannerFile(null)
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm"
                    placeholder="Or Image URL"
                  />
                </div>
              </div>
            </div>

            <hr className="border-slate-200" />

            {/* Indexing Images */}
            <div>
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-lg font-semibold">Indexing Images</h3>
                <span className="text-xs text-brand-600 bg-brand-50 px-2 py-1 rounded font-medium border border-brand-100">
                  Multiple images allowed
                </span>
              </div>
              
              {currentIndexingImages.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-4">
                  {currentIndexingImages.map((imgUrl, idx) => (
                    <div key={idx} className="border border-slate-200 rounded-lg p-2 bg-slate-50 relative group w-24">
                      <img 
                        src={imgUrl.startsWith('http') ? imgUrl : `${process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace('/api', '') : 'https://ijaiqt.onrender.com'}${imgUrl}`} 
                        alt="Indexing Image" 
                        className="w-full h-auto object-contain rounded"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = [...currentIndexingImages]
                          newImages.splice(idx, 1)
                          setCurrentIndexingImages(newImages)
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Add Image URL</label>
                <div className="flex gap-2 mb-4">
                  <input
                    type="text"
                    placeholder="https://example.com/image.png"
                    id="new-indexing-url"
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm bg-slate-50"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        const val = (e.target as HTMLInputElement).value
                        if (val) {
                          setCurrentIndexingImages([...currentIndexingImages, val])
                          ;(e.target as HTMLInputElement).value = ''
                        }
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('new-indexing-url') as HTMLInputElement
                      if (input && input.value) {
                        setCurrentIndexingImages([...currentIndexingImages, input.value])
                        input.value = ''
                      }
                    }}
                    className="px-4 py-2 bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 rounded-lg text-sm font-medium transition-colors"
                  >
                    Add URL
                  </button>
                </div>
                
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => {
                    setIndexingImageFiles(e.target.files)
                  }}
                  className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-slate-100"
                />
                <p className="text-xs text-slate-500 mt-2">Selecting new files will append them to the existing ones upon save.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Homepage Content</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Welcome Title</label>
              <JoditEditor
                value={homeWelcomeTitle}
                config={joditConfig(150, 'Enter welcome title...')}
                onBlur={(newContent) => setHomeWelcomeTitle(newContent)}
              />
            </div>
            <div>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-slate-700 mb-2">Welcome Text</label>
              <JoditEditor
                value={homeWelcomeText}
                config={joditConfig(300, 'Enter welcome text...')}
                onBlur={(newContent) => setHomeWelcomeText(newContent)}
              />
            </div>
            </div>

            <hr className="border-slate-200" />

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Scope Box Title</label>
              <JoditEditor
                value={scopeTitle}
                config={joditConfig(150, 'Enter scope title...')}
                onBlur={(newContent) => setScopeTitle(newContent)}
              />
            </div>
            <div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Scope Box Text</label>
              <JoditEditor
                value={scopeText}
                config={joditConfig(250, 'Enter scope text...')}
                onBlur={(newContent) => setScopeText(newContent)}
              />
            </div>
            </div>
          </div>
        </div>

        {/* Timeline Dates Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-brand-600" />
            Timeline Dates
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Submission Deadline</label>
              <input
                type="text"
                value={submissionDeadline}
                onChange={(e) => setSubmissionDeadline(e.target.value)}
                placeholder="e.g. January 31, 2027"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Notification of Acceptance</label>
              <input
                type="text"
                value={notificationOfAcceptance}
                onChange={(e) => setNotificationOfAcceptance(e.target.value)}
                placeholder="e.g. February 28, 2027"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Final Camera-Ready Submission</label>
              <input
                type="text"
                value={finalCameraReady}
                onChange={(e) => setFinalCameraReady(e.target.value)}
                placeholder="e.g. March 15, 2027"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Online Publication</label>
              <input
                type="text"
                value={onlinePublication}
                onChange={(e) => setOnlinePublication(e.target.value)}
                placeholder="e.g. March 30, 2027"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
          </div>
        </div>

        {/* News Links Section */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900">News Links</h2>
            <button
              type="button"
              onClick={addNewsLink}
              className="flex items-center gap-1 text-sm bg-brand-100 text-brand-700 px-3 py-1.5 rounded hover:bg-brand-200"
            >
              <Plus className="w-4 h-4" /> Add Link
            </button>
          </div>
          
          <div className="space-y-4">
            {newsLinks.map((link, idx) => (
              <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-slate-50 relative">
                <button
                  type="button"
                  onClick={() => removeNewsLink(idx)}
                  className="absolute top-4 right-4 p-1.5 text-red-500 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <div className="grid md:grid-cols-2 gap-4 mb-4 pr-10">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">News Title / Label</label>
                    <input
                      type="text"
                      placeholder="e.g. Impact Factor"
                      value={link.label}
                      onChange={(e) => updateNewsLink(idx, 'label', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Date (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. 06 Jan 2015"
                      value={link.date}
                      onChange={(e) => updateNewsLink(idx, 'date', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-slate-700 mb-2">Content (HTML allowed)</label>
                  <JoditEditor
                    value={link.content}
                    config={joditConfig(200, 'Enter news content here...')}
                    onBlur={(newContent) => updateNewsLink(idx, 'content', newContent)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">External URL (Fallback if no content)</label>
                  <input
                    type="text"
                    placeholder="URL (e.g. /about or https://...)"
                    value={link.url}
                    onChange={(e) => updateNewsLink(idx, 'url', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>
            ))}
            {newsLinks.length === 0 && <p className="text-sm text-slate-500">No news links configured.</p>}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Footer</h2>


          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Footer Text</label>
            <JoditEditor
              value={footerText}
              config={joditConfig(150, 'Enter footer text...')}
              onBlur={(newContent) => setFooterText(newContent)}
            />
          </div>
        </div>

        {/* Save Button (Sticky) */}
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] flex justify-center z-50">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full max-w-sm px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {isSubmitting ? 'Saving Settings...' : 'Save All Settings'}
          </button>
        </div>

      </form>
    </div>
  )
}
