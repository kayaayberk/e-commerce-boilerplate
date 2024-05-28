import { GenericModal } from '../GenericModal/GenericModal'
import { deleteUser } from '@/app/actions/user.actions'
import { useModalStore } from '@/lib/stores/modalStore'
import { useUserStore } from '@/lib/stores/userStore'
import { Icons } from '../Icons/Icons'
import { Button } from '../ui/button'
import { sleep } from '@/lib/utils'
import { toast } from 'sonner'
import React from 'react'
import { redirect } from 'next/navigation'

export function DeleteAccountModal() {
  const user = useUserStore((s) => s.user)
  const closeModal = useModalStore((s) => s.closeModal)
  const modals = useModalStore((s) => s.modals)
  const [isPending, startTransition] = React.useTransition()

  if (!user) return null

  return (
    <GenericModal
      title='Are you absolutely sure?'
      open={!!modals['delete-account']}
      onOpenChange={() => closeModal('delete-account')}
    >
      <div className='w-'>
        <div className='flex flex-col gap-4'>
          <p className='text-sm font-light leading-tight tracking-wide text-muted-foreground'>
            This action cannot be undone. This will permanently delete your account and remove your
            data from our servers.
          </p>
          <div className='flex justify-end gap-2'>
            <Button onClick={() => closeModal('delete-account')}>Cancel</Button>
            <Button
              disabled={isPending}
              onClick={(e) => {
                e.preventDefault()
                startTransition(async () => {
                  await deleteUser(user.id)
                    .then(() => toast.success('Account deleted successfully'))
                    .then(() => closeModal('delete-account'))
                    .then(() => window.location.href = '/')
                })
              }}
              variant='destructive'
            >
              <span className='flex items-center gap-1'>
                {isPending ? (
                  <Icons.Spinner className='animate-spin' />
                ) : (
                  <span>Delete Account</span>
                )}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </GenericModal>
  )
}
