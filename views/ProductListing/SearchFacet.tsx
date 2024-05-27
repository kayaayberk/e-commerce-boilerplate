'use client'

import { parseAsInteger, useQueryState } from 'nuqs'
import { useDebounce } from '@uidotdev/usehooks'
import { Icons } from '@/components/Icons/Icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

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
      <Input
        className='relative w-full appearance-none rounded-md border border-neutral-300 pl-4 text-black'
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
