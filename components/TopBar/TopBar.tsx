import { ProfileMenu } from '../ProfileMenu/ProfileMenu'
import Link from 'next/link'

export async function TopBar() {
  return (
    <header className='hidden bg-white py-4 md:block'>
      <div className='mx-auto flex max-w-container-md items-center justify-between px-4'>
        <Link prefetch={false} href='/' className='text-3xl font-bold'>
          Commerce
        </Link>

        <ProfileMenu />
      </div>
    </header>
  )
}
