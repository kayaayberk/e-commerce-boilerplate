import { storefrontClient } from '@/clients/storeFrontClient'
import { platformProduct } from '@/db/schema'
import { Root } from '@/ shopify-webhooks'
import { createHmac } from 'crypto'
import { eq } from "drizzle-orm";
import { env } from '@/env'
import { db } from '@/db'

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

  console.log('ACTION', metadata?.action)

  if (!product?.id) {
    return Response.json({ status: 'error', message: 'Could not create product' })
  }

  const originalProduct = await storefrontClient.getProduct(product.id)
  

  if (metadata.action === 'DELETE') {
    // Shopify sends a DELETE webhook not only when a product is deleted, but also when a product is unpublished or product variant is deleted.
    // Because of this, we need to first check if the product is REALLY deleted.
    const productStatus = await storefrontClient.getProductStatus(denormalizeId(product.id))
    console.log('PRODUCT STATUS', productStatus)

    if (productStatus?.status === 'DRAFT') {
      return Response.json({ status: 'ok', message: 'Product Drafted' })
    }

    if (originalProduct?.id) {
      await db.insert(platformProduct).values({...originalProduct, id: normalizeId(originalProduct.id) }).onConflictDoUpdate({
        target: platformProduct.id,
        set: {...originalProduct, id: normalizeId(originalProduct.id)},
      })
      return Response.json({ status: 'ok' })
    }
    await db.delete(platformProduct).where(eq(platformProduct.id, normalizeId(product.id)))
    return Response.json({ status: 'ok', message: 'Product Deleted' })
  }

  if (metadata.action === 'UPDATE' || metadata.action === 'CREATE') {
    if (originalProduct) {
      await db.insert(platformProduct).values({...originalProduct, id: normalizeId(originalProduct.id) }).onConflictDoUpdate({
        target: platformProduct.id,
        set: {...originalProduct, id: normalizeId(originalProduct.id)},
      })
    }
  }

  console.log(Response.json({ status: 'ok' }))
  return Response.json({ status: 'ok' })
}


// Normalize and denormalize Shopify IDs
function normalizeId(id: string) {
  const shopifyIdPrefix = 'gid://shopify/Product/'
  return id.replace(shopifyIdPrefix, '')
}

function denormalizeId(id: string) {
  return id.startsWith('gid://shopify/Product/') ? id : `gid://shopify/Product/${id}`
}

// Verify the webhook
async function isWebhookVerified(rawBody: string, hmac: string) {
  const genHash = createHmac('sha256', env.SHOPIFY_APP_API_SECRET_KEY!).update(rawBody, 'utf-8').digest('base64')
  return genHash === hmac
}
