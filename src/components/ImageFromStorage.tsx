'use client'

import { useQuery } from '@tanstack/react-query'
import { getFileAsBase64Fn } from '@/functions/storage'

interface ImageFromStorageProps {
  objectKey: string | null | undefined
  alt: string
  className?: string
  loading?: 'lazy' | 'eager'
  fallback?: React.ReactNode
}

/**
 * Component to display an image from RustFS/MinIO storage
 * Fetches images as base64 data URLs to hide storage endpoint from frontend
 * Handles both object keys and legacy full URLs
 */
export function ImageFromStorage({
  objectKey,
  alt,
  className = '',
  loading,
  fallback,
}: ImageFromStorageProps) {
  // Check if it's already a full URL (legacy data) or data URL
  const isDirectUrl =
    objectKey?.startsWith('http://') ||
    objectKey?.startsWith('https://') ||
    objectKey?.startsWith('data:')

  const { data, isLoading } = useQuery({
    queryKey: ['storage-image-base64', objectKey],
    queryFn: async () => {
      if (!objectKey || isDirectUrl) return null
      const result = await getFileAsBase64Fn({ data: { key: objectKey } })
      if ('error' in result) {
        console.error('[ImageFromStorage] Error:', result.error)
        return null
      }
      return result.dataUrl
    },
    enabled: !!objectKey && !isDirectUrl,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  })

  // Use direct URL if it's legacy data, otherwise use the base64 data URL
  const imageUrl = isDirectUrl ? objectKey : data

  if (!objectKey) {
    return fallback ? <>{fallback}</> : null
  }

  if (isLoading && !isDirectUrl) {
    return <div className={`bg-muted animate-pulse ${className}`} />
  }

  if (!imageUrl) {
    return fallback ? <>{fallback}</> : null
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      loading={loading}
      className={className}
    />
  )
}
