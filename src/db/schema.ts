import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  email: text('email').notNull().unique(),
  password: text('password').notNull(),
  name: text('name').notNull(),
  role: text('role').default('admin'),
  avatar: text('avatar'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(
    () => new Date(),
  ),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

export type SafeUser = Omit<User, 'password'>

export const todos = sqliteTable('todos', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(
    () => new Date(),
  ),
})

export const articles = sqliteTable('articles', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  summary: text('summary').notNull(),
  category: text('category').notNull(),

  coverImage: text('cover_image'),
  coverImageAlt: text('cover_image_alt'),

  seoTitle: text('seo_title'),
  seoDescription: text('seo_description'),
  canonicalUrl: text('canonical_url'),
  structuredDataType: text('structured_data_type').default('Article'),

  authorId: text('author_id').notNull(),
  authorName: text('author_name').notNull(),
  readTime: text('read_time'),
  status: text('status').default('draft'),

  publishedAt: integer('published_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(
    () => new Date(),
  ),
})

export type Article = typeof articles.$inferSelect
export type NewArticle = typeof articles.$inferInsert

export const portfolio = sqliteTable('portfolio', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  year: text('year').notNull(),
  sector: text('sector').notNull(),
  description: text('description').notNull(),
  client: text('client'),
  problem: text('problem'),
  solution: text('solution'),
  outcome: text('outcome'),
  techStack: text('tech_stack'),
  image: text('image'),
  status: text('status').default('draft'),
  displayOrder: integer('display_order').default(0),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(
    () => new Date(),
  ),
})

export type Portfolio = typeof portfolio.$inferSelect
export type NewPortfolio = typeof portfolio.$inferInsert

export const subscribers = sqliteTable('subscribers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  token: text('token').notNull(),
  status: text('status').default('pending'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(
    () => new Date(),
  ),
})

export type Subscriber = typeof subscribers.$inferSelect
export type NewSubscriber = typeof subscribers.$inferInsert

export const emailQueue = sqliteTable('email_queue', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  to: text('to').notNull(),
  subject: text('subject').notNull(),
  body: text('body').notNull(),
  status: text('status').default('pending'),
  attempts: integer('attempts').default(0),
  error: text('error'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(
    () => new Date(),
  ),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(
    () => new Date(),
  ),
})

export type EmailQueue = typeof emailQueue.$inferSelect
export type NewEmailQueue = typeof emailQueue.$inferInsert
