import { NavigationBar } from './NavigationBar'
import { Favorites } from './Favorites'
import { Suspense } from 'react'
import { Cart } from './Cart'
import { Autocomplete } from './Autocomplete'

function NavigationItems() {
  return (
    <div className='sticky top-0 z-10 mx-auto w-full border-y  border-black bg-white'>
      <div className='mx-auto flex max-w-container-md items-center justify-between p-4'>
        <NavigationBar />
        <div className='flex items-center gap-5'>
          <Autocomplete />
          <Favorites />
          <Suspense>
            <Cart />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default NavigationItems
