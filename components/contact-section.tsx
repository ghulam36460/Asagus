"use client"

import { useState } from 'react'
import { Mail } from 'lucide-react'
import { Section } from './section'
import { Button } from './button'
import { Toast } from './toast'
import { Spinner } from './spinner'
import { validateForm, contactFormRules, type ValidationError } from '@/lib/validation'

export function ContactSection() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [toastMessage, setToastMessage] = useState('')
  const [showToast, setShowToast] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form
    const validationErrors = validateForm(formData, contactFormRules)
    if (validationErrors.length > 0) {
      const errorMap: Record<string, string> = {}
      validationErrors.forEach((error) => {
        errorMap[error.field] = error.message
      })
      setErrors(errorMap)
      setToastMessage('Please fix the errors in the form')
      setStatus('error')
      setShowToast(true)
      setTimeout(() => setStatus('idle'), 2000)
      return
    }

    setErrors({})
    setStatus('loading')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      setStatus('success')
      setToastMessage('Message sent successfully! We\'ll get back to you soon.')
      setShowToast(true)
      setFormData({ fullName: '', email: '', phone: '', service: '', message: '' })
      
      setTimeout(() => setStatus('idle'), 2000)
    } catch (error) {
      setStatus('error')
      setToastMessage(error instanceof Error ? error.message : 'Something went wrong. Please try again.')
      setShowToast(true)
      
      setTimeout(() => setStatus('idle'), 2000)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const formFields = [
    { label: 'Name', name: 'fullName', type: 'text', placeholder: 'Your full name' },
    { label: 'Email', name: 'email', type: 'email', placeholder: 'you@company.com' },
    { label: 'Number', name: 'phone', type: 'tel', placeholder: 'Include country code' },
    { label: 'Service', name: 'service', type: 'text', placeholder: 'Website, app, branding...' },
  ] as const

  const messageBorderClass = errors.message
    ? 'border-red-500'
    : formData.message
      ? 'border-transparent'
      : 'border-white/25'

  return (
    <>
      {showToast && (
        <Toast
          message={toastMessage}
          type={status === 'success' ? 'success' : 'error'}
          onClose={() => setShowToast(false)}
        />
      )}
      <Section
        id="contact"
        className="relative bg-black text-white py-32 lg:py-40 min-h-[100vh] flex items-center justify-center"
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent_60%)]" />
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("/noise.png")', mixBlendMode: 'screen' }} />
        </div>

        <div className="relative w-full max-w-3xl mx-auto px-4 text-center space-y-16 reveal-stagger">
          <div className="space-y-6" data-stagger-child>
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 border border-white/20 mx-auto">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse"></div>
              <span className="text-[11px] font-bold uppercase tracking-[0.5em] text-white/70">Contact Us</span>
            </div>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl leading-tight">
              <span className="block text-white mb-3">LET'S CREATE</span>
              <span className="block bg-gradient-to-r from-brand-blue via-blue-500 to-purple-500 bg-clip-text text-transparent">SOMETHING</span>
            </h2>
            <p className="text-base sm:text-lg text-white/60 max-w-2xl mx-auto">
              Tell us what you need—product build, website, or brand experience—and we'll get back within one business day.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10" data-stagger-child>
            <div className="grid gap-8">
              {formFields.map((field) => {
                const fieldName = field.name as keyof typeof formData
                const hasError = errors[field.name]
                const hasValue = Boolean(formData[fieldName])
                const borderClass = hasError
                  ? 'border-red-500'
                  : hasValue
                    ? 'border-transparent'
                    : 'border-white/25'

                return (
                  <div key={field.name} className="text-left space-y-2">
                    <label className="text-sm uppercase tracking-[0.4em] text-white/60">{field.label}</label>
                    <input
                      type={field.type}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={formData[fieldName]}
                      onChange={handleChange}
                      className={`w-full bg-transparent border-b ${borderClass} focus:border-brand-blue transition-colors py-3 text-lg placeholder-white/30`}
                    />
                    {hasError && (
                      <p className="text-red-400 text-sm">{hasError}</p>
                    )}
                  </div>
                )
              })}

              <div className="text-left space-y-2">
                <label className="text-sm uppercase tracking-[0.4em] text-white/60">Message</label>
                <textarea
                  name="message"
                  placeholder="Project goals, timelines, and desired outcomes..."
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className={`w-full bg-transparent border-b ${messageBorderClass} focus:border-brand-blue transition-colors py-3 text-lg placeholder-white/30 resize-none`}
                />
                {errors.message && (
                  <p className="text-red-400 text-sm">{errors.message}</p>
                )}
              </div>
            </div>

            <div className="flex flex-col items-center gap-4 pt-4">
              <button
                type="submit"
                disabled={status === 'loading'}
                className="inline-flex items-center justify-center gap-3 px-12 py-5 text-base font-semibold text-white bg-gradient-to-r from-blue-500 via-blue-600 to-purple-500 rounded-full transition-all duration-300 hover:shadow-[0_8px_30px_rgba(99,102,241,0.5)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px] min-h-[56px]"
              >
                {status === 'loading' ? (
                  <>
                    <Spinner size="sm" />
                    <span>Sending</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
              <p className="text-sm uppercase tracking-[0.4em] text-white/40">Response within 24 hours</p>
            </div>
          </form>
        </div>
      </Section>
    </>
  )
}
