'use client'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { getCurrentUser, updateUser } from 'app/actions/user.actions'
import { PlatformUser } from '@/packages/core/platform/types'
import { CheckedState } from '@radix-ui/react-checkbox'
import { useUserStore } from '@/lib/stores/userStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { Checkbox } from '@/components/ui/checkbox'
import { Icons } from '@/components/Icons/Icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { z } from 'zod'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import React from 'react'

const formSchema = z.object({
  firstName: z.string().max(64).optional(),
  lastName: z.string().max(64).optional(),
  phone: z
    .string()
    .regex(/^\+(?:[0-9]?){6,14}[0-9]$/, 'Number must match E164 format')
    .optional(),
  email: z.string().email().max(64).optional(),
  acceptsMarketing: z.boolean(),
  password: z.string().min(8).max(20),
})

const formFields = [
  { label: 'Email', name: 'email', type: 'text', placeholder: 'Enter email...' },
  { label: 'Password', name: 'password', type: 'password', placeholder: 'Enter password...' },
  { label: 'First Name', name: 'firstName', type: 'text', placeholder: 'Enter first name...' },
  { label: 'Last Name', name: 'lastName', type: 'text', placeholder: 'Enter last name...' },
  { label: 'Phone Number', name: 'phone', type: 'text', placeholder: 'Enter phone number...' },
  {
    label: 'Marketing Consent',
    name: 'acceptsMarketing',
    type: 'checkbox',
    placeholder: 'Accept marketing...',
  },
] as const

export function ProfileForm({ user }: { user: PlatformUser }) {
  const [isDisabled, setIsDisabled] = React.useState(true)
  const setUser = useUserStore((s) => s.setUser)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      firstName: user.firstName ?? undefined,
      lastName: user.lastName ?? undefined,
      phone: user.phone ?? undefined,
      email: user.email ?? undefined,
      acceptsMarketing: user.acceptsMarketing,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('values', values)
    const hasAnyFilledIn = Object.values(values).find(Boolean)
    if (!hasAnyFilledIn) return

    const user = await updateUser(values)

    if (user?.id) {
      const currentUser = await getCurrentUser()
      currentUser && setUser(currentUser)

      toast.success('Updated the profile details')
      return
    }

    toast.error('Failed to update the profile details')
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <CardTitle>Edit profile</CardTitle>

        <Button onClick={() => setIsDisabled(!isDisabled)} className='space-x-1' variant='ghost'>
          <span>Edit</span> <Icons.Edit size={15} />
        </Button>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            name='editProfileForm'
            id='editProfileForm'
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
                    <FormLabel className='mt-4 flex items-center justify-between'>
                      {singleField.label}
                    </FormLabel>
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
                        <div>
                          <Input
                            key={singleField.name}
                            disabled={isDisabled}
                            type={singleField.type}
                            className='text-sm'
                            placeholder={singleField.placeholder}
                            {...field}
                            value={field.value as string}
                          />
                        </div>
                      )}
                    </FormControl>
                    <FormMessage className='text-xs font-normal text-red-400' />
                  </FormItem>
                )}
              />
            ))}
          </form>
        </Form>
      </CardContent>
      <CardFooter className='flex items-center justify-end space-x-4 leading-4'>
        <Button
          size='default'
          className='bg-green-400 text-white hover:bg-green-500'
          variant='secondary'
          type='submit'
          form='editProfileForm'
          disabled={form.formState.isSubmitting || isDisabled}
        >
          <span className='flex items-center gap-1'>
            Save changes {form.formState.isSubmitting && <Icons.Spinner className='animate-spin' />}
          </span>
        </Button>
      </CardFooter>
    </Card>
  )
}
