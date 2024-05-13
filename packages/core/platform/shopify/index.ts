// TYPES
import type { WebhookSubscriptionTopic } from './types/admin/admin.types'
import type {
  WebhookSubscriptionCreateMutation,
  ProductFeedCreateMutation,
  LatestProductFeedsQuery,
  ProductFullSyncMutation,
  SingleAdminProductQuery,
  ProductStatusQuery,
} from './types/admin/admin.generated'
import type {
  CreateAccessTokenMutation,
  DeleteCartItemsMutation,
  UpdateCartItemsMutation,
  CreateCustomerMutation,
  CreateCartItemMutation,
  UpdateCustomerMutation,
  ProductsByHandleQuery,
  SingleCollectionQuery,
  SingleCustomerQuery,
  CreateCartMutation,
  SingleProductQuery,
  CollectionsQuery,
  SingleCartQuery,
  SinglePageQuery,
  PagesQuery,
  MenuQuery,
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
import { CurrencyCode } from './types/storefront.types'

// MUTATIONS
import { createCartItemMutation, createCartMutation, deleteCartItemsMutation, updateCartItemsMutation } from './mutations/cart.storefront'
import { createAccessTokenMutation, createCustomerMutation, updateCustomerMutation } from './mutations/customer.storefront'
import { createProductFeedMutation, fullSyncProductFeedMutation } from './mutations/product-feed.admin'
import { subscribeWebhookMutation } from './mutations/webhook.admin'

// QUERIES
import { getCollectionQuery, getCollectionsQuery } from './queries/collection.storefront'
import { getProductQuery, getProductsByHandleQuery } from './queries/product.storefront'
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

  // To prevent prettier from wrapping pretty one liners and making them unreadable
  // prettier-ignore
  return {
    subscribeWebhook: async (topic: `${WebhookSubscriptionTopic}`, callbackUrl: string) => subscribeWebhook(adminClient, topic, callbackUrl),
    updateUser: async (accessToken: string, input: Omit<PlatformUserCreateInput, "password">) => updateUser(client!, accessToken, input),
    createUserAccessToken: async (input: Pick<PlatformUserCreateInput, "password" | "email">) => createUserAccessToken(client!, input),
    createCartItem: async (cartId: string, items: PlatformItemInput[]) => createCartItem(client!,cartId, items),
    updateCartItem: async (cartId: string, items: PlatformItemInput[]) => updateCartItem(client!,cartId, items),
    deleteCartItem: async (cartId: string, itemIds: string[]) => deleteCartItem(client!, cartId, itemIds),
    getProductByHandle: async (handle: string) => getProductByHandle(client!, handle),
    createUser: async (input: PlatformUserCreateInput) => createUser(client!, input),
    fullSyncProductFeed: async (id: string) => fullSyncProductFeed(adminClient, id),
    createCart: async (items: PlatformItemInput[]) => createCart(client!, items),
    getProductStatus: async (id: string) => getProductStatus(adminClient!, id),
    getCollections: async (limit?: number) => getCollections(client!, limit),
    getAdminProduct: async (id: string) => getAdminProduct(adminClient, id),
    getCollection: async (handle: string) => getCollection(client!, handle),
    getUser: async (accessToken: string) => getUser(client!, accessToken),
    getLatestProductFeed: async () => getLatestProductFeed(adminClient),
    createProductFeed: async () => createProductFeed(adminClient),
    getMenu: async (handle?: string) => getMenu(client!, handle),
    getPage: async (handle: string) => getPage(client!, handle),
    getCart: async (cartId: string) => getCart(client!, cartId),
    getProduct: async (id: string) => getProduct(client!, id),
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

async function createUser(client: StorefrontApiClient, input: PlatformUserCreateInput): Promise<Pick<PlatformUser, 'id'> | undefined | null> {
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
