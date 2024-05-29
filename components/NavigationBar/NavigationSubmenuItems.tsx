import React from 'react'
import { NavigationMenuLink } from '../ui/navigation-menu'
import { ImageGridItem, Submenu, TextGridItem, TextImageGridItem } from './types'
import { cn } from '@/lib/utils'
import Image from 'next/image'

type NavigationSubmenuItems = {
  submenuItems: TextGridItem | ImageGridItem | TextImageGridItem
  variant: 'text-grid' | 'image-grid' | 'text-image-grid'
}

export function NavigationSubmenuItems({ submenuItems, variant }: NavigationSubmenuItems) {
  switch (variant) {
    case 'text-grid':
      return <TextGridItemComp submenuItems={submenuItems as TextGridItem} />
    case 'image-grid':
      return <ImageGridItemComp submenuItems={submenuItems as ImageGridItem} />
    case 'text-image-grid':
      return <TextImageGridItemComp submenuItems={submenuItems as TextImageGridItem} />
  }
}

function TextGridItemComp({ submenuItems }: { submenuItems: TextGridItem }) {
  return (
    <ul>
      <li>
        <div>
          <span className='pl-3 text-xl font-medium'>{submenuItems.text}</span>
          {submenuItems.items.map((item, index) => (
            <ListItem key={index} href={item.href}>
              <p className='whitespace-nowrap'>{item.text}</p>
            </ListItem>
          ))}
        </div>
      </li>
    </ul>
  )
}

function ImageGridItemComp({ submenuItems }: { submenuItems: ImageGridItem }) {
  return (
    <ul>
      <li>
        <div>
          <span>{submenuItems.text}</span>
          <div className='!size-40 overflow-hidden rounded-xl'>
            <Image src={submenuItems.image} alt={submenuItems.text} width={160} height={160} />
          </div>
        </div>
      </li>
    </ul>
  )
}

function TextImageGridItemComp({ submenuItems }: { submenuItems: TextImageGridItem }) {
  return (
    <ul>
      <li>
        <div>
          <span>{submenuItems.text}</span>
          <div className='!size-40 overflow-hidden rounded-xl'>
            {submenuItems.image && (
              <Image src={submenuItems.image} alt={submenuItems.text} width={160} height={160} />
            )}
          </div>
        </div>
      </li>
    </ul>
  )
}

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className
            )}
            {...props}
          >
            <div className='text-sm font-medium leading-none'>{title}</div>
            <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  }
)
ListItem.displayName = 'ListItem'
