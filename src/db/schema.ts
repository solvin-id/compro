import {
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
  integer,
} from 'drizzle-orm/pg-core'

// Users table for admin authentication
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  password: text('password').notNull(), // Bcrypt hashed - NEVER store plain text
  name: text('name').notNull(),
  role: text('role').default('admin'),
  avatar: text('avatar'),
  createdAt: timestamp('created_at').defaultNow(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

// Safe user type (without password) for client
export type SafeUser = Omit<User, 'password'>

export const todos = pgTable('todos', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
})

// Articles table for CMS
export const articles = pgTable('articles', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  content: text('content').notNull(), // Object key pointing to HTML content in RustFS storage
  summary: text('summary').notNull(),
  category: text('category').notNull(),

  // Cover Image
  coverImage: text('cover_image'),
  coverImageAlt: text('cover_image_alt'),

  // SEO Fields
  seoTitle: text('seo_title'), // Max 60 chars recommended
  seoDescription: text('seo_description'), // Max 160 chars recommended
  canonicalUrl: text('canonical_url'),
  structuredDataType: text('structured_data_type').default('Article'), // Article | NewsArticle | TechArticle | BlogPosting

  // Author & Meta
  authorId: text('author_id').notNull(), // Reference to team member
  authorName: text('author_name').notNull(),
  readTime: text('read_time'),
  status: text('status').default('draft'), // draft | published | archived

  // Timestamps
  publishedAt: timestamp('published_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Type inference helpers
export type Article = typeof articles.$inferSelect
export type NewArticle = typeof articles.$inferInsert

// Portfolio table for case studies
export const portfolio = pgTable('portfolio', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  year: text('year').notNull(),
  sector: text('sector').notNull(),
  description: text('description').notNull(),
  client: text('client'),
  problem: text('problem'),
  solution: text('solution'),
  outcome: text('outcome'),
  techStack: text('tech_stack'), // JSON array stored as string
  image: text('image'), // RustFS object key
  status: text('status').default('draft'), // draft | published
  displayOrder: integer('display_order').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export type Portfolio = typeof portfolio.$inferSelect
export type NewPortfolio = typeof portfolio.$inferInsert

// Newsletter Subscribers
export const subscribers = pgTable('subscribers', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  token: text('token').notNull(), // For unsubscribe/verification
  status: text('status').default('pending'), // pending | subscribed | unsubscribed
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export type Subscriber = typeof subscribers.$inferSelect
export type NewSubscriber = typeof subscribers.$inferInsert

// Email Queue for async sending
export const emailQueue = pgTable('email_queue', {
  id: serial('id').primaryKey(),
  to: text('to').notNull(),
  subject: text('subject').notNull(),
  body: text('body').notNull(), // HTML content
  status: text('status').default('pending'), // pending | sent | failed
  attempts: integer('attempts').default(0),
  error: text('error'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

export type EmailQueue = typeof emailQueue.$inferSelect
export type NewEmailQueue = typeof emailQueue.$inferInsert
