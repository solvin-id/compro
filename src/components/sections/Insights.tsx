import { ArrowRight, Clock } from 'lucide-react'
import { articles } from '../../data'
import { Button } from '../ui/Button'
import { Link } from '@tanstack/react-router'

export function Insights() {
  const featured = articles[0]
  const others = articles.slice(1)

  return (
    <section id="insights" className="py-24 max-w-7xl mx-auto px-6">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Insights</h2>
          <p className="text-gray-600 max-w-xl">
            Thoughts on technology, design, and the future of digital business.
          </p>
        </div>
        <Link to="/articles">
          <Button variant="ghost" className="gap-2 group hidden md:flex">
            View all articles
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Featured Article */}
        <Link
          to="/articles/$slug"
          params={{ slug: featured.slug }}
          className="group cursor-pointer space-y-4"
        >
          <div className="aspect-video w-full bg-gray-100 rounded-3xl overflow-hidden border border-gray-200">
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 font-mono">
              [FEATURED_IMAGE]
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <span className="text-brand-primary">{featured.category}</span>
              <span>•</span>
              <span>{featured.date}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock size={12} /> {featured.readTime}
              </span>
            </div>
            <h3 className="text-3xl font-bold group-hover:text-brand-primary transition-colors">
              {featured.title}
            </h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              {featured.summary}
            </p>
            <div className="flex items-center gap-2 text-brand-primary font-medium pt-2">
              Read Story{' '}
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </div>
          </div>
        </Link>

        {/* Sidebar List */}
        <div className="divide-y divide-gray-100">
          {others.map((article) => (
            <Link
              key={article.slug}
              to="/articles/$slug"
              params={{ slug: article.slug }}
              className="group py-8 first:pt-0 flex gap-6 items-start cursor-pointer"
            >
              <div className="w-24 h-24 bg-gray-100 rounded-xl shrink-0 border border-gray-200" />
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 uppercase">
                  <span className="text-(--color-brand-secondary)">
                    {article.category}
                  </span>
                  <span>•</span>
                  <span>{article.date}</span>
                </div>
                <h4 className="text-xl font-bold group-hover:text-brand-primary transition-colors leading-tight">
                  {article.title}
                </h4>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {article.summary}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="md:hidden mt-8">
        <Button variant="outline" className="w-full justify-center">
          View All Articles
        </Button>
      </div>
    </section>
  )
}
