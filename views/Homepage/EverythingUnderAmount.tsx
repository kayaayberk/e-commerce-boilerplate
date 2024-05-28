import { getProductsUnderCertainPrice } from '@/app/actions/product.actions'
import { CarouselSection } from './CarouselSection'

export async function EverythingUnderAmount() {
  const itemsUnderFifty = await getProductsUnderCertainPrice(50)

  return <CarouselSection title='Everything under $50' items={itemsUnderFifty} />
}
