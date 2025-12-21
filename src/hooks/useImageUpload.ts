'use client'

import { useState, useCallback } from 'react'
import imageCompression from 'browser-image-compression'

interface UploadResult {
  url: string
  width: number
  height: number
}

interface UseImageUploadOptions {
  maxWidthOrHeight?: number
  quality?: number
  onUploadStart?: () => void
  onUploadComplete?: (result: UploadResult) => void
  onUploadError?: (error: Error) => void
}

const DEFAULT_OPTIONS: Required<
  Omit<
    UseImageUploadOptions,
    'onUploadStart' | 'onUploadComplete' | 'onUploadError'
  >
> = {
  maxWidthOrHeight: 1500,
  quality: 0.8,
}

/**
 * Custom hook for handling image uploads with client-side compression.
 * Compresses images to WebP format before uploading.
 *
 * Usage:
 * ```tsx
 * const { uploadImage, isUploading, error } = useImageUpload({
 *   onUploadComplete: (result) => {
 *     editor.chain().focus().setImage({ src: result.url }).run()
 *   }
 * })
 * ```
 */
export function useImageUpload(options: UseImageUploadOptions = {}) {
  const [isUploading, setIsUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<Error | null>(null)

  const {
    maxWidthOrHeight = DEFAULT_OPTIONS.maxWidthOrHeight,
    quality = DEFAULT_OPTIONS.quality,
    onUploadStart,
    onUploadComplete,
    onUploadError,
  } = options

  const compressImage = useCallback(
    async (file: File): Promise<File> => {
      const compressionOptions = {
        maxWidthOrHeight,
        initialQuality: quality,
        useWebWorker: true,
        fileType: 'image/webp' as const,
      }

      try {
        const compressedFile = await imageCompression(file, compressionOptions)
        return compressedFile
      } catch (err) {
        console.warn('Image compression failed, using original:', err)
        return file
      }
    },
    [maxWidthOrHeight, quality],
  )

  const uploadImage = useCallback(
    async (file: File): Promise<UploadResult | null> => {
      setIsUploading(true)
      setProgress(0)
      setError(null)
      onUploadStart?.()

      try {
        // Step 1: Compress the image
        setProgress(20)
        const compressedFile = await compressImage(file)
        setProgress(40)

        // Step 2: Get image dimensions
        const dimensions = await getImageDimensions(compressedFile)
        setProgress(50)

        // Step 3: Upload to server
        // For now, we'll use a placeholder implementation
        // Replace this with actual MinIO upload when configured
        const formData = new FormData()
        formData.append('file', compressedFile)

        // TODO: Replace with actual upload endpoint
        // const response = await fetch('/api/upload/image', {
        //   method: 'POST',
        //   body: formData,
        // })
        //
        // if (!response.ok) {
        //   throw new Error('Upload failed')
        // }
        //
        // const data = await response.json()
        // const result = { url: data.url, ...dimensions }

        // Temporary: Convert to base64 data URL for local development
        const dataUrl = await fileToDataUrl(compressedFile)
        setProgress(100)

        const result: UploadResult = {
          url: dataUrl,
          ...dimensions,
        }

        onUploadComplete?.(result)
        setIsUploading(false)
        return result
      } catch (err) {
        const uploadError =
          err instanceof Error ? err : new Error('Upload failed')
        setError(uploadError)
        onUploadError?.(uploadError)
        setIsUploading(false)
        return null
      }
    },
    [compressImage, onUploadStart, onUploadComplete, onUploadError],
  )

  const reset = useCallback(() => {
    setIsUploading(false)
    setProgress(0)
    setError(null)
  }, [])

  return {
    uploadImage,
    isUploading,
    progress,
    error,
    reset,
  }
}

// Helper function to get image dimensions
async function getImageDimensions(
  file: File,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.width, height: img.height })
      URL.revokeObjectURL(img.src)
    }
    img.onerror = () => {
      reject(new Error('Failed to load image'))
      URL.revokeObjectURL(img.src)
    }
    img.src = URL.createObjectURL(file)
  })
}

// Helper function to convert file to data URL (for local development)
async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}

/**
 * Validates cover image dimensions.
 * Minimum 1200px width required for Google Discover optimization.
 */
export function validateCoverImage(
  file: File,
  minWidth = 1200,
): Promise<{ valid: boolean; message?: string }> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      if (img.width < minWidth) {
        resolve({
          valid: false,
          message: `Cover image must be at least ${minWidth}px wide. Current width: ${img.width}px`,
        })
      } else {
        resolve({ valid: true })
      }
      URL.revokeObjectURL(img.src)
    }
    img.onerror = () => {
      resolve({ valid: false, message: 'Failed to load image for validation' })
      URL.revokeObjectURL(img.src)
    }
    img.src = URL.createObjectURL(file)
  })
}
