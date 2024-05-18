import { json, integer, pgTable, varchar } from 'drizzle-orm/pg-core'
import { PlatformProductOptions, PlatformCollection, PlatformPriceRange, PlatformVariant, PlatformImage } from '@/packages/core/platform/types'

export const platformProduct = pgTable('platformProduct', {
  id: varchar('id').primaryKey(),
  handle: varchar('handle').notNull(),
  title: varchar('title').notNull(),
  description: varchar('description').notNull(),
  descriptionHtml: varchar('descriptionHtml').notNull(),
  options: json('options').$type<PlatformProductOptions[]>().notNull(),
  priceRange: json('priceRange').$type<PlatformPriceRange>().notNull(),
  variants: json('variants').$type<PlatformVariant[]>().notNull(),
  featuredImage: json('featuredImage').$type<PlatformImage>().notNull(),
  images: json('images').$type<PlatformImage[]>(),
  tags: json('tags').$type<string[]>().notNull(),
  vendor: varchar('vendor').notNull(),
  minPrice: integer('minPrice').$type<number>().notNull(),
  updatedAt: varchar('updatedAt').notNull(),
  createdAt: varchar('createdAt').notNull(),
  updatedAtTimestamp: integer('updatedAtTimestamp').$type<number>().notNull(),
  createdAtTimestamp: integer('createdAtTimestamp').$type<number>().notNull(),
  flatOptions: json('flatOptions').$type<Record<string, string[]>>().notNull(),
  collections: json('collections').$type<PlatformCollection[]>().notNull(),
  seo: json('seo')
    .$type<{ description?: string | null | undefined; title?: string | null | undefined }>()
    .notNull(),
})

export type SelectplatformProduct = typeof platformProduct.$inferSelect
export type InsertplatformProduct = typeof platformProduct.$inferInsert
