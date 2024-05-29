// TYPES
import type { WebhookSubscriptionTopic } from './types/admin/admin.types'
import type {
  WebhookSubscriptionCreateMutation,
  ProductFeedCreateMutation,
  LatestProductFeedsQuery,
  ProductFullSyncMutation,
  SingleAdminProductQuery,
  ProductStatusQuery,
  CustomerDeleteMutation,
} from './types/admin/admin.generated'
import {
  type CreateAccessTokenMutation,
  type DeleteCartItemsMutation,
  type UpdateCartItemsMutation,
  type CreateCustomerMutation,
  type CreateCartItemMutation,
  type UpdateCustomerMutation,
  type ProductsByHandleQuery,
  type SingleCollectionQuery,
  type SingleCustomerQuery,
  type CreateCartMutation,
  type SingleProductQuery,
  type CollectionsQuery,
  type SingleCartQuery,
  type SinglePageQuery,
  type PagesQuery,
  type MenuQuery,
  type SearchProductsQuery,
  type PredictiveSearchQuery,
  type ProductRecommendationsQuery,
} from './types/storefront.generated'
import {
  PlatformUserCreateInput,
  PlatformProductStatus,
  PlatformAccessToken,
  PlatformCollection,
  PlatformItemInput,
  PlatformProduct,
  PlatformMenu,
  PlatformPage,
  PlatformCart,
  PlatformUser,
} from '../types'
import { CurrencyCode, SearchQuerySuggestion } from './types/storefront.types'

// MUTATIONS
import { createCartItemMutation, createCartMutation, deleteCartItemsMutation, updateCartItemsMutation } from './mutations/cart.storefront'
import { createAccessTokenMutation, createCustomerMutation, updateCustomerMutation } from './mutations/customer.storefront'
import { createProductFeedMutation, fullSyncProductFeedMutation } from './mutations/product-feed.admin'
import { subscribeWebhookMutation } from './mutations/webhook.admin'

// QUERIES
import { getCollectionQuery, getCollectionsQuery } from './queries/collection.storefront'
import { getProductQuery, getProductRecommendationsQuery, getProductsByHandleQuery, predictiveSearchQuery, searchProductsQuery } from './queries/product.storefront'
import { getAdminProductQuery, getProductStatusQuery } from './queries/product.admin'
import { getLatestProductFeedQuery } from './queries/product-feed.admin'
import { getPageQuery, getPagesQuery } from './queries/page.storefront'
import { getCustomerQuery } from './queries/customer.storefront'
import { getCartQuery } from './queries/cart.storefront'
import { getMenuQuery } from './queries/menu.storefront'

// CLIENTS
import { createStorefrontApiClient, StorefrontApiClient } from '@shopify/storefront-api-client'
import { AdminApiClient, createAdminApiClient } from '@shopify/admin-api-client'

// NORMALIZERS
import { normalizeCart, normalizeCollection, normalizeProduct } from './normalize'
import { denormalizeId } from '@/lib/utils'
import { customerDeleteMutation } from './mutations/customer.admin'


interface CreateShopifyClientProps {
  storeDomain: string
  storefrontAccessToken?: string
  adminAccessToken?: string
}

export function createShopifyClient({ storefrontAccessToken, adminAccessToken, storeDomain }: CreateShopifyClientProps) {
  const client = createStorefrontApiClient({
    storeDomain,
    apiVersion: '2024-04',
    publicAccessToken: storefrontAccessToken || '_BOGUS_TOKEN_',
  })

  const adminClient = createAdminApiClient({
    storeDomain,
    accessToken: adminAccessToken || '',
    apiVersion: '2024-04',
  })

  return {
    subscribeWebhook: async (topic: `${WebhookSubscriptionTopic}`, callbackUrl: string) => subscribeWebhook(adminClient, topic, callbackUrl),
    fullSyncProductFeed: async (id: string) => fullSyncProductFeed(adminClient, id),

    updateUser: async (accessToken: string, input: Omit<PlatformUserCreateInput, "password">) => updateUser(client!, accessToken, input),
    createUserAccessToken: async (input: Pick<PlatformUserCreateInput, "password" | "email">) => createUserAccessToken(client!, input),
    createUser: async (input: PlatformUserCreateInput) => createUser(client!, input),
    getUser: async (accessToken: string) => getUser(client!, accessToken),
    deleteUser: async (id: string) => deleteUser(adminClient!, id),

    createCartItem: async (cartId: string, items: PlatformItemInput[]) => createCartItem(client!,cartId, items),
    updateCartItem: async (cartId: string, items: PlatformItemInput[]) => updateCartItem(client!,cartId, items),
    deleteCartItem: async (cartId: string, itemIds: string[]) => deleteCartItem(client!, cartId, itemIds),
    createCart: async (items: PlatformItemInput[]) => createCart(client!, items),
    getCart: async (cartId: string) => getCart(client!, cartId),
    
    getPredictiveSearchResults: async (query: string, limit: number, limitScope: 'ALL' | 'EACH') => getPredictiveSearchResults(client!, query, limit, limitScope),
    searchProducts: async (query: string, first: number) => searchProducts(client!, query, first),
    getProductRecommendations: async (id: string) => getProductRecommendations(client!, id),
    getProductByHandle: async (handle: string) => getProductByHandle(client!, handle),
    getProductStatus: async (id: string) => getProductStatus(adminClient!, id),
    getAdminProduct: async (id: string) => getAdminProduct(adminClient, id),
    getProduct: async (id: string) => getProduct(client!, id),

    getLatestProductFeed: async () => getLatestProductFeed(adminClient),
    createProductFeed: async () => createProductFeed(adminClient),

    getCollections: async (limit?: number) => getCollections(client!, limit),
    getCollection: async (handle: string) => getCollection(client!, handle),

    getMenu: async (handle?: string) => getMenu(client!, handle),
    getPage: async (handle: string) => getPage(client!, handle),
    getAllPages: async () => getAllPages(client!),
  }
}

async function getMenu(client: StorefrontApiClient, handle: string = 'main-menu'): Promise<PlatformMenu> {
  const response = await client.request<MenuQuery>(getMenuQuery, { variables: { handle } })
  const mappedItems = response.data?.menu?.items?.map((item) => ({
    title: item.title,
    url: item.url,
  }))

  return {
    items: mappedItems || [],
  }
}

async function getProduct(client: StorefrontApiClient, id: string): Promise<PlatformProduct | null> {
  const response = await client.request<SingleProductQuery>(getProductQuery, { variables: { id } })
  const product = response.data?.product

  return normalizeProduct(product)
}

async function getProductByHandle(client: StorefrontApiClient, handle: string) {
  const response = await client.request<ProductsByHandleQuery>(getProductsByHandleQuery, { variables: { query: `'${handle}'` } })
  const product = response.data?.products?.edges?.find(Boolean)?.node

  return normalizeProduct(product)
}

async function searchProducts(client: StorefrontApiClient, query: string, first: number) {
  const response = await client.request<SearchProductsQuery>(searchProductsQuery, { variables: { query, first } })

  const products = response.data?.search.edges.map((edge) => normalizeProduct(edge.node)).filter(Boolean) as PlatformProduct[]

  return products
}

async function getPredictiveSearchResults(client: StorefrontApiClient, query: string, limit: number, limitScope: 'EACH' | 'ALL') {
  const response = await client.request<PredictiveSearchQuery>(predictiveSearchQuery, { variables: { query, limit, limitScope } })

  const querySuggestion = response.data?.predictiveSearch?.queries as SearchQuerySuggestion[]
  const collections = response.data?.predictiveSearch?.collections as PlatformCollection[]
  const products = response.data?.predictiveSearch?.products?.map((product) => normalizeProduct(product)).filter(Boolean) as PlatformProduct[]
  const pages = response.data?.predictiveSearch?.pages as PlatformPage[]

  return { querySuggestion, collections, products, pages }
  
}

async function subscribeWebhook(client: AdminApiClient, topic: `${WebhookSubscriptionTopic}`, callbackUrl: string) {
  return client.request<WebhookSubscriptionCreateMutation>(subscribeWebhookMutation, {
    variables: {
      topic: topic,
      webhookSubscription: {
        callbackUrl: callbackUrl,
        format: 'JSON',
      },
    },
  })
}

async function createProductFeed(client: AdminApiClient) {
  return client.request<ProductFeedCreateMutation>(createProductFeedMutation)
}

async function fullSyncProductFeed(client: AdminApiClient, id: string) {
  return client.request<ProductFullSyncMutation>(fullSyncProductFeedMutation, { variables: { id } })
}

async function getLatestProductFeed(client: AdminApiClient) {
  return client.request<LatestProductFeedsQuery>(getLatestProductFeedQuery)
}

async function getPage(client: StorefrontApiClient, handle: string): Promise<PlatformPage | undefined | null> {
  const page = await client.request<SinglePageQuery>(getPageQuery, { variables: { handle } })
  return page.data?.page
}

async function getAllPages(client: StorefrontApiClient): Promise<PlatformPage[] | null> {
  const pages = await client.request<PagesQuery>(getPagesQuery)

  return pages.data?.pages?.edges?.map((edge) => edge.node) || []
}

async function getProductStatus(client: AdminApiClient, id: string): Promise<PlatformProductStatus | undefined | null> {
  const status = await client.request<ProductStatusQuery>(getProductStatusQuery, { variables: { id } })

  return status.data?.product
}

async function getProductRecommendations(client: StorefrontApiClient, id: string): Promise<PlatformProduct[] | undefined | null> {
  const productId = denormalizeId(id)
  const recommendedProducts = await client.request<ProductRecommendationsQuery>(getProductRecommendationsQuery, { variables: { productId } })

  return recommendedProducts.data?.productRecommendations?.map((product) => normalizeProduct(product)).filter(Boolean) as PlatformProduct[] || []
}

async function createCart(client: StorefrontApiClient, items: PlatformItemInput[]): Promise<PlatformCart | undefined | null> {
  const cart = await client.request<CreateCartMutation>(createCartMutation, { variables: { items } })

  return normalizeCart(cart.data?.cartCreate?.cart)
}

async function createCartItem(client: StorefrontApiClient, cartId: string, items: PlatformItemInput[]): Promise<PlatformCart | undefined | null> {
  const cart = await client.request<CreateCartItemMutation>(createCartItemMutation, { variables: { cartId, items } })

  return normalizeCart(cart.data?.cartLinesAdd?.cart)
}

async function updateCartItem(client: StorefrontApiClient, cartId: string, items: PlatformItemInput[]): Promise<PlatformCart | undefined | null> {
  const cart = await client.request<UpdateCartItemsMutation>(updateCartItemsMutation, { variables: { cartId, items } })

  return normalizeCart(cart.data?.cartLinesUpdate?.cart)
}

async function deleteCartItem(client: StorefrontApiClient, cartId: string, itemIds: string[]): Promise<PlatformCart | undefined | null> {
  const cart = await client.request<DeleteCartItemsMutation>(deleteCartItemsMutation, { variables: { itemIds, cartId } })

  return normalizeCart(cart.data?.cartLinesRemove?.cart)
}

async function getCart(client: StorefrontApiClient, cartId: string): Promise<PlatformCart | undefined | null> {
  const cart = await client.request<SingleCartQuery>(getCartQuery, { variables: { cartId } })

  return normalizeCart(cart.data?.cart)
}

async function getCollections(client: StorefrontApiClient, limit?: number): Promise<PlatformCollection[] | undefined | null> {
  const collections = await client.request<CollectionsQuery>(getCollectionsQuery, { variables: { limit: limit || 250 } })

  return collections.data?.collections.edges.map((collection) => normalizeCollection(collection.node)).filter(Boolean) as PlatformCollection[]
}

async function getCollection(client: StorefrontApiClient, handle: string): Promise<PlatformCollection | undefined | null> {
  const collection = await client.request<SingleCollectionQuery>(getCollectionQuery, { variables: { handle } })

  return normalizeCollection(collection.data?.collection)
}

async function createUser(client: StorefrontApiClient, input: PlatformUserCreateInput): Promise<Pick<PlatformUser, 'id' | 'acceptsMarketing' | 'displayName' | 'email' | 'firstName' | 'lastName' | 'phone' | 'tags'> | undefined | null> {
  const user = await client.request<CreateCustomerMutation>(createCustomerMutation, { variables: { input } })

  return user.data?.customerCreate?.customer
}

async function createUserAccessToken(client: StorefrontApiClient, input: Pick<PlatformUserCreateInput, 'password' | 'email'>): Promise<PlatformAccessToken | undefined | null> {
  const user = await client.request<CreateAccessTokenMutation>(createAccessTokenMutation, { variables: { input } })

  return user.data?.customerAccessTokenCreate?.customerAccessToken
}

async function getUser(client: StorefrontApiClient, customerAccessToken: string): Promise<PlatformUser | undefined | null> {
  const user = await client.request<SingleCustomerQuery>(getCustomerQuery, { variables: { customerAccessToken } })

  return user.data?.customer
}

async function updateUser(client: StorefrontApiClient, customerAccessToken: string, input: Omit<PlatformUserCreateInput, 'password'>) {
  const user = await client.request<UpdateCustomerMutation>(updateCustomerMutation, { variables: { customer: input, customerAccessToken } })

  return user.data?.customerUpdate?.customer
}

async function deleteUser(client: AdminApiClient, id: string) {
  const user = await client.request<CustomerDeleteMutation>(customerDeleteMutation, { variables: { id } })

  return user.data?.customerDelete?.deletedCustomerId
}

async function getAdminProduct(client: AdminApiClient, id: string) {
  const response = await client.request<SingleAdminProductQuery>(getAdminProductQuery, {
    variables: { id: id.startsWith('gid://shopify/Product/') ? id : `gid://shopify/Product/${id}` },
  })

  if (!response.data?.product) return null

  const variants = {
    edges: response.data?.product?.variants?.edges.map((edge) => ({ node: { ...edge.node, price: { amount: edge.node.price, currencyCode: '' as CurrencyCode } } })),
  }
  return normalizeProduct({ ...response.data?.product, variants })
}
