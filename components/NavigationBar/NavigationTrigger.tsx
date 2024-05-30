import { NavigationMenuTrigger, navigationMenuTriggerStyle } from '../ui/navigation-menu'
import { type NavTrigger } from './types'
import { Button } from '../ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export function NavigationTrigger({ trigger }: { trigger: NavTrigger }) {
  return (
    <Link href={trigger.href}>
      {trigger.submenu ? (
        <NavigationMenuTrigger>{trigger.text}</NavigationMenuTrigger>
      ) : (
        <Button className={cn(navigationMenuTriggerStyle(), 'text-blck')}>{trigger.text}</Button>
      )}
    </Link>
  )
}
