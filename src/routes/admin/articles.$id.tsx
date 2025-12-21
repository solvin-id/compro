'use client'

import { createFileRoute, useRouter, notFound } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/Button'
import { RichTextEditor } from '@/components/editor'
import { getArticleFn, updateArticleFn } from '@/functions/articles'

export const Route = createFileRoute('/admin/articles/$id')({
  loader: async ({ params }) => {
    const article = await getArticleFn({ data: { id: parseInt(params.id) } })
    if (!article) {
      throw notFound()
    }
    return { article }
  },
  component: EditArticlePage,
})

function EditArticlePage() {
  const { article: initialArticle } = Route.useLoaderData()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [title, setTitle] = useState(initialArticle.title)
  const [slug, setSlug] = useState(initialArticle.slug)
  const [content, setContent] = useState(initialArticle.content)
  const [summary, setSummary] = useState(initialArticle.summary)
  const [category, setCategory] = useState(initialArticle.category)
  const [status, setStatus] = useState<'draft' | 'published' | 'archived'>(
    (initialArticle.status as 'draft' | 'published' | 'archived') || 'draft',
  )
  const [coverImage, setCoverImage] = useState(initialArticle.coverImage || '')
  const [coverImageAlt, setCoverImageAlt] = useState(
    initialArticle.coverImageAlt || '',
  )

  const [seoTitle, setSeoTitle] = useState(initialArticle.seoTitle || '')
  const [seoDescription, setSeoDescription] = useState(
    initialArticle.seoDescription || '',
  )

  const calculateReadTime = (text: string) => {
    const wordsPerMinute = 200
    const words = text.replace(/<[^>]*>/g, '').split(/\s+/).length
    const minutes = Math.ceil(words / wordsPerMinute)
    return `${minutes} min read`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      await updateArticleFn({
        data: {
          id: initialArticle.id,
          slug,
          title,
          content,
          summary,
          category,
          status,
          coverImage: coverImage || undefined,
          coverImageAlt: coverImageAlt || undefined,
          seoTitle: seoTitle || undefined,
          seoDescription: seoDescription || undefined,
          readTime: calculateReadTime(content),
        },
      })

      router.navigate({ to: '/admin/articles' })
    } catch (err: any) {
      setError(err.message || 'Failed to update article')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link
            to="/admin/articles"
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Edit Article</h1>
            <p className="text-muted-foreground">Update your blog post</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as 'draft' | 'published' | 'archived')
            }
            className="px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Update Article
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-brand-primary/50 text-lg"
                placeholder="Enter article title..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Slug *
              </label>
              <div className="flex items-center">
                <span className="text-muted-foreground text-sm mr-2">
                  /articles/
                </span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) =>
                    setSlug(
                      e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''),
                    )
                  }
                  className="flex-1 px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                  placeholder="article-slug"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Content *
              </label>
              <RichTextEditor
                value={content}
                onChange={setContent}
                placeholder="Start writing your article..."
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Summary *
              </label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-brand-primary/50 resize-none"
                placeholder="Brief description of the article..."
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Category *
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                placeholder="e.g., Technology, Design"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Cover Image URL
              </label>
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Cover Image Alt Text
              </label>
              <input
                type="text"
                value={coverImageAlt}
                onChange={(e) => setCoverImageAlt(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                placeholder="Describe the image..."
              />
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="text-sm font-medium text-foreground mb-4">
                SEO Settings
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    SEO Title ({seoTitle.length}/60)
                  </label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value.slice(0, 60))}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
                    placeholder="Custom SEO title..."
                  />
                </div>

                <div>
                  <label className="block text-xs text-muted-foreground mb-1">
                    SEO Description ({seoDescription.length}/160)
                  </label>
                  <textarea
                    value={seoDescription}
                    onChange={(e) =>
                      setSeoDescription(e.target.value.slice(0, 160))
                    }
                    rows={3}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-brand-primary/50 resize-none"
                    placeholder="Custom meta description..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
