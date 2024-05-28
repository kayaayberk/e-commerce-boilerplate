import { CallToAction } from '../CallToAction/CallToAction'
import { Icons } from '../Icons/Icons'
import Link from 'next/link'

export function Footer() {
  return (
    <div className='bg-black text-white'>
      <div className='mx-auto flex w-full max-w-container-md flex-col justify-between px-4 xl:px-0'>
        <header className='flex justify-end gap-4 pt-8'>
          <Link prefetch={false} target='_blank' href='#' aria-label='Facebook link'>
            <Icons.Facebook className='text-white' />
          </Link>

          <Link prefetch={false} target='_blank' href='#' aria-label='Twitter link'>
            <Icons.Twitter className='text-white' />
          </Link>

          <Link prefetch={false} target='_blank' href='#' aria-label='Instagram link'>
            <Icons.Instagram className='text-white' />
          </Link>

          <Link prefetch={false} target='_blank' href='#' aria-label='Linkedin link'>
            <Icons.Linkedin className='text-white' />
          </Link>

          <Link prefetch={false} target='_blank' href='#' aria-label='Youtube link'>
            <Icons.Youtube className='text-white' />
          </Link>
        </header>
        <main className='flex flex-col md:flex-row md:items-start items-center justify-between py-20 px-10 md:px-0'>
          <div className='whitespace-nowrap w-full'>
            <Link href='https://v0.dev/' target='_blank'>
              <span className='mb-4 inline-flex w-fit items-center whitespace-nowrap rounded-full border border-transparent bg-white px-2.5 py-0.5 text-xs font-semibold text-black transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'>
                Designed by v0
              </span>
            </Link>
            <p className='text-3xl font-bold'>Missing feature? </p>
            <p className='mt-1 text-xl'>
              <a className='p-1 underline' href='mailto:contact@blazity.com'>
                Let us know
              </a>
              , we&apos;ll build it!
            </p>
          </div>
          <CallToAction />
        </main>
        <footer className='mt-auto flex flex-col items-center justify-between pb-8 text-neutral-300 md:flex-row'>
          <span className='text-sm'>2024 © Lorem Ipsum. All Rights Reserved.</span>
          <div className='mt-4 flex space-x-4 md:mt-0'>
            <Link prefetch={false} className='text-sm hover:underline' href='/privacy-policy'>
              Privacy and Cookie Policy
            </Link>
            <Link prefetch={false} className='text-sm hover:underline' href='/terms-conditions'>
              Terms & Conditions
            </Link>
          </div>
        </footer>
      </div>
    </div>
  )
}
