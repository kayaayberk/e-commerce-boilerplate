import { NavTrigger } from '@/components/NavigationBar/types'
import Fashion1 from '@/public/NavPlaceholders/Fashion-1.webp'
import Fashion2 from '@/public/NavPlaceholders/Fashion-2.webp'
import Fashion3 from '@/public/NavPlaceholders/Fashion-3.webp'
import Fashion4 from '@/public/NavPlaceholders/Fashion-4.webp'
import SkinCare1 from '@/public/NavPlaceholders/Skin-Care-1.webp'

export const COOKIE_CART_ID = 'ecom_cartId'

export const COOKIE_ACCESS_TOKEN = 'ecom_accessToken'

export const COOKIE_FAVORITES = 'ecom_favorites'

export const TAGS = {
  CART: 'cart',
} as const

export const BUCKETS = {
  HOME: ['a', 'b'],
} as const

export const facetParams = ['q', 'minPrice', 'maxPrice', 'sortBy', 'categories', 'vendors', 'tags', 'colors', 'sizes']

export const navigationItems: NavTrigger[] = [
  {
    text: 'Home',
    href: '/',
  },
  {
    text: 'Fashion',
    href: '/category/clothing',
    submenu: {
      variant: 'text-grid',
      items: [
        {
          text: 'Women',
          items: [
            { text: 'Shirts & Blouses', href: '/search' },
            { text: 'Pants', href: '/search' },
            { text: 'Blazers & Vests', href: '/search' },
            { text: 'Cardigans & Sweaters', href: '/search' },
          ],
        },
        {
          text: 'Men',
          items: [
            { text: 'T-shirts & Tanks', href: '/search' },
            { text: 'Pants', href: '/search' },
            { text: 'Hoodies & Sweatshirts', href: '/search' },
            { text: 'Blazers & Suits', href: '/search' },
          ],
        },
        {
          text: 'Kids',
          items: [
            { text: 'Clothing', href: '/search' },
            { text: 'Outerwear', href: '/search' },
            { text: 'Activewear', href: '/search' },
            { text: 'Accessories', href: '/search' },
          ],
        },
      ],
    },
  },
  {
    text: 'Accessories',
    href: '/category/accessories',
    submenu: {
      variant: 'image-grid',
      items: [
        {
          href: '/category/accessories?tags=Bags',
          image: Fashion1,
          text: 'Bags',
        },
        {
          href: '/category/accessories?tags=Accessories',
          image: Fashion3,
          text: 'Accessories',
        },
        {
          href: '/category/accessories?tags=Footwear',
          image: Fashion2,
          text: 'Footwear',
        },
        {
          href: '/category/skin-care',
          image: SkinCare1,
          text: 'Skin Care',
        },
      ],
    },
  },
  {
    text: 'Beauty',
    href: '/category/skin-care',
    submenu: {
      variant: 'text-image-grid',
      items: [
        { text: 'Women', href: '/search' },
        { text: 'Men', href: '/search' },
        { text: 'Kids', href: '/search' },
        { text: 'Sport', href: '/search' },
        { text: 'T-shirts & Tanks', href: '/search' },
        { text: 'Pants', href: '/search' },
        { text: 'Hoodies & Sweatshirts', href: '/search' },
        { text: 'Blazers & Suits', href: '/search' },
        {
          href: '#',
          image: Fashion1,
          text: 'Home',
        },
        {
          href: '#',
          image: Fashion2,
          text: 'Beauty',
        },
        {
          href: '#',
          image: Fashion3,
          text: 'Holiday',
        },
        {
          href: '#',
          image: Fashion3,
          text: 'Holiday',
        },
      ],
    },
  },
  {
    text: 'Furniture',
    href: '/category/furniture',
    submenu: {
      variant: 'image-grid',
      items: [
        {
          href: '/category/furniture',
          image: Fashion1,
          text: 'Decor',
        },
        {
          href: '/category/furniture',
          image: Fashion2,
          text: 'Furniture',
        },
        {
          href: '/category/furniture',
          image: Fashion3,
          text: 'Bags',
        },
        {
          href: '/category/furniture',
          image: Fashion4,
          text: 'Sofas',
        },
      ],
    },
  },
]
