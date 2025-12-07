import { LucideIcon } from 'lucide-react'

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

export const services: Service[] = [
  {
    id: 'web',
    title: 'Web Development',
    description:
      'High-performance, scalable web applications built with modern frameworks.',
    icon: 'Globe',
    tech: ['Next.js', 'React', 'TypeScript'],
    details:
      'We build PWAs, SPAs, and complex web portals using the latest React ecosystem. Our focus is on Core Web Vitals, accessibility, and SEO.',
  },
  {
    id: 'backend',
    title: 'Backend Systems',
    description:
      'Robust server-side architectures designed for reliability and speed.',
    icon: 'Server',
    tech: ['Node.js', 'Go', 'Python'],
    details:
      'Microservices or Monolith? We help you decide and build API-first architectures that scale with your business.',
  },
  {
    id: 'mobile',
    title: 'Mobile Apps',
    description: 'Native-quality cross-platform mobile experiences.',
    icon: 'Smartphone',
    tech: ['Flutter', 'React Native'],
    details:
      'One codebase, two platforms. We deliver smooth, mobile experiences for iOS and Android with offline-first capabilities.',
  },
  {
    id: 'odoo',
    title: 'Odoo ERP Solutions',
    description: 'Gold Partner standard implementation and customization.',
    icon: 'Database',
    tech: ['Odoo', 'Python', 'PostgreSQL'],
    details:
      'Streamline your operations with Odoo. We specialize in custom module development, migration, and local accounting compliance.',
  },
  {
    id: 'cms',
    title: 'Headless CMS',
    description:
      'Decoupled content management for flexibility and performance.',
    icon: 'Cloud',
    tech: ['WordPress', 'Sanity', 'Strapi'],
    details:
      'Content infrastructure that feeds your website, app, and watch. We implement structured content modeling for true omnichannel delivery.',
  },
  {
    id: 'seo',
    title: 'Technical SEO & Growth',
    description:
      'Data-driven strategies to dominate search rankings and drive organic traffic.',
    icon: 'LineChart', // Or 'Search' / 'TrendingUp'
    tech: ['Google Search Console', 'Lighthouse', 'Schema.org', 'SEMrush'],
    details:
      "We don't just guess; we engineer visibility. From technical audits and Core Web Vitals optimization to structured data implementation, we ensure your digital ecosystem is found by the right audience.",
  },
]

export const portfolio: PortfolioItem[] = [
  {
    id: '1',
    title: 'MediCore Systems',
    year: '2024',
    sector: 'Medical',
    description: 'AI-powered patient triage and management platform.',
    client: 'Grand Hospital Jakarta',
    problem:
      'Patient queue times triggered complaints; manual triage was error-prone.',
    solution:
      'A real-time queue management system with AI-assisted symptom triage.',
    outcome: 'Wait times reduced by 40%, patient satisfaction up by 25%.',
    techStack: ['React', 'Node.js', 'TensorFlow.js', 'PostgreSQL'],
  },
  {
    id: '2',
    title: 'FinFlow Global',
    year: '2023',
    sector: 'Fintech',
    description: 'Real-time cross-border payment processing infrastructure.',
    client: 'FinFlow Asia',
    problem:
      'Legacy system had high latency and failed 5% of cross-border transactions.',
    solution:
      'Go-based microservices architecture with Kafka for event streaming.',
    outcome:
      'Transaction success rate hitting 99.99%, latency dropped to <200ms.',
    techStack: ['Go', 'Kafka', 'Redis', 'Kubernetes'],
  },
  {
    id: '3',
    title: 'LuxStay Resorts',
    year: '2024',
    sector: 'Hospitality',
    description: 'Immersive booking experience for ultra-luxury destinations.',
    client: 'LuxStay Group',
    problem:
      'Generic booking engine did not reflect the premium brand identity.',
    solution: 'Bespoke booking engine with WebGL visualizations of villas.',
    outcome: 'Direct bookings increased by 60%, reducing OTA commission fees.',
    techStack: ['Next.js', 'Three.js', 'Sanity CMS', 'Stripe'],
  },
  {
    id: '4',
    title: 'RetailX Omni',
    year: '2023',
    sector: 'E-Commerce',
    description:
      'Unified inventory management across physical and digital stores.',
    client: 'Urban Retail Chain',
    problem:
      'Stock discrepancies between warehouse and online store caused overselling.',
    solution: 'Real-time sync engine connecting POS and Shopify.',
    outcome: 'Inventory accuracy improved to 100%, overselling eliminated.',
    techStack: ['Node.js', 'Shopify API', 'PostgreSQL'],
  },
  {
    id: '5',
    title: 'GreenEnergy Grid',
    year: '2022',
    sector: 'Energy',
    description: 'IoT dashboard for solar farm monitoring and optimization.',
    client: 'EcoPower Nusa',
    problem:
      'Field engineers had no visibility into panel efficiency remotely.',
    solution: 'IoT data pipeline visualization dashboard.',
    outcome: 'Maintenance costs reduced by 30% through predictive alerts.',
    techStack: ['React', 'D3.js', 'AWS IoT', 'DynamoDB'],
  },
]

export const articles: Article[] = [
  {
    slug: 'future-of-ai-integration',
    title: 'The Future of AI Integration in Legacy Systems',
    date: 'Oct 12, 2024',
    readTime: '5 min read',
    category: 'Technology',
    summary:
      'How enterprises can adopt AI without rewriting their entire codebase.',
  },
  {
    slug: 'react-19-server-components',
    title: 'React 19: Mastering Server Components',
    date: 'Sep 28, 2024',
    readTime: '8 min read',
    category: 'Development',
    summary: 'A deep dive into the new rendering paradigms in React 19.',
  },
  {
    slug: 'scaling-fintech-security',
    title: 'Scaling Fintech Security Architecture',
    date: 'Sep 15, 2024',
    readTime: '6 min read',
    category: 'Security',
    summary:
      'Best practices for securing financial data in cloud environments.',
  },
  {
    slug: 'ux-micro-interactions',
    title: 'Why Micro-interactions Matter',
    date: 'Aug 30, 2024',
    readTime: '4 min read',
    category: 'Design',
    summary:
      'Enhancing user experience through subtle animations and feedback.',
  },
]
