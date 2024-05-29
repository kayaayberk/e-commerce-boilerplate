'use client'

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { Icons } from '../Icons/Icons'
import Link from 'next/link'
import React from 'react'
import { cn } from '@/lib/utils'
import { navigationItems } from '@/constants'
import { NavigationTrigger } from './NavigationTrigger'
import { NavigationTriggerContent } from './NavigationTriggerContent'

export function NavigationBar() {
  return (
    <NavigationMenu className='sticky top-0 mx-auto'>
      <NavigationMenuList className=''>
        {navigationItems.map((trigger) => (
          <NavigationMenuItem key={'_trigger_' + trigger.href}>

              <NavigationTrigger trigger={trigger}  />

              {trigger.submenu && (
                <NavigationTriggerContent submenu={trigger.submenu} />
              )}


          </NavigationMenuItem>
        ))}


        {/* <NavigationMenuContent>
          <ul className='grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]'>
            <li className='row-span-3'>
              <NavigationMenuLink asChild>
                <a
                  className='flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md'
                  href='/'
                >
                  <Icons.Logo className='h-6 w-6' />
                  <div className='mb-2 mt-4 text-lg font-medium'>shadcn/ui</div>
                  <p className='text-sm leading-tight text-muted-foreground'>
                    Beautifully designed components that you can copy and paste into your apps.
                    Accessible. Customizable. Open Source.
                  </p>
                </a>
              </NavigationMenuLink>
            </li>
            <ListItem href='/docs' title='Introduction'>
              Re-usable components built using Radix UI and Tailwind CSS.
            </ListItem>
            <ListItem href='/docs/installation' title='Installation'>
              How to install dependencies and structure your app.
            </ListItem>
            <ListItem href='/docs/primitives/typography' title='Typography'>
              Styles for headings, paragraphs, lists...etc
            </ListItem>
          </ul>
        </NavigationMenuContent> */}

        {/* <NavigationMenuItem>
          <NavigationMenuTrigger>Components</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {navigationItems.map((item) => (
                <ListItem
                  key={item.text}
                  title={item.text}
                  href={item.href}
                >
                  {item.text}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>


        <NavigationMenuItem>
          <Link href="/docs" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Documentation
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem> */}
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
