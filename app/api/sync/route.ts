import { env } from '@/env'
import { createHmac } from 'crypto'
import { Root } from '@/ shopify-webhooks'
import { FailedAttemptError } from 'p-retry'
import { MEILISEARCH_INDEX } from '@/constants'
import { meilisearch } from '@/clients/meilisearchClient'
import { storefrontClient } from '@/clients/storeFrontClient'

export async function POST(req: Request) {
  const hmac = req.headers.get('X-Shopify-Hmac-Sha256')

  if (!env.SHOPIFY_APP_API_SECRET_KEY) {
    return new Response(
      JSON.stringify({ message: 'Not all credentials were provided for the deployment' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const rawPayload = await req.text()

  if (!isWebhookVerified(rawPayload, hmac!)) {
    return new Response(JSON.stringify({ message: 'Could not verify request.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { metadata, product } = JSON.parse(rawPayload) as Root

  let index = await getMeilisearchIndex(MEILISEARCH_INDEX)



  if (!product?.id) {
    return Response.json({ status: 'error', message: 'Could not create product' })
  }

  const originalProduct = await storefrontClient.getProduct(product.id)

  if (metadata.action === 'DELETE') {
    // Shopify sends a DELETE webhook not only when a product is deleted, but also when a product is unpublished or product variant is deleted.
    // Because of this, we need to first check if the product is REALLY deleted.
    const productStatus = await storefrontClient.getProductStatus(denormalizeId(product.id))

    if (productStatus?.status === 'DRAFT') {
      return Response.json({ status: 'ok', message: 'Product drafted' })
    }

    if (originalProduct?.id) {
      const newImages = originalProduct.seo.title
      await index.updateDocuments([{ ...originalProduct, id: normalizeId(originalProduct.id), images: newImages }], {
        primaryKey: 'id',
      })
      return Response.json({ status: 'ok' })
    }

    await index.deleteDocument(normalizeId(product.id))
  }

  if (metadata.action === 'UPDATE' || metadata.action === 'CREATE') {
    if (originalProduct) {
      const newImages = originalProduct.seo.title
        
      await index.updateDocuments([{ ...originalProduct, id: normalizeId(originalProduct.id), images: newImages }], {
        primaryKey: 'id',
      })
    }
  }
  console.log(Response.json({ status: 'ok' }))
  return Response.json({ status: 'ok' })
}





function normalizeId(id: string) {
  const shopifyIdPrefix = 'gid://shopify/Product/'
  return id.replace(shopifyIdPrefix, '')
}

function denormalizeId(id: string) {
  return id.startsWith('gid://shopify/Product/') ? id : `gid://shopify/Product/${id}`
}

async function getMeilisearchIndex(indexName: string) {
  const pRetry = await import('p-retry')

  const run = async () => {
    return meilisearch.getIndex(indexName)
  }

  const onFailedAttempt = async (error: FailedAttemptError) => {
    await meilisearch.createIndex(indexName)
    console.log(`Attempt ${error.attemptNumber} failed. There are ${error.retriesLeft} retries left.`)
  }

  return pRetry.default(run, {
    retries: 10,
    onFailedAttempt,
  })
}

async function isWebhookVerified(rawBody: string, hmac: string) {
  const genHash = createHmac('sha256', env.SHOPIFY_APP_API_SECRET_KEY!).update(rawBody, 'utf-8').digest('base64')
  return genHash === hmac
}
