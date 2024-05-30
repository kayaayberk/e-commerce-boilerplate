'use client'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { PlatformUser } from '@/packages/core/platform/types'
import { useUserStore } from '@/lib/stores/userStore'
import { logoutUser } from 'app/actions/user.actions'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Icons } from '../Icons/Icons'
import { cn } from '@/lib/utils'

export default function ProfileBar({ user }: { user: PlatformUser }) {
  const router = useRouter()
  const setUser = useUserStore((s) => s.setUser)
  const menuItemClass =
    'cursor-pointer border-b border-neutral-200 py-2 last:border-b-0 hover:bg-neutral-50 focus:bg-neutral-50 active:bg-neutral-50'

  function handleLogout() {
    logoutUser()
    setUser(null)

    router.refresh()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className='bg-transparent transition-transform hover:scale-105'>
        <Icons.User className='h-6 w-6' strokeWidth={1.5} />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='my-0 w-[240px] rounded-b-md bg-white p-0 text-neutral-500 shadow-lg'
        align='center'
      >
        <DropdownMenuItem className={cn('disabled:opacity-100 pointer-events-none',menuItemClass)} asChild>
          <div className={cn('flex flex-col items-end justify-end w-full gap-0.5 text-sm ')}>
            <span className='self-start font-medium'>{user.displayName}</span>
            <span className='self-start text-neutral-500'>{user.email}</span>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className={menuItemClass} asChild>
          <Link href='/settings'>Settings</Link>
        </DropdownMenuItem>
        <DropdownMenuItem className={menuItemClass} onClick={handleLogout}>
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
