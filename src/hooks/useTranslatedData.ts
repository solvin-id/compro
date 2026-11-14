import { useTranslation } from 'react-i18next'

export interface Service {
  id: string
  title: string
  description: string
  icon: string
  tech: string[]
  details: string
  /** Mono discipline label, e.g. `WEB / PLATFORM`. */
  mode: string
}

export interface TeamMember {
  id: string
  profileImage?: string
  name: string
  role: string
  bio: string
}

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
      mode: 'WEB / PLATFORM',
    },
    {
      id: 'backend',
      title: t('services.items.backend.title'),
      description: t('services.items.backend.description'),
      icon: 'Server',
      tech: ['Node.js', 'Go', 'Python'],
      details: t('services.items.backend.details'),
      mode: 'API / INFRA',
    },
    {
      id: 'mobile',
      title: t('services.items.mobile.title'),
      description: t('services.items.mobile.description'),
      icon: 'Smartphone',
      tech: ['Flutter', 'React Native'],
      details: t('services.items.mobile.details'),
      mode: 'IOS / ANDROID',
    },
    {
      id: 'odoo',
      title: t('services.items.odoo.title'),
      description: t('services.items.odoo.description'),
      icon: 'Database',
      tech: ['Odoo', 'Python', 'PostgreSQL'],
      details: t('services.items.odoo.details'),
      mode: 'ERP / INTEGRATION',
    },
    {
      id: 'cms',
      title: t('services.items.cms.title'),
      description: t('services.items.cms.description'),
      icon: 'Cloud',
      tech: ['WordPress', 'Sanity', 'Strapi'],
      details: t('services.items.cms.details'),
      mode: 'CONTENT / OMNI',
    },
    {
      id: 'seo',
      title: t('services.items.seo.title'),
      description: t('services.items.seo.description'),
      icon: 'LineChart',
      tech: ['Google Search Console', 'Lighthouse', 'Schema.org', 'SEMrush'],
      details: t('services.items.seo.details'),
      mode: 'AUDIT / GROWTH',
    },
  ]
}

export function useTeamData(): TeamMember[] {
  const { t } = useTranslation()

  return [
    {
      id: 'cto',
      profileImage: '/image/teguh.webp',
      name: t('team.members.cto.name'),
      role: t('team.members.cto.role'),
      bio: t('team.members.cto.bio'),
    },
    {
      id: 'lead-dev',
      profileImage: '/image/akbar.webp',
      name: t('team.members.lead-dev.name'),
      role: t('team.members.lead-dev.role'),
      bio: t('team.members.lead-dev.bio'),
    },
    {
      id: 'ceo',
      profileImage: '/image/dafa.webp',
      name: t('team.members.ceo.name'),
      role: t('team.members.ceo.role'),
      bio: t('team.members.ceo.bio'),
    },
    {
      id: 'bussiness',
      profileImage: '/image/rino.webp',
      name: t('team.members.bussiness.name'),
      role: t('team.members.bussiness.role'),
      bio: t('team.members.bussiness.bio'),
    },
    {
      id: 'pm',
      profileImage: '/image/aisy.webp',
      name: t('team.members.pm.name'),
      role: t('team.members.pm.role'),
      bio: t('team.members.pm.bio'),
    },
  ]
}
