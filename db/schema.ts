import { jsonb, integer, pgTable, varchar, real, boolean, timestamp } from 'drizzle-orm/pg-core'
import { PlatformProductOptions, PlatformCollection, PlatformPriceRange, PlatformVariant, PlatformImage } from '@/packages/core/platform/types'

export const platformProduct = pgTable('platformProduct', {
  id: varchar('id').primaryKey(),
  handle: varchar('handle').notNull(),
  title: varchar('title').notNull(),
  description: varchar('description').notNull(),
  descriptionHtml: varchar('descriptionHtml').notNull(),
  options: jsonb('options').$type<PlatformProductOptions[]>().notNull(),
  priceRange: jsonb('priceRange').$type<PlatformPriceRange>().notNull(),
  variants: jsonb('variants').$type<PlatformVariant[]>().notNull(),
  featuredImage: jsonb('featuredImage').$type<PlatformImage>().notNull(),
  images: jsonb('images').$type<PlatformImage[]>().notNull(),
  tags: jsonb('tags').$type<string[]>().notNull(),
  vendor: varchar('vendor').notNull(),
  minPrice: real('minPrice').$type<number>().notNull(),
  updatedAt: varchar('updatedAt').notNull(),
  createdAt: varchar('createdAt').notNull(),
  updatedAtTimestamp: integer('updatedAtTimestamp').$type<number>().notNull(),
  createdAtTimestamp: integer('createdAtTimestamp').$type<number>().notNull(),
  flatOptions: jsonb('flatOptions').$type<Record<string, string[]>>().notNull(),
  collections: jsonb('collections').$type<Pick<PlatformCollection, "handle" | "id" | "title">[]>().notNull(),
  seo: jsonb('seo').$type<{ description?: string | null | undefined; title?: string | null | undefined }>().notNull(),
})


export const platformUser = pgTable('platformUser', {
  id: varchar('id').primaryKey(),
  email: varchar('email').$type<string | null | undefined>(),
  firstName: varchar('firstName').$type<string | null | undefined>(),
  lastName: varchar('lastName').$type<string | null | undefined>(),
  displayName: varchar('displayName').notNull(),
  phone: varchar('phone').$type<string | null | undefined>(),
  acceptsMarketing: boolean('acceptsMarketing').notNull(),
})

export type SelectPlatformUser = typeof platformUser.$inferSelect
export type InsertPlatformUser = typeof platformUser.$inferInsert

export type SelectplatformProduct = typeof platformProduct.$inferSelect
export type InsertplatformProduct = typeof platformProduct.$inferInsert
