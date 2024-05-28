import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'

export function CallToAction() {
  return (
    <div className='border-y border-black w-full'>
      <div className='flex justify-center md:justify-end w-full'>
        <div className='flex flex-col items-start gap-8 w-full xl:w-2/3'>
          <div>
            <p className='text-xl font-bold tracking-tighter sm:text-2xl md:text-3xl'>
              Become a member and receive our special discounts.
            </p>
          </div>
          <div className='w-full'>
            <form className='flex flex-col gap-4'>
              <Label>
                <span className='sr-only'>Email</span>
                <Input placeholder='Email' type='email' />
              </Label>
              <Button size='lg' className='w-fit bg-white text-center text-black'>
                Become a Member
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
