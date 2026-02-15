import { Linkedin, Github, Instagram, type LucideIcon } from 'lucide-react'

export interface FooterLink {
  labelKey: string
  href: string
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
  { labelKey: 'nav.home', href: '/' },
  { labelKey: 'nav.about', href: '/#about' },
  { labelKey: 'nav.team', href: '/#team' },
  { labelKey: 'footer.careers', href: '/careers' },
]

export const FOOTER_SOLUTIONS_LINKS: FooterLink[] = [
  { labelKey: 'services.items.web.title', href: '/#services' },
  { labelKey: 'services.items.mobile.title', href: '/#services' },
  { labelKey: 'services.items.backend.title', href: '/#services' },
  { labelKey: 'services.items.odoo.title', href: '/#services' },
  { labelKey: 'footer.wordpress', href: '/#services' },
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
  location: 'Jakarta, Indonesia',
}
