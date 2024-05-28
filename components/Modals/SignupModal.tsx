import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { getCurrentUser, signupUser } from '@/app/actions/user.actions'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useUserStore } from '@/lib/stores/userStore'
import { Checkbox } from '../ui/checkbox'
import { CheckedState } from '@radix-ui/react-checkbox'
import { toast } from 'sonner'
import { GenericModal } from '../GenericModal/GenericModal'
import { useModalStore } from '@/lib/stores/modalStore'

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
  // acceptsMarketing: z.boolean().default(false),
})

const formFields = [
  { label: 'Email', name: 'email', type: 'text', placeholder: 'Enter email...' },
  { label: 'Password', name: 'password', type: 'password', placeholder: 'Enter password...' },
  { label: 'First Name', name: 'firstName', type: 'text', placeholder: 'Enter first name...' },
  { label: 'Last Name', name: 'lastName', type: 'text', placeholder: 'Enter last name...' },
  { label: 'Phone Number', name: 'phone', type: 'text', placeholder: 'Enter phone number...' },
] as const
// const checkboxFields = [{ label: 'Accept Marketing', name: 'acceptsMarketing', type: 'checkbox', placeholder: 'Accept marketing...' }] as const

export function SignupModal() {
  const modals = useModalStore((s) => s.modals)
  const setUser = useUserStore((s) => s.setUser)
  const closeModal = useModalStore((s) => s.closeModal)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      phone: '',
      // acceptsMarketing: false,
    },
  })

  async function onSubmit(payload: z.infer<typeof formSchema>) {
    const { email, password, firstName, lastName, phone } = payload
    const user = await signupUser({ email, password, firstName, lastName, phone })
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
          {/* {checkboxFields.map((singleField) => (
          <FormField
            key={singleField.name}
            control={form.control}
            name={singleField.name}
            render={({ field: { value, ref, onChange } }) => (
              <FormItem>
                <FormLabel>{singleField.label}</FormLabel>
                <FormControl>
                  <Checkbox checked={value as CheckedState} onCheckedChange={onChange} ref={ref} />
                </FormControl>
                <FormMessage className='text-xs font-normal text-red-400' />
              </FormItem>
            )}
          />
        ))} */}
          <Button
            size='lg'
            form='loginForm'
            className='hover:text-white'
            variant='secondary'
            type='submit'
            disabled={form.formState.isSubmitting}
          >
            Submit
          </Button>
        </form>
      </Form>
    </GenericModal>
  )
}
