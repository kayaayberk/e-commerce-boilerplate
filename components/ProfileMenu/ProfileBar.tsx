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
      <DropdownMenuTrigger className='flex items-center bg-transparent gap-2 rounded-lg hover:bg-neutral-100 py-2 px-3'>
        <Icons.User className='h-8 w-8' strokeWidth={1.5} />
        <div className='flex flex-col items-start gap-0.5 text-sm tracking-normal leading-none'>
          <span className='font-medium'>{user.displayName}</span>
          <span className='text-neutral-500'>{user.email}</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className='my-0 w-[240px] rounded-b-md bg-white p-0 text-neutral-500 shadow-lg'
        align='end'
      >
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
