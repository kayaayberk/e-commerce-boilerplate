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
import { useToast } from '../ui/use-toast'

const passwordRegexp = new RegExp(/(?=.*\d)(?=.*\W)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/)
const phoneRegexp = new RegExp(/^\+(?:[0-9]?){6,14}[0-9]$/)

const formSchema = z.object({
  email: z.string().email().min(3).max(64),
  password: z.string().min(8).max(20).regex(passwordRegexp, 'Password must have at least one number, one symbol, one uppercase letter, and be at least 8 characters'),
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

function SignupModal() {
  const setUser = useUserStore((s) => s.setUser)
  const { toast } = useToast()

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
    console.log(user)
    if (user) {
      const currentUser = await getCurrentUser()
      currentUser && setUser(currentUser)

      toast({
        title: 'Account created.',
        description: "You've successfully created an account.",
        variant: 'default',
      })
      return
    }

    toast({
      title: 'Problem creating account.',
      description: 'There was a problem creating your account. Please try again.',
      variant: 'destructive',
    })
  }

  return (
    <Form {...form}>
      <form name='loginForm' id='loginForm' onSubmit={form.handleSubmit(onSubmit)} className='space-y-1'>
        {formFields.map((singleField) => (
          <FormField
            key={singleField.name}
            control={form.control}
            name={singleField.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{singleField.label}</FormLabel>
                <FormControl>
                  <Input type={singleField.type} className='text-sm' placeholder={singleField.placeholder} {...field} />
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
        <Button size='lg' form='loginForm' className='hover:text-white' variant='secondary' type='submit' disabled={form.formState.isSubmitting}>
          Submit
        </Button>
      </form>
    </Form>
  )
}

export default SignupModal
