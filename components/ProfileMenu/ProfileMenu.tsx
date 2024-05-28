'use client'

import { getCurrentUser } from 'app/actions/user.actions'
import { useUserStore } from '@/lib/stores/userStore'
import { useEffect, useTransition } from 'react'
import { AuthActions } from './AuthActions'
import { Skeleton } from '../ui/skeleton'
import dynamic from 'next/dynamic'

const ProfileBar = dynamic(() => import('./ProfileBar'), { ssr: false, loading: ActionsSkeleton })

export function ProfileMenu() {
  const { user, setUser } = useUserStore()
  const [_, startTransition] = useTransition()

  useEffect(() => {
    if (user) return

    startTransition(async () => {
      const currentUser = await getCurrentUser()
      currentUser && setUser(currentUser ?? null)
    })
  }, [setUser, user])

  return (
    <>
      {user ? (
        <ProfileBar user={user} />
      ) : (
        <div className='flex items-center space-x-6'>
          <AuthActions />
        </div>
      )}
    </>
  )
}

function ActionsSkeleton() {
  return <Skeleton className='h-[35px] w-[250px]' />
}
