import Link from 'next/link'
import { NavigationMenuLink, NavigationMenuTrigger } from '../ui/navigation-menu'
import { type NavTrigger } from './types'

export function NavigationTrigger({ trigger }: { trigger: NavTrigger }) {
  console.log('trigger', trigger)
  return (
    <Link href={trigger.href}>
      <NavigationMenuTrigger>{trigger.text}</NavigationMenuTrigger>
    </Link>
  )
}
