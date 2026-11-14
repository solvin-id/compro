import { Github, Instagram, Linkedin, type LucideIcon } from 'lucide-react'

export interface FooterLink {
  labelKey: string
  to: '/' | '/portfolio' | '/articles' | '/start'
  hash?: string
}

export interface FooterLinkGroup {
  titleKey: string
  links: FooterLink[]
}

export interface SocialLink {
  name: string
  href: string
  icon: LucideIcon
  ariaLabel: string
}

export const FOOTER_COMPANY_LINKS: FooterLink[] = [
  { labelKey: 'nav.home', to: '/' },
  { labelKey: 'nav.about', to: '/', hash: 'profile' },
  { labelKey: 'nav.team', to: '/', hash: 'personnel' },
  { labelKey: 'footer.startProject', to: '/start' },
]

export const FOOTER_SOLUTIONS_LINKS: FooterLink[] = [
  { labelKey: 'services.items.web.title', to: '/', hash: 'capabilities' },
  { labelKey: 'services.items.backend.title', to: '/', hash: 'capabilities' },
  { labelKey: 'services.items.odoo.title', to: '/', hash: 'capabilities' },
  { labelKey: 'nav.method', to: '/', hash: 'method' },
]

export const FOOTER_SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: Linkedin,
    ariaLabel: 'Visit Solvin LinkedIn page',
  },
  {
    name: 'GitHub',
    href: 'https://github.com/solvin-id',
    icon: Github,
    ariaLabel: 'Visit Solvin GitHub profile',
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/solvin.id',
    icon: Instagram,
    ariaLabel: 'Follow Solvin on Instagram',
  },
]

export const FOOTER_CONTACT = {
  email: 'hello@solvin.id',
  whatsapp: '+62 812 3456 7890',
  whatsappLink: 'https://wa.me/6281234567890',
  location: 'Yogyakarta, Indonesia',
}
