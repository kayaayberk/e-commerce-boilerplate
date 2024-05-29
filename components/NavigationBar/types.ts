import { StaticImageData } from "next/image";

export interface NavTrigger {
  text: string
  href: string
  submenu?: Submenu
}

export type Submenu =
  | { variant: 'text-grid'; items: TextGridItem[] }
  | { variant: 'image-grid'; items: ImageGridItem[] }
  | { variant: 'text-image-grid'; items: TextImageGridItem[] }

export interface TextGridItem {
  text: string
  items: { text: string; href: string }[]
}

export interface ImageGridItem {
  href: string
  image: StaticImageData
  text: string
}

export interface TextImageGridItem {
  href: string
  image?: StaticImageData
  text: string
}
