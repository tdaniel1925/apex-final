/**
 * Image Optimization Utilities
 * Helpers for lazy loading, blur placeholders, and responsive images
 */

/**
 * Generate blur data URL for image placeholder
 */
export function getBlurDataURL(width: number = 10, height: number = 10): string {
  // Create a simple gray blur placeholder
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">
      <filter id="blur">
        <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
      </filter>
      <rect width="100%" height="100%" fill="#e5e7eb" filter="url(#blur)" />
    </svg>
  `

  const base64 = Buffer.from(svg).toString('base64')
  return `data:image/svg+xml;base64,${base64}`
}

/**
 * Generate responsive image sizes configuration
 */
export function getResponsiveSizes(type: 'avatar' | 'card' | 'hero' | 'thumbnail'): string {
  const sizeMap = {
    avatar: '(max-width: 640px) 80px, (max-width: 1024px) 120px, 150px',
    card: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    hero: '100vw',
    thumbnail: '(max-width: 640px) 150px, (max-width: 1024px) 200px, 250px',
  }

  return sizeMap[type]
}

/**
 * Image loader configuration for external images
 */
export interface ImageLoaderConfig {
  src: string
  width: number
  quality?: number
}

export function imageLoader({ src, width, quality = 75 }: ImageLoaderConfig): string {
  // If it's an external URL, return as-is
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src
  }

  // For local images, use Next.js image optimization
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`
}

/**
 * Preload critical images
 */
export function preloadImage(src: string, as: 'image' = 'image'): void {
  if (typeof window === 'undefined') return

  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = as
  link.href = src
  document.head.appendChild(link)
}

/**
 * Lazy load images with Intersection Observer
 */
export class LazyImageLoader {
  private observer: IntersectionObserver | null = null

  constructor(options?: IntersectionObserverInit) {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      return
    }

    this.observer = new IntersectionObserver(this.handleIntersection.bind(this), {
      rootMargin: '50px 0px',
      threshold: 0.01,
      ...options,
    })
  }

  observe(element: HTMLImageElement): void {
    if (!this.observer) return
    this.observer.observe(element)
  }

  unobserve(element: HTMLImageElement): void {
    if (!this.observer) return
    this.observer.unobserve(element)
  }

  disconnect(): void {
    if (!this.observer) return
    this.observer.disconnect()
  }

  private handleIntersection(entries: IntersectionObserverEntry[]): void {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLImageElement
        const src = img.dataset.src

        if (src) {
          img.src = src
          img.removeAttribute('data-src')
        }

        if (this.observer) {
          this.observer.unobserve(img)
        }
      }
    }
  }
}

/**
 * Image dimensions for common use cases
 */
export const ImageDimensions = {
  avatar: {
    small: { width: 40, height: 40 },
    medium: { width: 80, height: 80 },
    large: { width: 150, height: 150 },
  },
  product: {
    thumbnail: { width: 200, height: 200 },
    card: { width: 400, height: 400 },
    detail: { width: 800, height: 800 },
  },
  hero: {
    mobile: { width: 768, height: 432 },
    tablet: { width: 1024, height: 576 },
    desktop: { width: 1920, height: 1080 },
  },
  og: {
    width: 1200,
    height: 630,
  },
}

/**
 * Optimize image URL with Cloudinary-style transformations
 * (Placeholder - replace with actual CDN implementation)
 */
export function optimizeImageUrl(
  url: string,
  options: {
    width?: number
    height?: number
    quality?: number
    format?: 'webp' | 'avif' | 'jpg' | 'png'
    fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside'
  } = {}
): string {
  const { width: _width, height: _height, quality: _quality = 80, format: _format = 'webp', fit: _fit = 'cover' } = options

  // If it's a local image, return as-is (Next.js will handle optimization)
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return url
  }

  // For external images, you would integrate with your CDN here
  // Example for Cloudinary:
  // return `https://res.cloudinary.com/your-cloud/image/upload/w_${width},h_${height},q_${quality},f_${format},c_${fit}/${url}`

  // Fallback: return original URL
  return url
}

/**
 * Check if image format is supported
 */
export function isImageFormatSupported(format: 'webp' | 'avif'): boolean {
  if (typeof window === 'undefined') return false

  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1

  const mimeTypes = {
    webp: 'image/webp',
    avif: 'image/avif',
  }

  return canvas.toDataURL(mimeTypes[format]).indexOf(`data:${mimeTypes[format]}`) === 0
}

/**
 * Calculate aspect ratio
 */
export function calculateAspectRatio(width: number, height: number): string {
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
  const divisor = gcd(width, height)
  return `${width / divisor}/${height / divisor}`
}
