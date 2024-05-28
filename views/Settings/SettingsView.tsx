'use client'

import { useUserStore } from '@/lib/stores/userStore'
import { Button } from '@/components/ui/button'
import { ProfileForm } from './ProfileForm'
import { Card } from '@/components/ui/card'
import { useModalStore } from '@/lib/stores/modalStore'

export function SettingsView() {
  const user = useUserStore((s) => s.user)
  const openModal = useModalStore((s) => s.openModal)

  if (!user) return null

  return (
    <div className='mx-auto flex max-w-container-md flex-wrap gap-8 px-4 py-24 text-4xl'>
      <div className='flex w-full items-center justify-between gap-5'>
        <div className=' shrink-0 basis-full md:basis-1/2'>
          <ProfileForm user={user} />
        </div>

        <Card className='flex size-full flex-col justify-between gap-4 p-6'>
          <h1 className='text-4xl font-bold'>{user.displayName}</h1>
          <Button variant='destructive' onClick={() => openModal('delete-account')} className='w-1/4 self-end'>Delete Account</Button>
        </Card>
      </div>
    </div>
  )
}
