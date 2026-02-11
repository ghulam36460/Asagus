import Link from 'next/link'
import { Button } from '@/components/button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of Service for ASAGUS - Read our terms and conditions for using our services.',
}

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-white dark:bg-black py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/">
          <Button variant="outline" className="mb-8">← Back to Home</Button>
        </Link>

        <h1 className="font-display text-4xl sm:text-5xl text-black dark:text-white mb-4">
          Terms of Service
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Last updated: {new Date().toLocaleDateString()}
        </p>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <section className="mb-8">
            <h2 className="font-display text-2xl text-black dark:text-white mb-4">Agreement to Terms</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              By accessing and using ASAGUS's website and services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using our services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl text-black dark:text-white mb-4">Services Description</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              ASAGUS provides web development, AI, cybersecurity, and related digital services. The specific scope of work will be defined in individual project agreements or contracts.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl text-black dark:text-white mb-4">Intellectual Property</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              All content, designs, code, and materials created by ASAGUS remain our intellectual property until full payment is received. Upon full payment:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Clients receive ownership of final deliverables as specified in the project agreement</li>
              <li>We retain the right to showcase the work in our portfolio</li>
              <li>Source code and underlying frameworks remain our property unless otherwise agreed</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl text-black dark:text-white mb-4">Payment Terms</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Payment terms will be specified in individual project agreements. Generally:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>A deposit is required before work begins</li>
              <li>Milestone payments may be required for larger projects</li>
              <li>Final payment is due upon project completion</li>
              <li>Late payments may incur additional fees</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl text-black dark:text-white mb-4">Client Responsibilities</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Clients are responsible for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 dark:text-gray-300 space-y-2">
              <li>Providing necessary content, materials, and information in a timely manner</li>
              <li>Responding to requests for feedback and approvals</li>
              <li>Ensuring all provided content is legally owned or licensed</li>
              <li>Making timely payments as agreed</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl text-black dark:text-white mb-4">Revisions and Changes</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Each project includes a specified number of revision rounds. Additional revisions beyond the agreed scope may incur additional charges. Significant changes to project scope will require a new agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl text-black dark:text-white mb-4">Project Timeline</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We strive to meet all agreed-upon deadlines. However, timelines may be affected by factors including client delays, scope changes, or unforeseen circumstances. We will communicate any timeline adjustments promptly.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl text-black dark:text-white mb-4">Confidentiality</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We respect the confidentiality of client information and will not disclose proprietary information to third parties without consent, except as required by law.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl text-black dark:text-white mb-4">Limitation of Liability</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              ASAGUS shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our services. Our total liability shall not exceed the amount paid for the specific service in question.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl text-black dark:text-white mb-4">Termination</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              Either party may terminate a project agreement with written notice. Upon termination, the client is responsible for payment for work completed up to the termination date.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl text-black dark:text-white mb-4">Governing Law</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              These Terms of Service are governed by and construed in accordance with applicable laws. Any disputes shall be resolved through arbitration or in the courts of our jurisdiction.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl text-black dark:text-white mb-4">Changes to Terms</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on our website. Continued use of our services constitutes acceptance of modified terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl text-black dark:text-white mb-4">Contact Information</h2>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              For questions about these Terms of Service, please contact us through our website contact form or at the email address provided on our website.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}
