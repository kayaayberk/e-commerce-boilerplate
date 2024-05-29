import { NavigationMenuContent, NavigationMenuLink } from '../ui/navigation-menu'
import { NavigationSubmenuItems } from './NavigationSubmenuItems'
import { ImageGridItem, Submenu, TextGridItem, TextImageGridItem } from './types'

export function NavigationTriggerContent({ submenu }: { submenu: Submenu }) {
  return (
    <>
      {submenu.variant === 'text-grid' ? (
        <NavigationMenuContent className='grid grid-cols-1 gap-40 p-4 md:grid-cols-3 min-w-max'>
         {(submenu.items as TextGridItem[]).map((item, index) => (
            <NavigationSubmenuItems
              key={index}
              submenuItems={item}
              variant='text-grid'
            />
          
         ))}
        </NavigationMenuContent>





      ) : submenu.variant === 'image-grid' ? (
        <NavigationMenuContent className='grid grid-cols-1 gap-3 p-4 md:grid-cols-4 min-w-max'>
         {(submenu.items as ImageGridItem[]).map((item, index) => (
            <NavigationSubmenuItems
              key={index}
              submenuItems={item}
              variant='image-grid'
            />
          
         ))}
        </NavigationMenuContent>





      ) : submenu.variant === 'text-image-grid' ? (
        <NavigationMenuContent className='grid grid-cols-1 gap-3 p-4 md:grid-cols-2 min-w-max'>
         {(submenu.items as TextImageGridItem[]).map((item, index) => (
            <NavigationSubmenuItems
              key={index}
              submenuItems={item}
              variant='text-image-grid'
            />
          
         ))}
        </NavigationMenuContent>





      ) : null}

    </>
  )
}
