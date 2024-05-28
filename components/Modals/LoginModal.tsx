import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { getCurrentUser, loginUser } from 'app/actions/user.actions'
import { GenericModal } from '../GenericModal/GenericModal'
import { useModalStore } from '@/lib/stores/modalStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUserStore } from '@/lib/stores/userStore'
import { useRouter } from 'next/navigation'
import { DialogFooter } from '../ui/dialog'
import { useForm } from 'react-hook-form'
import { Icons } from '../Icons/Icons'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Logo } from '../Logo/Logo'
import { toast } from 'sonner'
import { z } from 'zod'

const passwordRegexp = new RegExp(/(?=.*\d)(?=.*\W)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/)

const formSchema = z.object({
  email: z.string().email().min(3).max(64),
  password: z
    .string()
    .min(8)
    .max(20)
    .regex(
      passwordRegexp,
      'Password must have at least one number, one symbol, one uppercase letter, and be at least 8 characters'
    ),
})

const formFields = [
  { label: 'Email', name: 'email', type: 'text', placeholder: 'Enter email...' },
  { label: 'Password', name: 'password', type: 'password', placeholder: 'Enter password...' },
] as const

export function LoginModal() {
  const router = useRouter()
  const setUser = useUserStore((s) => s.setUser)
  const modals = useModalStore((s) => s.modals)
  const closeModal = useModalStore((s) => s.closeModal)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  async function onSubmit(payload: z.infer<typeof formSchema>) {
    const { email, password } = payload
    const user = await loginUser({ email, password })

    if (user) {
      const currentUser = await getCurrentUser()
      currentUser && setUser(currentUser)

      toast.success('Successfully logged in')
      closeModal('login')
      router.push('/')

      return
    }

    form.setError('root', {
      message: "Couldn't log in. The email address or password is incorrect.",
    })
  }

  return (
    <GenericModal title='Login' open={!!modals['login']} onOpenChange={() => closeModal('login')}>
      <Form {...form}>
        <Logo className='mx-auto size-20' />
        {form.formState.errors.root?.message && (
          <p className='mt-6 w-full text-[14px] leading-tight tracking-tight text-red-400'>
            {form.formState.errors.root?.message}
          </p>
        )}
        <form
          name='loginForm'
          id='loginForm'
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-1'
        >
          {formFields.map((singleField) => (
            <FormField
              key={singleField.name}
              control={form.control}
              name={singleField.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{singleField.label}</FormLabel>
                  <FormControl>
                    <Input
                      type={singleField.type}
                      className='text-sm'
                      placeholder={singleField.placeholder}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className='text-xs font-normal text-red-400' />
                </FormItem>
              )}
            />
          ))}
        </form>
      </Form>

      <DialogFooter>
        <Button
          form='loginForm'
          variant='default'
          type='submit'
          disabled={form.formState.isSubmitting}
        >
          <span className='flex items-center gap-1'>
            {form.formState.isSubmitting ? (
              <Icons.Spinner className='animate-spin' />
            ) : (
              <span>Login</span>
            )}
          </span>
        </Button>
      </DialogFooter>
    </GenericModal>
  )
}
