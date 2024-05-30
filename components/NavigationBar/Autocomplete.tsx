/* eslint-disable @next/next/no-img-element */
'use client'

import { useAutocomplete } from '@/lib/hooks/useAutocomplete'
import { getHighlightedText } from '@/lib/highlightedText'
import { type KeyboardEvent, useState } from 'react'
import { useClickAway } from '@uidotdev/usehooks'
import { useRouter } from 'next/navigation'
import { Icons } from '../Icons/Icons'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'

interface AutocompleteProps {
  className?: string
}

export function Autocomplete({ className }: AutocompleteProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const { query, results, isPending, onChange, status } = useAutocomplete({
    callback: () => !isOpen && setIsOpen(true),
  })
  const ref = useClickAway<HTMLDivElement>(() => {
    setIsOpen(false)
  })

  function handleOnInputFocus() {
    if (hasResults) setIsOpen(true)
  }

  function handleOnKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      router.push(`/search?q=${query}`)
      setIsOpen(false)
    }
  }

  const hasResults = !!results && results.length > 0

  return (
    <div className='relative hidden lg:block'>
      <div className={cn('relative block w-[240px] overflow-hidden rounded-full', className)}>
        {!!isPending && <Icons.Spinner className='absolute inset-y-1.5 right-2 animate-spin' />}
        <div className='pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5'>
          <Icons.Search className='size-4 text-neutral-500' />
        </div>
        <input
          type='search'
          className='block w-full rounded-full border border-neutral-300 bg-neutral-100 px-2.5 py-1.5 pl-10 text-sm text-black focus:border-blue-500 focus:ring-blue-500  '
          placeholder='Search...'
          onChange={onChange}
          onFocus={handleOnInputFocus}
          onKeyDown={handleOnKeyDown}
        />
      </div>

      <div
        className={cn('absolute top-10 z-50 w-[340px] rounded-b-md bg-white shadow-lg', {
          hidden: !isOpen,
        })}
        ref={ref}
      >
        {hasResults &&
          results.map((singleProduct) => (
            <Link
              href={`/products/${singleProduct.handle}`}
              className='flex cursor-pointer items-center justify-between gap-4 border-b border-neutral-200 p-2 last:rounded-b-md last:border-0 hover:bg-neutral-50'
              key={singleProduct.id}
              onClick={() => setIsOpen(false)}
            >
              <div className='flex flex-col items-start gap-2'>
                <p className='line-clamp-2 text-xs font-medium'>
                  {getHighlightedText(singleProduct.title, query)}
                </p>
                <p className='line-clamp-2 text-xs'>
                  {getHighlightedText(singleProduct.description, query)}
                </p>
              </div>
              <Image src={singleProduct.featuredImage.url} alt={singleProduct.title} width={50} height={50} className='rounded-md'/>
            </Link>
          ))}
        {status === 'error' && (
          <p className='p-4 text-xs text-red-500'>No matching results found. Please try again.</p>
        )}
      </div>
    </div>
  )
}
