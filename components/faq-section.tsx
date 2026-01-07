"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Section } from './section'
import { ChevronDown } from 'lucide-react'

interface FAQItem {
  id: number
  question: string
  answer: string
}

export function FAQSection() {
  const [openId, setOpenId] = useState<number | null>(null)

  const faqs: FAQItem[] = [
    {
      id: 1,
      question: 'What services does HINX offer?',
      answer: 'We offer comprehensive digital services including brand strategy, web development, UI/UX design, digital marketing, SEO, content creation, and ongoing support. Our team handles everything from initial concept to final deployment and beyond.',
    },
    {
      id: 2,
      question: 'How long does a typical project take?',
      answer: 'Project timelines vary based on scope and complexity. A standard website typically takes 4-8 weeks, while comprehensive brand identity projects may take 8-12 weeks. We provide detailed timelines during our initial consultation and keep you updated throughout the process.',
    },
    {
      id: 3,
      question: 'What is your pricing structure?',
      answer: 'We offer flexible pricing models including fixed-price projects, hourly rates, and monthly retainers. Pricing depends on project scope, timeline, and specific requirements. Contact us for a detailed quote tailored to your needs.',
    },
    {
      id: 4,
      question: 'Do you work with startups or only established businesses?',
      answer: 'We work with businesses of all sizes, from early-stage startups to established enterprises. We understand the unique challenges at each stage and tailor our approach accordingly. We also offer special packages for startups.',
    },
    {
      id: 5,
      question: 'What makes HINX different from other agencies?',
      answer: 'Our unique blend of creative expertise and technical excellence sets us apart. We combine data-driven strategies with artistic vision, ensuring your brand not only looks great but performs exceptionally. Plus, our 98% client satisfaction rate speaks for itself.',
    },
    {
      id: 6,
      question: 'Do you provide ongoing support after project completion?',
      answer: 'Absolutely! We offer various support packages including maintenance, updates, hosting management, and ongoing optimization. We believe in building long-term partnerships with our clients.',
    },
    {
      id: 7,
      question: 'Can you redesign an existing website?',
      answer: 'Yes, we specialize in website redesigns. We analyze your current site, identify improvement opportunities, and create a modern, high-performing solution while preserving your SEO value and brand identity.',
    },
    {
      id: 8,
      question: 'What technologies do you work with?',
      answer: 'We work with modern, industry-standard technologies including React, Next.js, Node.js, TypeScript, Tailwind CSS, and various CMS platforms. We always recommend the best tech stack for your specific needs.',
    },
  ]

  const toggleFAQ = (id: number) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <Section id="faq" className="bg-gray-50 dark:bg-gray-950 min-h-[110vh] flex items-center">
      <div className="w-full reveal-stagger">
        <div className="text-center mb-12 reveal-fade" data-stagger-child>
          <h2 className="font-display text-4xl sm:text-5xl md:text-5xl mb-4">
            <span className="text-brand-blue">FAQ</span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Find answers to commonly asked questions
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white dark:bg-black rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800"
              data-stagger-child
            >
            <button
              onClick={() => toggleFAQ(faq.id)}
              className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
              aria-expanded={openId === faq.id}
              aria-controls={`faq-answer-${faq.id}`}
            >
              <span className="font-bold text-lg text-black dark:text-white pr-4">
                {faq.question}
              </span>
              <motion.div
                animate={{ rotate: openId === faq.id ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="flex-shrink-0"
              >
                <ChevronDown className="h-5 w-5 text-brand-blue" />
              </motion.div>
            </button>

              <AnimatePresence>
                {openId === faq.id && (
                  <motion.div
                    id={`faq-answer-${faq.id}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-gray-700 dark:text-gray-300 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12 reveal-fade" data-stagger-child>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Still have questions?
          </p>
          <button
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="text-brand-blue font-bold hover:underline"
          >
            Get in touch with us →
          </button>
        </div>
      </div>
    </Section>
  )
}
