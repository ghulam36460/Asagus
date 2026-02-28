export function StructuredData() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ASAGUS",
    "url": "https://asagus.com",
    "logo": "https://asagus.com/icon-512.png",
    "description": "ASAGUS is a leading software development company specializing in AI solutions, custom web applications, mobile apps, and intelligent systems.",
    "foundingDate": "2024",
    "sameAs": [
      "https://twitter.com/asagus",
      "https://linkedin.com/company/asagus"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "Customer Service",
      "email": "contact@asagus.com"
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ASAGUS",
    "url": "https://asagus.com",
    "description": "Build smart, scalable, and impactful digital solutions with ASAGUS. We specialize in AI-based systems, modern websites, custom software, and intelligent AI tools.",
    "publisher": {
      "@type": "Organization",
      "name": "ASAGUS"
    }
  };

  const professionalServiceSchema = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "name": "ASAGUS",
    "image": "https://asagus.com/opengraph-image",
    "url": "https://asagus.com",
    "telephone": "",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    },
    "priceRange": "$$",
    "description": "Professional software development services including AI development, web applications, mobile apps, and custom software solutions.",
    "areaServed": "Worldwide",
    "serviceType": [
      "Web Development",
      "Mobile App Development",
      "AI Development",
      "Machine Learning",
      "API Development",
      "Backend Engineering",
      "Custom Software Development"
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }}
      />
    </>
  );
}
