'use client'

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'
import { NavigationTriggerContent } from './NavigationTriggerContent'
import { NavigationTrigger } from './NavigationTrigger'
import { navigationItems } from '@/constants'
import { cn } from '@/lib/utils'
import React from 'react'

export function NavigationBar() {
  return (
    <NavigationMenu>
      <NavigationMenuList className='space-x-5'>
        {navigationItems.map((trigger) => (
          <NavigationMenuItem key={'_trigger_' + trigger.href}>
            <NavigationTrigger trigger={trigger} />
            {trigger.submenu && <NavigationTriggerContent submenu={trigger.submenu} />}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
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
