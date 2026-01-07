import Link from 'next/link'
import { ArrowLeft, Shield, Lock, Eye, FileText, Users, Server, Bell, Mail } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for HINX - Learn how we collect, use, and protect your data.',
}

export default function PrivacyPolicy() {
  const sections = [
    {
      icon: FileText,
      title: 'Introduction',
      content: 'HINX ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.'
    },
    {
      icon: Eye,
      title: 'Information We Collect',
      content: 'We collect information that you provide directly to us, including:',
      list: [
        'Name and contact information (email address, phone number)',
        'Messages and communications you send to us',
        'Newsletter subscription preferences',
        'Any other information you choose to provide'
      ]
    },
    {
      icon: Users,
      title: 'How We Use Your Information',
      content: 'We use the information we collect to:',
      list: [
        'Respond to your inquiries and provide customer service',
        'Send you newsletters and marketing communications (with your consent)',
        'Improve our website and services',
        'Analyze usage patterns and trends',
        'Comply with legal obligations'
      ]
    },
    {
      icon: Server,
      title: 'Cookies and Tracking',
      content: 'We use cookies and similar tracking technologies to track activity on our website and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.'
    },
    {
      icon: Lock,
      title: 'Data Security',
      content: 'We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure.'
    },
    {
      icon: Shield,
      title: 'Your Rights',
      content: 'You have the right to:',
      list: [
        'Access the personal information we hold about you',
        'Request correction of inaccurate information',
        'Request deletion of your information',
        'Opt-out of marketing communications',
        'Withdraw consent at any time'
      ]
    },
    {
      icon: Users,
      title: 'Third-Party Services',
      content: 'We may use third-party service providers to help us operate our website and deliver our services. These providers have access to your information only to perform specific tasks on our behalf and are obligated to protect it.'
    },
    {
      icon: Bell,
      title: 'Changes to This Policy',
      content: 'We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.'
    },
    {
      icon: Mail,
      title: 'Contact Us',
      content: 'If you have any questions about this Privacy Policy, please contact us through our contact form or at the email address provided on our website.'
    }
  ]

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-black dark:via-gray-950 dark:to-black">
      {/* Subtle Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-40 right-20 w-96 h-96 bg-brand-blue/20 rounded-full blur-[150px]"></div>
        <div className="absolute bottom-40 left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[150px]"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-36 lg:pt-40 pb-12 sm:pb-16 lg:pb-20">
        {/* Header */}
        <div className="mb-12 sm:mb-16">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-brand-blue dark:hover:text-brand-blue transition-colors mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Home
          </Link>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-gray-900 dark:text-white mb-4">
            Privacy <span className="bg-gradient-to-r from-brand-blue to-purple-600 bg-clip-text text-transparent">Policy</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid gap-6 sm:gap-8">
          {sections.map((section, index) => {
            const Icon = section.icon
            return (
              <div
                key={index}
                className="group relative bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-200/50 dark:border-gray-800/50 hover:border-brand-blue/30 dark:hover:border-brand-blue/30 transition-all duration-300"
              >
                <div className="flex items-start gap-4 sm:gap-6">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-brand-blue/10 to-purple-600/10 dark:from-brand-blue/20 dark:to-purple-600/20 flex items-center justify-center border border-brand-blue/20 dark:border-brand-blue/30">
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-brand-blue" strokeWidth={1.5} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h2 className="font-display text-xl sm:text-2xl text-gray-900 dark:text-white mb-3">
                      {section.title}
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                      {section.content}
                    </p>
                    
                    {section.list && (
                      <ul className="space-y-2.5">
                        {section.list.map((item, i) => (
                          <li key={i} className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                            <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-brand-blue mt-2"></span>
                            <span className="leading-relaxed">{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* CTA Card */}
        <div className="mt-12 sm:mt-16 relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-blue via-blue-600 to-purple-600 p-8 sm:p-12 text-center">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
          <div className="relative">
            <h3 className="font-display text-2xl sm:text-3xl text-white mb-3">
              Have Questions?
            </h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              We're here to help. Contact us for any privacy-related inquiries.
            </p>
            <Link 
              href="/#contact" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand-blue rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
