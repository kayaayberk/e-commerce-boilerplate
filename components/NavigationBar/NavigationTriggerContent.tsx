import { ImageGridItem, Submenu, TextGridItem, TextImageGridItem } from './types'
import { NavigationMenuContent, NavigationMenuLink } from '../ui/navigation-menu'
import { NavigationSubmenuItems } from './NavigationSubmenuItems'
import { cn } from '@/lib/utils'
import React from 'react'

export function NavigationTriggerContent({ submenu }: { submenu: Submenu }) {
  return (
    <>
      {submenu.variant === 'text-grid' ? (
        <NavigationMenuContent className='w-auto p-4 mx-auto'>
          <div className='mx-auto grid max-w-container-md grid-cols-3 gap-40 w-screen px-10'>
            {(submenu.items as TextGridItem[]).map((item, index) => (
              <NavigationSubmenuItems key={index} submenuItems={item} variant='text-grid' />
            ))}
          </div>
        </NavigationMenuContent>
      ) : submenu.variant === 'image-grid' ? (
        <NavigationMenuContent className='w-auto p-4 mx-auto'>
          <div className='mx-auto grid max-w-container-md justify-center grid-cols-4 w-screen px-10'>
            {(submenu.items as ImageGridItem[]).map((item, index) => (
              <NavigationSubmenuItems key={index} submenuItems={item} variant='image-grid' />
            ))}
          </div>
        </NavigationMenuContent>
      ) : submenu.variant === 'text-image-grid' ? (
        <NavigationMenuContent className='w-auto p-4 mx-auto'>
          <div className='flex items-center max-w-container-md mx-auto justify-between w-screen px-10'>
            <ul className='flex flex-col'>
              {(submenu.items as TextImageGridItem[]).map((item, index) => (
                <div key={index}>
                  {!item.image && <ListItem href={item.href}>{item.text}</ListItem>}
                </div>
              ))}
            </ul>
            <ul className='grid grid-cols-4 items-center space-x-10'>
              {(submenu.items as TextImageGridItem[]).map((item, index) => (
                <div key={index}>
                  {item.image && (
                    <NavigationSubmenuItems
                      key={index}
                      submenuItems={item}
                      variant='text-image-grid'
                    />
                  )}
                </div>
              ))}
            </ul>
          </div>
        </NavigationMenuContent>
      ) : null}
    </>
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
            {title && (
              <div className={cn('text-xl font-medium text-black', children ? 'mb-2' : 'mb-0')}>
                {title}
              </div>
            )}
            <p className='line-clamp-2 text-sm leading-snug text-muted-foreground'>{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  }
)
ListItem.displayName = 'ListItem'
