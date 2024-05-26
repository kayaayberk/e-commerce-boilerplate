import { WebhookSubscriptionTopic } from '@/packages/core/platform/shopify/types/admin/admin.types'
import { createStorefrontClient } from '../packages/core/platform'
import { env } from '@/env'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function migrate() {
  const client = createStorefrontClient({
    strategy: 'shopify',
    storeDomain: process.env.SHOPIFY_STORE_DOMAIN ?? '',
    adminAccessToken: process.env.SHOPIFY_ADMIN_ACCESS_TOKEN,
  })

  const fetchedProductFeed = await client.createProductFeed()

  if (!fetchedProductFeed.data) {
    console.log({status: 'FAIL',message: 'Could not connect to Shopify store. Please, ensure you provided valid credentials.'})
    process.exit(0)
    return
  }

  console.log({ status: 'INFO', message: 'Creating product feed...' })
  const errorMessage = fetchedProductFeed?.errors?.graphQLErrors?.find(Boolean)?.message

  if (!fetchedProductFeed || errorMessage) {
    console.log({ status: 'FAIL', message: 'Could not create product feed.' })
    process.exit(0)

    return
  }

  const userError = fetchedProductFeed?.data?.productFeedCreate?.userErrors?.find(Boolean)?.message
  let productFeed = fetchedProductFeed?.data?.productFeedCreate?.productFeed

  if (!productFeed) {
    const fetchedLatestProductFeed = await client.getLatestProductFeed()
    console.log({ status: 'INFO', message: 'Fetching latest product feed...' })
    productFeed = fetchedLatestProductFeed?.data?.productFeeds?.nodes?.find(Boolean)

    if (!productFeed && userError) {
      console.log({ status: 'FAIL', message: userError })
      process.exit(0)

      return
    }
  }

  console.log({ status: 'INFO', message: 'Subscribing PRODUCT_FEEDS_FULL_SYNC webhook...' })
  const fetchedWebhookMutation = await client.subscribeWebhook('PRODUCT_FEEDS_FULL_SYNC' as WebhookSubscriptionTopic, `${process.env.LIVE_HEADLESS_URL}/api/sync`)
  const webhookServerError = fetchedWebhookMutation?.errors?.graphQLErrors?.find(Boolean)?.message
  const webhookUserErrror =
    fetchedWebhookMutation?.data?.webhookSubscriptionCreate?.userErrors?.find(Boolean)?.message

  if (webhookServerError) {
    console.log({ status: 'FAIL', message: webhookServerError })
    process.exit(0)

    return
  }

  if (webhookUserErrror) {
    console.log({ status: 'WARN', message: 'Webhook subscription was already created' })
    console.log({status: 'INFO', message: 'Reusing PRODUCT_FEEDS_FULL_SYNC webhook subscription...'})
  } else {
    console.log({status: 'SUCCESS', message: 'Successfully subscribed to PRODUCT_FEEDS_FULL_SYNC webhook'})
  }

  const fetchedFullSync = await client.fullSyncProductFeed(productFeed?.id || '')

  console.log({ status: 'INFO', message: 'Starting full sync on latest product feed...' })

  const syncUserError = fetchedFullSync?.data?.productFullSync?.userErrors?.find(Boolean)?.message

  if (syncUserError) {
    console.log({ status: 'FAIL', message: syncUserError })
    process.exit(0)

    return
  }

  console.log({status: 'SUCCESS', message: 'Full sync mode started. Migration should start in a few seconds'})
  console.log({ status: 'INFO', message: 'Subscribing PRODUCT_FEEDS_INCREMENTAL_SYNC webhook...'})

  const incrementalWebhook = await client.subscribeWebhook('PRODUCT_FEEDS_INCREMENTAL_SYNC' as WebhookSubscriptionTopic, `${process.env.LIVE_HEADLESS_URL}/api/sync`)

  console.log({status: 'SUCCESS', message: 'Successfully subscribed to PRODUCT_FEEDS_INCREMENTAL_SYNC webhook'})

  const incrementalWebhookServerError =
    incrementalWebhook?.errors?.graphQLErrors?.find(Boolean)?.message

  if (incrementalWebhookServerError) {
    console.log({ status: 'FAIL', message: incrementalWebhookServerError })
    process.exit(0)

    return
  }

  const collectionWebhook = await client.subscribeWebhook('COLLECTIONS_UPDATE' as WebhookSubscriptionTopic, `${process.env.LIVE_HEADLESS_URL}/api/sync`)

  console.log({status: 'SUCCESS', message: 'Successfully subscribed to COLLECTIONS_UPDATE webhook'})
  const collectionWebhookServerError =
    collectionWebhook?.errors?.graphQLErrors?.find(Boolean)?.message

  if (collectionWebhookServerError) {
    console.log({ status: 'FAIL', message: collectionWebhookServerError })
    process.exit(0)

    return
  }

  console.log({ status: 'SUCCESS', message: 'Done' })
  process.exit(0)
}

migrate()
