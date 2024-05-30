import { ImageGridItem, TextGridItem, TextImageGridItem } from './types'
import { NavigationMenuLink } from '../ui/navigation-menu'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import React from 'react'

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
      <div>
        <span className='pl-3 text-xl font-medium'>{submenuItems.text}</span>
        {submenuItems.items.map((item, index) => (
          <ListItem key={index} href={item.href}>
            <p className='whitespace-nowrap'>{item.text}</p>
          </ListItem>
        ))}
      </div>
    </ul>
  )
}

function ImageGridItemComp({ submenuItems }: { submenuItems: ImageGridItem }) {
  return (
    <ul>
      <ListItem title={submenuItems.text} href={submenuItems.href} className='max-w-min mx-auto'>
        <div className='size-40 overflow-hidden rounded-xl'>
          <Image src={submenuItems.image} alt={submenuItems.text} width={160} height={160} />
        </div>
      </ListItem>
    </ul>
  )
}

function TextImageGridItemComp({ submenuItems }: { submenuItems: TextImageGridItem }) {
  return (
    <ListItem href={submenuItems.href} className='flex flex-col items-center gap-2'>
      <div className='size-40 overflow-hidden rounded-xl'>
        <Image src={submenuItems.image!} alt={submenuItems.text} width={160} height={160} />
      </div>
      <div>
        <span className='text-xl font-medium text-black'>{submenuItems.text}</span>
      </div>
    </ListItem>
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
              'block select-none space-y-1 rounded-xl p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className
            )}
            {...props}
          >
            {title && (
              <div className={cn('text-xl font-medium text-black', children ? 'mb-2' : 'mb-0')}>
                {title}
              </div>
            )}
            <p className='line-clamp-2 text-sm text-black leading-snug text-muted-foreground'>{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  }
)
ListItem.displayName = 'ListItem'
