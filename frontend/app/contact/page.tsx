'use client'

import { useState } from 'react'
import { contactAPI } from '@/lib/api'

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'success' | 'error', msg: string }>({ type: 'idle', msg: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus({ type: 'loading', msg: 'Submitting your message...' })
    
    try {
      await contactAPI.submit(formData)
      setStatus({ type: 'success', msg: 'Your message has been sent successfully. We will get back to you soon.' })
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      setStatus({ type: 'error', msg: 'Failed to send message. Please try again later.' })
    }
  }

  return (
    <main className="w-full max-w-[1024px] border-x border-b border-gray-300 min-h-[500px] p-6 bg-white flex justify-center">
      <div className="w-full max-w-2xl">
        <div className="mb-6 border-b border-dashed border-gray-300 pb-2">
          <h2 className="text-2xl font-bold text-[#800000] italic">Contact Us</h2>
        </div>

        <p className="mb-6 text-sm leading-relaxed text-gray-800">
          If you have any questions regarding the submission process, editorial guidelines, or general inquiries, please fill out the form below or email us directly at <strong className="text-[#800000]">editor@ijcr.com</strong>.
        </p>

        {status.type === 'success' && (
          <div className="bg-green-50 border border-green-200 text-green-800 p-4 mb-6 font-semibold text-sm">
            {status.msg}
          </div>
        )}

        {status.type === 'error' && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 mb-6 font-semibold text-sm">
            {status.msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="border border-gray-300 bg-gray-50 p-6">
          <div className="mb-4">
            <label className="block text-sm font-bold text-[#800000] mb-2">Name</label>
            <input 
              type="text" 
              required
              className="w-full border border-gray-300 p-2 text-sm focus:outline-none focus:border-[#800000]"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold text-[#800000] mb-2">Email</label>
            <input 
              type="email" 
              required
              className="w-full border border-gray-300 p-2 text-sm focus:outline-none focus:border-[#800000]"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-bold text-[#800000] mb-2">Subject</label>
            <input 
              type="text" 
              required
              className="w-full border border-gray-300 p-2 text-sm focus:outline-none focus:border-[#800000]"
              value={formData.subject}
              onChange={e => setFormData({...formData, subject: e.target.value})}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-[#800000] mb-2">Message</label>
            <textarea 
              required
              rows={5}
              className="w-full border border-gray-300 p-2 text-sm focus:outline-none focus:border-[#800000]"
              value={formData.message}
              onChange={e => setFormData({...formData, message: e.target.value})}
            />
          </div>

          <button 
            type="submit" 
            disabled={status.type === 'loading'}
            className="bg-[#800000] text-white font-bold py-2 px-6 hover:bg-[#a00000] transition-colors disabled:opacity-50"
          >
            {status.type === 'loading' ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </main>
  )
}
