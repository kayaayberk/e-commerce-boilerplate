'use client'

import { useModalStore } from '@/lib/stores/modalStore'
import { Button } from '../ui/button'

export function AuthActions() {
  const openModal = useModalStore((s) => s.openModal)

  return (
    <div className='flex items-center space-x-4'>
      <Button className='leading-[18px]' onClick={() => openModal('login')}>
        Log In
      </Button>
      <Button
        className='leading-[18px] hover:text-white'
        // isAnimated={false}
        onClick={() => openModal('signup')}
      >
        Sign Up
      </Button>
    </div>
  )
}
