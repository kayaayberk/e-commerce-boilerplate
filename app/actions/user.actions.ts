'use server'

import { PlatformUserCreateInput } from '@/packages/core/platform/types'
import { storefrontClient } from '@/clients/storeFrontClient'
import { COOKIE_ACCESS_TOKEN } from '@/constants'
import { deleteUserFromDb, insertUserToDb } from '@/lib/queries'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'


export async function signupUser({
  email, password, firstName, lastName, phone, acceptsMarketing,
}: {
  email: string; password: string; firstName: string; lastName: string; phone: string; acceptsMarketing: boolean
}) {
  const createUser = await storefrontClient.createUser({ email, password, firstName, lastName, phone, acceptsMarketing})

  if (!createUser) return

  await insertUserToDb(createUser)

  return createUser
}

export async function loginUser({ email, password }: { email: string; password: string }) {
  const user = await storefrontClient.createUserAccessToken({ email, password })

  cookies().set(COOKIE_ACCESS_TOKEN, user?.accessToken || '', { expires: new Date(user?.expiresAt || '') })

  return user
}

export async function getCurrentUser() {
  const accessToken = cookies().get(COOKIE_ACCESS_TOKEN)?.value

  const user = await storefrontClient.getUser(accessToken || '')

  return user
}

export async function updateUser(input: Pick<PlatformUserCreateInput, 'firstName' | 'lastName' | 'phone' | 'acceptsMarketing'>) {
  const accessToken = cookies().get(COOKIE_ACCESS_TOKEN)?.value

  const user = await storefrontClient.updateUser(accessToken!, { ...input })
  return user
}

export async function logoutUser() {
  cookies().delete(COOKIE_ACCESS_TOKEN)
}

export async function deleteUser(id: string) {
  await storefrontClient.deleteUser(id)

  await deleteUserFromDb(id)
  
  cookies().delete(COOKIE_ACCESS_TOKEN)

  return redirect('/')
}

