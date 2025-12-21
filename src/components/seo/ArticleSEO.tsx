interface ArticleSEOProps {
  article: {
    slug: string
    title: string
    seoTitle?: string
    seoDescription?: string
    summary: string
    coverImage?: string
    coverImageAlt?: string
    canonicalUrl?: string
    structuredDataType?:
      | 'Article'
      | 'NewsArticle'
      | 'TechArticle'
      | 'BlogPosting'
    publishedAt?: string
    updatedAt?: string
    author: {
      name: string
      slug?: string
      profileUrl?: string
    }
  }
  siteUrl?: string
}

/**
 * Generates SEO meta tags and JSON-LD structured data for article pages.
 * Optimized for Google Discover with max-image-preview:large.
 *
 * Use with TanStack Start's head() function in route definitions:
 *
 * ```tsx
 * head: ({ loaderData }) => ({
 *   meta: getArticleSEOMeta(loaderData.article),
 *   scripts: [getArticleJsonLdScript(loaderData.article)]
 * })
 * ```
 */
export function getArticleSEOMeta(
  article: ArticleSEOProps['article'],
  siteUrl = 'https://solvin.com',
) {
  const title = article.seoTitle || article.title
  const description = article.seoDescription || article.summary
  const imageUrl = article.coverImage || `${siteUrl}/og-image.png`
  const canonicalUrl =
    article.canonicalUrl || `${siteUrl}/articles/${article.slug}`
  const publishedTime = article.publishedAt || new Date().toISOString()
  const modifiedTime = article.updatedAt || publishedTime

  return [
    // Basic Meta
    { title },
    { name: 'description', content: description },

    // Robots - Google Discover optimized
    {
      name: 'robots',
      content:
        'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    },

    // Open Graph
    { property: 'og:locale', content: 'id_ID' },
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:site_name', content: 'Solvin' },
    { property: 'og:image', content: imageUrl },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '675' },
    { property: 'og:image:alt', content: article.coverImageAlt || title },
    { property: 'article:published_time', content: publishedTime },
    { property: 'article:modified_time', content: modifiedTime },
    {
      property: 'article:author',
      content:
        article.author.profileUrl || `${siteUrl}/team/${article.author.slug}`,
    },

    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: imageUrl },
  ]
}

/**
 * Generates JSON-LD structured data script for article pages.
 * Supports BlogPosting, Article, NewsArticle, and TechArticle types.
 */
export function getArticleJsonLd(
  article: ArticleSEOProps['article'],
  siteUrl = 'https://solvin.com',
): object {
  const schemaType = article.structuredDataType || 'BlogPosting'
  const canonicalUrl =
    article.canonicalUrl || `${siteUrl}/articles/${article.slug}`
  const publishedTime = article.publishedAt || new Date().toISOString()
  const modifiedTime = article.updatedAt || publishedTime

  return {
    '@context': 'https://schema.org',
    '@type': schemaType,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    headline: article.seoTitle || article.title,
    description: article.seoDescription || article.summary,
    // Multiple aspect ratios for Google Discover
    image: article.coverImage
      ? [
          `${article.coverImage}?w=1200&h=675&fit=crop`, // 16:9
          `${article.coverImage}?w=1200&h=900&fit=crop`, // 4:3
          `${article.coverImage}?w=1200&h=1200&fit=crop`, // 1:1
        ]
      : [
          `${siteUrl}/images/${article.slug}/16x9.jpg`,
          `${siteUrl}/images/${article.slug}/4x3.jpg`,
        ],
    datePublished: publishedTime,
    dateModified: modifiedTime,
    author: {
      '@type': 'Person',
      name: article.author.name,
      url:
        article.author.profileUrl || `${siteUrl}/team/${article.author.slug}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Solvin',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
  }
}

/**
 * Returns the JSON-LD script object for use in TanStack Start's head() function.
 */
export function getArticleJsonLdScript(
  article: ArticleSEOProps['article'],
  siteUrl = 'https://solvin.com',
) {
  return {
    type: 'application/ld+json',
    children: JSON.stringify(getArticleJsonLd(article, siteUrl)),
  }
}

/**
 * React component for rendering the JSON-LD script inline.
 * Use this if you need to render the script within the component tree.
 */
export function ArticleJsonLd({
  article,
  siteUrl = 'https://solvin.com',
}: ArticleSEOProps) {
  const jsonLd = getArticleJsonLd(article, siteUrl)

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  )
}
