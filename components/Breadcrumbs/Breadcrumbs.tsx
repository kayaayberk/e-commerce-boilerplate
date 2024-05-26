import { BreadcrumbSeparator, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, Breadcrumb } from '@/components/ui/breadcrumb'
import { DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenu } from '@/components/ui/dropdown-menu'
import { PlatformCollection } from '@/packages/core/platform/types'
import { Icons } from '../Icons/Icons'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import React from 'react'

interface BreadcrumbsProps {
  items: Record<string, string>
  collections?: PlatformCollection[] | null | undefined
  className?: string
}

export function Breadcrumbs({ items, className, collections }: BreadcrumbsProps) {
  if (!collections) return <BreadcrumbLink href='/search'>Home</BreadcrumbLink>
  return (
    <Breadcrumb className={cn(className)}>
      <BreadcrumbList className='flex gap-0 space-x-0 sm:gap-1'>
        {Object.entries(items).map(([title, href], idx) => {
          const isLast = idx + 1 === Object.keys(items).length

          return (
            <div className='flex items-center gap-0.5' key={title + href}>
              <BreadcrumbItem>
                {collections.filter((collection) => collection.title === title).length > 0 ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger className='flex items-center gap-1 text-neutral-500 transition-colors duration-200 hover:text-black hover:underline'>
                      {collections.filter((collection) => collection.title === title)[0].title}
                      <Icons.ChevronDown className='size-4' />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='start'>
                      {collections.map((collection) => (
                        <DropdownMenuItem key={collection.title} className='text-neutral-500'>
                          <Link href={`/category/${collection.handle}`} className='w-full'>
                            {collection.title}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <BreadcrumbLink
                    className={`${isLast ? 'pointer-events-none text-black underline' : 'text-neutral-500'} hover:underline `}
                    href={href}
                  >
                    {title}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && (
                <BreadcrumbSeparator className=''>
                  <Icons.ChevronDown className='-rotate-90 text-neutral-500' size={16} />
                </BreadcrumbSeparator>
              )}
            </div>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
