/**
 * SEO Metadata Management
 * Provides utilities for page metadata, Open Graph, Twitter Cards, and structured data
 */

import { Metadata } from 'next'

export interface SEOConfig {
  title: string
  description: string
  keywords?: string[]
  canonical?: string
  ogImage?: string
  ogType?: 'website' | 'article'
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player'
  noindex?: boolean
  nofollow?: boolean
}

/**
 * Base site configuration
 */
export const SITE_CONFIG = {
  name: 'Apex MLM',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://apexmlm.com',
  description:
    'Join Apex MLM - A leading network marketing platform with transparent compensation, powerful tools, and dedicated support for your success.',
  ogImage: '/images/og-default.jpg',
  twitterHandle: '@apexmlm',
}

/**
 * Generate Next.js Metadata object for a page
 */
export function generateMetadata(config: SEOConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    canonical,
    ogImage = SITE_CONFIG.ogImage,
    ogType = 'website',
    twitterCard = 'summary_large_image',
    noindex = false,
    nofollow = false,
  } = config

  const fullTitle = title.includes(SITE_CONFIG.name) ? title : `${title} | ${SITE_CONFIG.name}`
  const canonicalUrl = canonical || SITE_CONFIG.url
  const imageUrl = ogImage.startsWith('http') ? ogImage : `${SITE_CONFIG.url}${ogImage}`

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: keywords.length > 0 ? keywords.join(', ') : undefined,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_CONFIG.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: ogType,
    },
    twitter: {
      card: twitterCard,
      title: fullTitle,
      description,
      images: [imageUrl],
      creator: SITE_CONFIG.twitterHandle,
    },
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
      },
    },
  }

  return metadata
}

/**
 * Pre-configured metadata for common pages
 */
export const PAGE_METADATA = {
  home: generateMetadata({
    title: 'Home',
    description:
      'Build your business with Apex MLM. Join thousands of successful distributors earning through our proven compensation plan and powerful platform.',
    keywords: [
      'mlm platform',
      'network marketing',
      'direct sales',
      'business opportunity',
      'passive income',
    ],
    canonical: SITE_CONFIG.url,
  }),

  dashboard: generateMetadata({
    title: 'Dashboard',
    description: 'Your Apex MLM distributor dashboard - track commissions, manage your team, and grow your business.',
    keywords: ['distributor dashboard', 'mlm dashboard', 'network marketing tools'],
    noindex: true, // Private page
  }),

  compensation: generateMetadata({
    title: 'Compensation Plan',
    description:
      'Discover our transparent and generous compensation plan. Multiple ways to earn including retail commissions, matrix bonuses, rank achievements, and matching bonuses.',
    keywords: [
      'mlm compensation plan',
      'commission structure',
      'network marketing earnings',
      'bonus plan',
    ],
    canonical: `${SITE_CONFIG.url}/compensation`,
  }),

  joinNow: generateMetadata({
    title: 'Join Now',
    description:
      'Start your journey with Apex MLM today. Low startup cost, flexible packages, and unlimited earning potential.',
    keywords: ['join mlm', 'become distributor', 'mlm enrollment', 'business opportunity'],
    canonical: `${SITE_CONFIG.url}/join`,
  }),

  products: generateMetadata({
    title: 'Products',
    description:
      'Explore our premium product line. High-quality items your customers will love, with generous distributor discounts.',
    keywords: ['mlm products', 'direct sales products', 'wholesale products'],
    canonical: `${SITE_CONFIG.url}/products`,
  }),

  training: generateMetadata({
    title: 'Training & Resources',
    description:
      'Access comprehensive training materials, videos, and resources to help you succeed in your Apex MLM business.',
    keywords: ['mlm training', 'network marketing training', 'distributor resources'],
    canonical: `${SITE_CONFIG.url}/training`,
  }),

  about: generateMetadata({
    title: 'About Us',
    description:
      'Learn about Apex MLM - our mission, values, and commitment to helping distributors build successful businesses.',
    keywords: ['about apex mlm', 'company information', 'mlm company'],
    canonical: `${SITE_CONFIG.url}/about`,
  }),

  contact: generateMetadata({
    title: 'Contact Us',
    description:
      'Get in touch with Apex MLM. Our support team is here to help you succeed.',
    keywords: ['contact support', 'mlm support', 'customer service'],
    canonical: `${SITE_CONFIG.url}/contact`,
  }),

  privacyPolicy: generateMetadata({
    title: 'Privacy Policy',
    description: 'Apex MLM privacy policy - how we collect, use, and protect your personal information.',
    canonical: `${SITE_CONFIG.url}/privacy`,
    noindex: true,
  }),

  termsOfService: generateMetadata({
    title: 'Terms of Service',
    description: 'Apex MLM terms of service and distributor agreement.',
    canonical: `${SITE_CONFIG.url}/terms`,
    noindex: true,
  }),
}

/**
 * Generate JSON-LD structured data for Organization
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/images/logo.png`,
    description: SITE_CONFIG.description,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-555-0100',
      contactType: 'customer service',
      email: 'support@apexmlm.com',
      availableLanguage: 'en',
    },
    sameAs: [
      'https://www.facebook.com/apexmlm',
      'https://twitter.com/apexmlm',
      'https://www.linkedin.com/company/apexmlm',
      'https://www.instagram.com/apexmlm',
    ],
  }
}

/**
 * Generate JSON-LD structured data for Product
 */
export function generateProductSchema(product: {
  name: string
  description: string
  image: string
  price: number
  currency: string
  sku: string
  brand?: string
  availability?: 'InStock' | 'OutOfStock' | 'PreOrder'
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.image.startsWith('http') ? product.image : `${SITE_CONFIG.url}${product.image}`,
    sku: product.sku,
    brand: {
      '@type': 'Brand',
      name: product.brand || SITE_CONFIG.name,
    },
    offers: {
      '@type': 'Offer',
      url: SITE_CONFIG.url,
      priceCurrency: product.currency,
      price: product.price.toFixed(2),
      availability: `https://schema.org/${product.availability || 'InStock'}`,
    },
  }
}

/**
 * Generate JSON-LD structured data for FAQ Page
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

/**
 * Generate JSON-LD structured data for Breadcrumb
 */
export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url.startsWith('http') ? crumb.url : `${SITE_CONFIG.url}${crumb.url}`,
    })),
  }
}

/**
 * Generate JSON-LD structured data for Article
 */
export function generateArticleSchema(article: {
  headline: string
  description: string
  image: string
  datePublished: string
  dateModified?: string
  authorName: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.headline,
    description: article.description,
    image: article.image.startsWith('http')
      ? article.image
      : `${SITE_CONFIG.url}${article.image}`,
    datePublished: article.datePublished,
    dateModified: article.dateModified || article.datePublished,
    author: {
      '@type': 'Person',
      name: article.authorName,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/images/logo.png`,
      },
    },
  }
}

/**
 * Generate robots.txt content
 */
export function generateRobotsTxt(disallow: string[] = []): string {
  const lines = [
    'User-agent: *',
    'Allow: /',
    ...disallow.map((path) => `Disallow: ${path}`),
    '',
    `Sitemap: ${SITE_CONFIG.url}/sitemap.xml`,
  ]

  return lines.join('\n')
}

/**
 * Default paths to disallow in robots.txt
 */
export const DEFAULT_DISALLOWED_PATHS = [
  '/api/*',
  '/admin/*',
  '/dashboard/*',
  '/_next/*',
  '/private/*',
]

/**
 * Helper to generate structured data JSON string for script tag
 * Usage in component: <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: getStructuredDataJSON(data) }} />
 */
export function getStructuredDataJSON(data: Record<string, any> | Record<string, any>[]): string {
  return JSON.stringify(Array.isArray(data) ? data : [data])
}
