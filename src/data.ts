export interface Service {
  id: string
  title: string
  description: string
  icon: string
  tech: string[]
  details?: string // For the modal
}

export interface PortfolioItem {
  id: string
  title: string
  year: string
  sector: string
  description: string
  client: string
  problem: string
  solution: string
  outcome: string
  techStack: string[]
  image?: string
}

export interface Article {
  slug: string
  title: string
  date: string
  readTime: string
  category: string
  summary: string
  coverImage?: string
}
