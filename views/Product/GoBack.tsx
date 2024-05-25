import { Icons } from '@/components/Icons/Icons'
import Link from 'next/link'

export function GoBack({ className }: { className?: string }) {
  return (
    <Link href='/search' className={className} aria-label='Go back'>
      <Icons.ArrowLeft className='size-8 cursor-pointer transition-transform duration-200 hover:scale-110' />
    </Link>
  )
}
