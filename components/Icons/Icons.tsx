// prettier-ignore
import { ArrowLeft, ChevronDown, Facebook, Heart, Instagram, Link, Linkedin, LoaderCircle, LucideProps, Search, Slash, SlidersHorizontal, Twitter, X, Youtube } from 'lucide-react'
// prettier-ignore
export const Icons = {
  Filters:     (props: LucideProps) => <SlidersHorizontal {...props} />,
  Spinner:     (props: LucideProps) => <LoaderCircle {...props} />,
  ChevronDown: (props: LucideProps) => <ChevronDown {...props} />,
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
}
