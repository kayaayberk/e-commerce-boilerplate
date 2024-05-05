import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { getCurrentUser, signupUser } from '@/app/actions/user.actions'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import { register } from 'module'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useUserStore } from '@/lib/stores/userStore'

const passwordRegexp = new RegExp(/(?=.*\d)(?=.*\W)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/)

const formSchema = z.object({
  email: z.string().email().min(3).max(64),
  password: z.string().min(8).max(20).regex(passwordRegexp, 'Password must have at least one number, one symbol, one uppercase letter, and be at least 8 characters'),
  lastName: z.string().min(1).max(64),
})

const formFields = [
  { label: 'Email', name: 'email', type: 'text', placeholder: 'Enter email...' },
  { label: 'Password', name: 'password', type: 'password', placeholder: 'Enter password...' },
  { label: 'Last Name', name: 'lastName', type: 'text', placeholder: 'Enter last name...' },
] as const

function SignupModal() {
  const setUser = useUserStore((s) => s.setUser)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      lastName: '',
    },
  })

  async function onSubmit(payload: z.infer<typeof formSchema>) {
    const { email, password, lastName } = payload
    const user = await signupUser({ email, password, lastName })
    console.log(user)
    if (user) {
      const currentUser = await getCurrentUser()
      currentUser && setUser(currentUser)

      // console.log('User signed up:', user)
      return
    }
    console.log('User signed up:', user)
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
        <Button size='lg' form='loginForm' className='hover:text-white' variant='secondary' type='submit' disabled={form.formState.isSubmitting}>
          Submit
        </Button>
      </form>
    </Form>
  )
}

export default SignupModal
