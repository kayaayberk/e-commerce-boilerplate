import { getVercelFlagOverrides } from '@/lib/getVercelFlagOverrides'
import { FlagValues as VercelFlagValues } from '@vercel/flags/react'
import { encrypt, FlagValuesType } from '@vercel/flags'

async function ConfidentialFlagValues({ values }: { values: FlagValuesType }) {
  const encryptedFlagValues = await encrypt(values)
  return <VercelFlagValues values={encryptedFlagValues} />
}

export async function FlagValues() {
  const flags = await getVercelFlagOverrides()

  if (!process.env.FLAGS_SECRET) {
    return null
  }

  return <ConfidentialFlagValues values={flags!} />
}
