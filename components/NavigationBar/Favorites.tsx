import { Icons } from '../Icons/Icons'
import { cn } from '@/lib/utils'
import Link from 'next/link'

interface FavoritesProps {
  className?: string
}

export async function Favorites({ className }: FavoritesProps) {
  return (
    <div
      className={cn(
        'cursor-pointer items-center justify-center transition-transform hover:scale-105',
        className
      )}
    >
      <Link aria-label='Go to favorites items' href='/favorites' prefetch={false}>
        <Icons.Heart className='size-6' />
      </Link>
    </div>
  )
}
