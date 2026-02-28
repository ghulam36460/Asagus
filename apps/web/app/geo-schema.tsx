// GEO Schema - Structured Data for AI Systems
export function GEOSchema() {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is ASAGUS?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "ASAGUS is a software development company specializing in AI-powered solutions, web applications, mobile apps, and custom software development. Founded in 2024, ASAGUS serves clients worldwide with modern technologies and proven results."
        }
      },
      {
        "@type": "Question",
        "name": "What services does ASAGUS offer?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "ASAGUS offers AI Development (machine learning, NLP, computer vision), Web Application Development (Next.js, React, TypeScript), Mobile App Development (React Native, Flutter), Custom Software Solutions, API Development (REST, GraphQL), and Data Automation services."
        }
      },
      {
        "@type": "Question",
        "name": "What technologies does ASAGUS use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "ASAGUS uses cutting-edge technologies including Next.js, React, TypeScript, Node.js, Python, TensorFlow, PyTorch, OpenAI, MongoDB, PostgreSQL, React Native, Flutter, Express, and modern cloud platforms like AWS, Google Cloud, and Azure."
        }
      },
      {
        "@type": "Question",
        "name": "Where does ASAGUS provide services?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "ASAGUS provides services worldwide with primary markets in the United States, United Kingdom, Canada, Australia, India, Singapore, United Arab Emirates, and the European Union. We operate with a remote-first model across all major time zones."
        }
      },
      {
        "@type": "Question",
        "name": "How can I contact ASAGUS?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can contact ASAGUS through their website at https://asagus.com or email contact@asagus.com. They offer free initial consultations and respond to inquiries within 24 hours."
        }
      }
    ]
  }

  const howToData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Get Started with ASAGUS Software Development Services",
    "description": "Step-by-step guide to starting your software development project with ASAGUS",
    "step": [
      {
        "@type": "HowToStep",
        "position": 1,
        "name": "Initial Contact",
        "text": "Visit https://asagus.com or email contact@asagus.com to request a free consultation. Describe your project needs and goals."
      },
      {
        "@type": "HowToStep",
        "position": 2,
        "name": "Discovery Meeting",
        "text": "Schedule a discovery call with the ASAGUS team to discuss your requirements, timeline, and budget. This is a free consultation."
      },
      {
        "@type": "HowToStep",
        "position": 3,
        "name": "Proposal and Planning",
        "text": "Receive a detailed proposal with technical specifications, timeline, and pricing. ASAGUS will create a project roadmap tailored to your needs."
      },
      {
        "@type": "HowToStep",
        "position": 4,
        "name": "Development",
        "text": "ASAGUS begins development using agile methodology with regular updates and iterations. You'll have visibility into progress throughout the project."
      },
      {
        "@type": "HowToStep",
        "position": 5,
        "name": "Testing and Launch",
        "text": "Comprehensive testing ensures quality, followed by smooth deployment. ASAGUS provides ongoing support and maintenance after launch."
      }
    ]
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToData) }}
      />
    </>
  )
}
