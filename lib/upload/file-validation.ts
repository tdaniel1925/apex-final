/**
 * File upload validation and security
 * Prevents malicious file uploads and enforces size/type limits
 */

export interface FileValidationOptions {
  maxSizeBytes?: number
  allowedMimeTypes?: string[]
  allowedExtensions?: string[]
  requireImageDimensions?: boolean
  maxWidth?: number
  maxHeight?: number
  minWidth?: number
  minHeight?: number
}

export interface FileValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  file?: {
    size: number
    type: string
    extension: string
    dimensions?: { width: number; height: number }
  }
}

/**
 * Default allowed image types for profile photos and documents
 */
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]

export const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
]

/**
 * Default file size limits (in bytes)
 */
export const FILE_SIZE_LIMITS = {
  profilePhoto: 5 * 1024 * 1024, // 5MB
  document: 10 * 1024 * 1024, // 10MB
  taxForm: 10 * 1024 * 1024, // 10MB
}

/**
 * Extract file extension from filename
 */
function getFileExtension(filename: string): string {
  const parts = filename.split('.')
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : ''
}

/**
 * Validate file against security and size requirements
 */
export async function validateFile(
  file: File,
  options: FileValidationOptions = {}
): Promise<FileValidationResult> {
  const errors: string[] = []
  const warnings: string[] = []

  // Default options
  const maxSize = options.maxSizeBytes || FILE_SIZE_LIMITS.profilePhoto
  const allowedMimeTypes = options.allowedMimeTypes || ALLOWED_IMAGE_TYPES
  const allowedExtensions = options.allowedExtensions || ['jpg', 'jpeg', 'png', 'webp']

  // Get file info
  const fileSize = file.size
  const fileMimeType = file.type
  const fileExtension = getFileExtension(file.name)

  // Validate file name
  if (!file.name || file.name.trim() === '') {
    errors.push('File name is required')
  }

  // Check for suspicious file names
  const suspiciousPatterns = [
    /\.exe$/i,
    /\.bat$/i,
    /\.cmd$/i,
    /\.sh$/i,
    /\.php$/i,
    /\.js$/i,
    /\.html$/i,
    /\.htm$/i,
  ]

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(file.name)) {
      errors.push('File type is not allowed for security reasons')
      break
    }
  }

  // Validate file size
  if (fileSize === 0) {
    errors.push('File is empty')
  } else if (fileSize > maxSize) {
    errors.push(
      `File size (${formatFileSize(fileSize)}) exceeds maximum allowed size (${formatFileSize(maxSize)})`
    )
  }

  // Warn for large files
  if (fileSize > maxSize * 0.8) {
    warnings.push(`File is quite large (${formatFileSize(fileSize)})`)
  }

  // Validate MIME type
  if (!allowedMimeTypes.includes(fileMimeType)) {
    errors.push(
      `File type "${fileMimeType}" is not allowed. Allowed types: ${allowedMimeTypes.join(', ')}`
    )
  }

  // Validate file extension
  if (!allowedExtensions.includes(fileExtension)) {
    errors.push(
      `File extension ".${fileExtension}" is not allowed. Allowed extensions: ${allowedExtensions.join(', ')}`
    )
  }

  // Check for MIME type / extension mismatch (basic security check)
  const mimeExtensionMap: Record<string, string[]> = {
    'image/jpeg': ['jpg', 'jpeg'],
    'image/png': ['png'],
    'image/webp': ['webp'],
    'application/pdf': ['pdf'],
  }

  const expectedExtensions = mimeExtensionMap[fileMimeType]
  if (expectedExtensions && !expectedExtensions.includes(fileExtension)) {
    errors.push(
      `File extension ".${fileExtension}" doesn't match MIME type "${fileMimeType}". This may indicate a malicious file.`
    )
  }

  // Validate image dimensions if required
  let dimensions: { width: number; height: number } | undefined

  if (
    options.requireImageDimensions &&
    fileMimeType.startsWith('image/') &&
    fileMimeType !== 'application/pdf'
  ) {
    try {
      dimensions = await getImageDimensions(file)

      if (options.maxWidth && dimensions.width > options.maxWidth) {
        errors.push(
          `Image width (${dimensions.width}px) exceeds maximum allowed width (${options.maxWidth}px)`
        )
      }

      if (options.maxHeight && dimensions.height > options.maxHeight) {
        errors.push(
          `Image height (${dimensions.height}px) exceeds maximum allowed height (${options.maxHeight}px)`
        )
      }

      if (options.minWidth && dimensions.width < options.minWidth) {
        errors.push(
          `Image width (${dimensions.width}px) is below minimum required width (${options.minWidth}px)`
        )
      }

      if (options.minHeight && dimensions.height < options.minHeight) {
        errors.push(
          `Image height (${dimensions.height}px) is below minimum required height (${options.minHeight}px)`
        )
      }

      // Warn for very large images
      if (dimensions.width > 4000 || dimensions.height > 4000) {
        warnings.push(
          `Image dimensions (${dimensions.width}x${dimensions.height}) are very large and may impact performance`
        )
      }
    } catch (error) {
      errors.push('Failed to read image dimensions. The file may be corrupted.')
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    file: {
      size: fileSize,
      type: fileMimeType,
      extension: fileExtension,
      dimensions,
    },
  }
}

/**
 * Get image dimensions from file
 */
async function getImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)

    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve({
        width: img.width,
        height: img.height,
      })
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load image'))
    }

    img.src = url
  })
}

/**
 * Format file size for display
 */
function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

/**
 * Validate profile photo upload
 */
export async function validateProfilePhoto(file: File): Promise<FileValidationResult> {
  return validateFile(file, {
    maxSizeBytes: FILE_SIZE_LIMITS.profilePhoto,
    allowedMimeTypes: ALLOWED_IMAGE_TYPES,
    allowedExtensions: ['jpg', 'jpeg', 'png', 'webp'],
    requireImageDimensions: true,
    minWidth: 200,
    minHeight: 200,
    maxWidth: 4000,
    maxHeight: 4000,
  })
}

/**
 * Validate tax form document upload (W-9, W-8BEN, etc.)
 */
export async function validateTaxFormDocument(
  file: File
): Promise<FileValidationResult> {
  return validateFile(file, {
    maxSizeBytes: FILE_SIZE_LIMITS.taxForm,
    allowedMimeTypes: ALLOWED_DOCUMENT_TYPES,
    allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png'],
  })
}

/**
 * Validate general document upload
 */
export async function validateDocument(file: File): Promise<FileValidationResult> {
  return validateFile(file, {
    maxSizeBytes: FILE_SIZE_LIMITS.document,
    allowedMimeTypes: ALLOWED_DOCUMENT_TYPES,
    allowedExtensions: ['pdf', 'jpg', 'jpeg', 'png'],
  })
}

/**
 * Scan file content for malicious patterns (basic check)
 * Note: This is a basic client-side check. Server-side virus scanning is recommended.
 */
export async function scanFileContent(file: File): Promise<{
  isSafe: boolean
  threats: string[]
}> {
  const threats: string[] = []

  try {
    // Read first 1KB of file as text to check for suspicious patterns
    const chunk = file.slice(0, 1024)
    const text = await chunk.text()

    // Check for common malicious patterns
    const maliciousPatterns = [
      /<script/i,
      /javascript:/i,
      /onerror=/i,
      /onload=/i,
      /<iframe/i,
      /eval\(/i,
      /exec\(/i,
    ]

    for (const pattern of maliciousPatterns) {
      if (pattern.test(text)) {
        threats.push(`Suspicious content pattern detected: ${pattern.source}`)
      }
    }

    // Check for PHP code in images (common exploit)
    if (file.type.startsWith('image/')) {
      if (text.includes('<?php') || text.includes('<?=')) {
        threats.push('PHP code detected in image file')
      }
    }
  } catch (error) {
    // If we can't read the file, let it pass but warn
    console.warn('Could not scan file content:', error)
  }

  return {
    isSafe: threats.length === 0,
    threats,
  }
}

/**
 * Comprehensive file validation with security scanning
 */
export async function validateAndScanFile(
  file: File,
  options: FileValidationOptions = {}
): Promise<FileValidationResult & { threats: string[] }> {
  const validation = await validateFile(file, options)
  const scan = await scanFileContent(file)

  return {
    ...validation,
    isValid: validation.isValid && scan.isSafe,
    errors: [...validation.errors, ...scan.threats],
    threats: scan.threats,
  }
}
