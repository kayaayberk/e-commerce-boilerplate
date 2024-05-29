import { PlatformUser } from '@/packages/core/platform/types'
import { platformUser } from '@/db/schema'
import { normalizeUserId } from './utils'
import { db } from '@/db'
import { eq } from 'drizzle-orm'

export async function insertUserToDb(user: Pick<PlatformUser, 'id' | 'displayName' | 'email' | 'firstName' | 'lastName' | 'phone' | 'acceptsMarketing'>) {
  if (!user) return

  const { id: userId, ...rest } = user

  if(!userId) return

  return db.insert(platformUser).values({ id: normalizeUserId(userId), ...rest }).onConflictDoUpdate({ target: platformUser.id, set: { id: normalizeUserId(userId), ...rest } })
}


export async function deleteUserFromDb(id: string) {
  if (!id) return

  return db.delete(platformUser).where(eq(platformUser.id, normalizeUserId(id)))
}