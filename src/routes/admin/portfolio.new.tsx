'use client'

import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useState, useRef } from 'react'
import { ArrowLeft, Save, Loader2, Upload, X } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/Button'
import {
  createPortfolioFn,
  uploadPortfolioImageFn,
} from '@/functions/portfolio'
import imageCompression from 'browser-image-compression'

export const Route = createFileRoute('/admin/portfolio/new')({
  component: NewPortfolioPage,
})

function NewPortfolioPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [year, setYear] = useState(new Date().getFullYear().toString())
  const [sector, setSector] = useState('')
  const [description, setDescription] = useState('')
  const [client, setClient] = useState('')
  const [problem, setProblem] = useState('')
  const [solution, setSolution] = useState('')
  const [outcome, setOutcome] = useState('')
  const [techStackInput, setTechStackInput] = useState('')
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [displayOrder, setDisplayOrder] = useState(0)
  const [imageKey, setImageKey] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(value))
    }
  }

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    setIsUploadingImage(true)
    setError(null)

    try {
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      })

      const previewUrl = URL.createObjectURL(compressedFile)
      setImagePreview(previewUrl)

      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          const result = reader.result as string
          const base64Data = result.split(',')[1]
          resolve(base64Data)
        }
        reader.onerror = reject
        reader.readAsDataURL(compressedFile)
      })

      const result = await uploadPortfolioImageFn({
        data: {
          base64Data: base64,
          filename: file.name,
          contentType: compressedFile.type,
        },
      })

      if ('error' in result) {
        setError(result.error)
        setImagePreview(null)
      } else {
        setImageKey(result.key)
      }
    } catch (err: any) {
      setError(err.message || 'Failed to upload image')
      setImagePreview(null)
    } finally {
      setIsUploadingImage(false)
    }
  }

  const handleRemoveImage = () => {
    setImageKey(null)
    setImagePreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const techStack = techStackInput
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean)

      const result = await createPortfolioFn({
        data: {
          slug,
          title,
          year,
          sector,
          description,
          client: client || undefined,
          problem: problem || undefined,
          solution: solution || undefined,
          outcome: outcome || undefined,
          techStack: JSON.stringify(techStack),
          image: imageKey || undefined,
          status,
          displayOrder,
        },
      })

      if ('error' in result) {
        setError(result.error)
      } else {
        await queryClient.invalidateQueries({ queryKey: ['admin-portfolio'] })
        router.navigate({ to: '/admin/portfolio' })
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create project')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Link
        to="/admin/portfolio"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Portfolio
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">New Project</h1>
        <p className="text-muted-foreground">
          Add a new case study to your portfolio
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <h2 className="text-lg font-semibold text-foreground">
            Basic Information
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Project Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Slug *
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Year *
              </label>
              <input
                type="text"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Sector *
              </label>
              <input
                type="text"
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                placeholder="e.g., Fintech, Medical, E-Commerce"
                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Display Order
              </label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Short Description *
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-brand-primary/50 resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Client Name
            </label>
            <input
              type="text"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
            />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <h2 className="text-lg font-semibold text-foreground">
            Case Study Details
          </h2>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              The Problem
            </label>
            <textarea
              value={problem}
              onChange={(e) => setProblem(e.target.value)}
              rows={3}
              placeholder="What challenges did the client face?"
              className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-brand-primary/50 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              The Solution
            </label>
            <textarea
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              rows={3}
              placeholder="How did you solve it?"
              className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-brand-primary/50 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              The Outcome / Impact
            </label>
            <textarea
              value={outcome}
              onChange={(e) => setOutcome(e.target.value)}
              rows={2}
              placeholder="What results were achieved?"
              className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-brand-primary/50 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tech Stack (comma separated)
            </label>
            <input
              type="text"
              value={techStackInput}
              onChange={(e) => setTechStackInput(e.target.value)}
              placeholder="React, Node.js, PostgreSQL"
              className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
            />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <h2 className="text-lg font-semibold text-foreground">
            Project Image
          </h2>

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full max-h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingImage}
                className="w-full p-8 border-2 border-dashed border-border rounded-lg hover:border-brand-primary/50 transition-colors flex flex-col items-center gap-2 text-muted-foreground"
              >
                {isUploadingImage ? (
                  <Loader2 className="w-8 h-8 animate-spin" />
                ) : (
                  <>
                    <Upload className="w-8 h-8" />
                    <span>Click to upload project image</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <h2 className="text-lg font-semibold text-foreground">Publishing</h2>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as 'draft' | 'published')
              }
              className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Link to="/admin/portfolio">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            Create Project
          </Button>
        </div>
      </form>
    </div>
  )
}
