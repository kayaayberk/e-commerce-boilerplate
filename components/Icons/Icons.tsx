import { ArrowLeft, ChevronDown, Heart, LoaderCircle, LucideProps, Search, Slash, SlidersHorizontal, X } from 'lucide-react'

// prettier-ignore
export const Icons = {
  Filters:     (props: LucideProps) => <SlidersHorizontal {...props} />,
  Spinner:     (props: LucideProps) => <LoaderCircle {...props} />,
  ChevronDown: (props: LucideProps) => <ChevronDown {...props} />,
  ArrowLeft:   (props: LucideProps) => <ArrowLeft {...props} />,
  Search:      (props: LucideProps) => <Search {...props} />,
  Slash:       (props: LucideProps) => <Slash {...props} />, 
  Heart:       (props: LucideProps) => <Heart {...props} />,
  X:           (props: LucideProps) => <X {...props} />,
}
