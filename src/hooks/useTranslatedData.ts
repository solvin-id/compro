import { useTranslation } from 'react-i18next'
import type { Service, PortfolioItem, Article } from '../data'

// Hook for translated services data
export function useServicesData(): Service[] {
  const { t } = useTranslation()

  return [
    {
      id: 'web',
      title: t('services.items.web.title'),
      description: t('services.items.web.description'),
      icon: 'Globe',
      tech: ['Next.js', 'React', 'TypeScript'],
      details: t('services.items.web.details'),
    },
    {
      id: 'backend',
      title: t('services.items.backend.title'),
      description: t('services.items.backend.description'),
      icon: 'Server',
      tech: ['Node.js', 'Go', 'Python'],
      details: t('services.items.backend.details'),
    },
    {
      id: 'mobile',
      title: t('services.items.mobile.title'),
      description: t('services.items.mobile.description'),
      icon: 'Smartphone',
      tech: ['Flutter', 'React Native'],
      details: t('services.items.mobile.details'),
    },
    {
      id: 'odoo',
      title: t('services.items.odoo.title'),
      description: t('services.items.odoo.description'),
      icon: 'Database',
      tech: ['Odoo', 'Python', 'PostgreSQL'],
      details: t('services.items.odoo.details'),
    },
    {
      id: 'cms',
      title: t('services.items.cms.title'),
      description: t('services.items.cms.description'),
      icon: 'Cloud',
      tech: ['WordPress', 'Sanity', 'Strapi'],
      details: t('services.items.cms.details'),
    },
    {
      id: 'seo',
      title: t('services.items.seo.title'),
      description: t('services.items.seo.description'),
      icon: 'LineChart',
      tech: ['Google Search Console', 'Lighthouse', 'Schema.org', 'SEMrush'],
      details: t('services.items.seo.details'),
    },
  ]
}

// Team member interface for i18n
export interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  github: string
  linkedin: string
  position: { top: string; left: string }
  hotspotArea: { width: string; height: string }
}

// Hook for translated team data
export function useTeamData(): TeamMember[] {
  const { t } = useTranslation()

  return [
    {
      id: 'ceo',
      name: t('team.members.ceo.name'),
      role: t('team.members.ceo.role'),
      bio: t('team.members.ceo.bio'),
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      position: { top: '30%', left: '10%' },
      hotspotArea: { width: '12%', height: '50%' },
    },
    {
      id: 'cto',
      name: t('team.members.cto.name'),
      role: t('team.members.cto.role'),
      bio: t('team.members.cto.bio'),
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      position: { top: '25%', left: '28%' },
      hotspotArea: { width: '12%', height: '55%' },
    },
    {
      id: 'lead-dev',
      name: t('team.members.lead-dev.name'),
      role: t('team.members.lead-dev.role'),
      bio: t('team.members.lead-dev.bio'),
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      position: { top: '20%', left: '44%' },
      hotspotArea: { width: '12%', height: '60%' },
    },
    {
      id: 'designer',
      name: t('team.members.designer.name'),
      role: t('team.members.designer.role'),
      bio: t('team.members.designer.bio'),
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      position: { top: '25%', left: '60%' },
      hotspotArea: { width: '12%', height: '55%' },
    },
    {
      id: 'pm',
      name: t('team.members.pm.name'),
      role: t('team.members.pm.role'),
      bio: t('team.members.pm.bio'),
      github: 'https://github.com',
      linkedin: 'https://linkedin.com',
      position: { top: '30%', left: '78%' },
      hotspotArea: { width: '12%', height: '50%' },
    },
  ]
}

// Portfolio items remain mostly the same (client names, tech stacks are proper nouns)
// But we could internationalize descriptions if needed
export function usePortfolioData(): PortfolioItem[] {
  // For now, portfolio data uses English as the content is client-specific
  // In a real implementation, these would come from a CMS with multi-language support
  const { portfolio } = require('../data')
  return portfolio
}

// Articles data
export function useArticlesData(): Article[] {
  // Same as portfolio - article content would typically come from a CMS
  const { articles } = require('../data')
  return articles
}
