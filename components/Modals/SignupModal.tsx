import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { getCurrentUser, signupUser } from '@/app/actions/user.actions'
import { GenericModal } from '../GenericModal/GenericModal'
import { useModalStore } from '@/lib/stores/modalStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { useUserStore } from '@/lib/stores/userStore'
import { useForm } from 'react-hook-form'
import { Switch } from '../ui/switch'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { z } from 'zod'
import { Dialog } from '@radix-ui/react-dialog'
import { DialogFooter } from '../ui/dialog'
import { Icons } from '../Icons/Icons'

const passwordRegexp = new RegExp(/(?=.*\d)(?=.*\W)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/)
const phoneRegexp = new RegExp(/^\+(?:[0-9]?){6,14}[0-9]$/)

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
  firstName: z.string().min(1).max(64),
  lastName: z.string().min(1).max(64),
  phone: z.string().regex(phoneRegexp, 'Number must match E164 format'),
  acceptsMarketing: z.boolean().default(false),
})

const formFields = [
  { label: 'Email', name: 'email', type: 'text', placeholder: 'Enter email...' },
  { label: 'Password', name: 'password', type: 'password', placeholder: 'Enter password...' },
  { label: 'First Name', name: 'firstName', type: 'text', placeholder: 'Enter first name...' },
  { label: 'Last Name', name: 'lastName', type: 'text', placeholder: 'Enter last name...' },
  { label: 'Phone Number', name: 'phone', type: 'text', placeholder: '+47 123123123' },
  {
    label: 'Accept Marketing',
    name: 'acceptsMarketing',
    type: 'checkbox',
    placeholder: 'Accept marketing...',
  },
] as const

export function SignupModal() {
  const modals = useModalStore((s) => s.modals)
  const closeModal = useModalStore((s) => s.closeModal)
  const setUser = useUserStore((s) => s.setUser)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
      acceptsMarketing: false,
    },
  })

  async function onSubmit(payload: z.infer<typeof formSchema>) {
    const { email, password, firstName, lastName, phone, acceptsMarketing } = payload
    console.log('Payload', payload)
    const user = await signupUser({ email, password, firstName, lastName, phone, acceptsMarketing })
    console.log('User', user)
    if (user) {
      const currentUser = await getCurrentUser()
      currentUser && setUser(currentUser)

      closeModal('signup')
      toast.success('You have successfully signed up! You can now log in.')
      return
    }

    toast.error("Couldn't create user. The email address may be already in use.")
  }

  return (
    <GenericModal
      title='Signup'
      open={!!modals['signup']}
      onOpenChange={() => closeModal('signup')}
    >
      <Form {...form}>
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
                <FormItem className='last:mb-2'>
                  <FormLabel>{singleField.label}</FormLabel>
                  <FormControl
                    className={cn(
                      'flex',
                      singleField.name === 'acceptsMarketing' ? 'flex- items-center' : 'flex-col'
                    )}
                  >
                    {singleField.name === 'acceptsMarketing' ? (
                      <Switch
                        id='acceptsMarketing'
                        checked={field.value as boolean | undefined}
                        onCheckedChange={field.onChange}
                        ref={field.ref}
                      />
                    ) : (
                      <Input
                        type={singleField.type}
                        className='text-sm'
                        placeholder={singleField.placeholder}
                        {...field}
                        value={field.value as string}
                      />
                    )}
                  </FormControl>
                  <FormMessage className='text-xs font-normal text-red-400' />
                </FormItem>
              )}
            />
          ))}
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
                  <span>Sign up</span>
                )}
              </span>
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </GenericModal>
  )
}
