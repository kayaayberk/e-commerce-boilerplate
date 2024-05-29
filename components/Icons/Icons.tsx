// prettier-ignore
import { ArrowLeft, ChevronDown, CircleUserRound, Facebook, Heart, Instagram, Link, Linkedin, LoaderCircle, LucideProps, PencilLine, Search, Slash, SlidersHorizontal, Twitter, X, Youtube } from 'lucide-react'
import { Logo } from '../Logo/Logo'
// prettier-ignore
export const Icons = {
  Filters:     (props: LucideProps) => <SlidersHorizontal {...props} />,
  User:        (props: LucideProps) => <CircleUserRound {...props} />,
  Spinner:     (props: LucideProps) => <LoaderCircle {...props} />,
  ChevronDown: (props: LucideProps) => <ChevronDown {...props} />,
  Edit:        (props: LucideProps) => <PencilLine {...props} />,
  Instagram:   (props: LucideProps) => <Instagram {...props} />,
  ArrowLeft:   (props: LucideProps) => <ArrowLeft {...props} />,
  Linkedin:    (props: LucideProps) => <Linkedin {...props} />,
  Facebook:    (props: LucideProps) => <Facebook {...props} />,
  Youtube:     (props: LucideProps) => <Youtube {...props} />,
  Twitter:     (props: LucideProps) => <Twitter {...props} />,
  Search:      (props: LucideProps) => <Search {...props} />,
  Slash:       (props: LucideProps) => <Slash {...props} />, 
  Heart:       (props: LucideProps) => <Heart {...props} />,
  X:           (props: LucideProps) => <X {...props} />,
  Logo:        (props: LucideProps) => <Logo />,
}
