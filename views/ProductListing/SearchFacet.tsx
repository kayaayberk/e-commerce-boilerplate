'use client'

import { parseAsInteger, useQueryState } from 'nuqs'
import { useDebounce } from '@uidotdev/usehooks'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Icons } from '@/components/Icons/Icons'

export function SearchFacet({ className }: { className?: string }) {
  const [query, setQuery] = useQueryState('q', { shallow: false })
  const [localQuery, setLocalQuery] = useState(query)
  const [_, setPage] = useQueryState('page', {
    ...parseAsInteger,
    defaultValue: 1,
    shallow: false,
    history: 'push',
    clearOnDefault: true,
  })

  const debouncedQuery = useDebounce(localQuery, 500)

  useEffect(() => {
    if (!debouncedQuery) return

    setPage(1)
    setQuery(debouncedQuery)
  }, [debouncedQuery, setPage, setQuery])

  return (
    <div className={cn('relative flex w-full', className)}>
      <input
        className='relative w-full appearance-none rounded-md border border-neutral-300 bg-neutral-100 px-2.5 py-1.5 pl-4 text-black focus:border-blue-500 focus:ring-blue-500'
        placeholder='Search...'
        type='text'
        value={localQuery || ''}
        onChange={(event) => {
          setLocalQuery(event.target.value)
        }}
      />
      {!!localQuery && (
        <Button
          onClick={() => {
            setQuery('')
            setLocalQuery('')
          }}
          variant='ghost'
          className='absolute right-2 p-2'
        >
          <Icons.X />
        </Button>
      )}
    </div>
  )
}
