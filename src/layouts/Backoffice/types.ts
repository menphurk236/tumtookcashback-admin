import type { HTMLAttributes, ReactNode } from 'react'

export interface IBackofficeLayoutSubMenu {
  label: string
  path: string
}

export interface IBackofficeLayoutMenuItem extends Omit<IBackofficeLayoutSubMenu, 'path'> {
  key: string
  iconName: string
  path?: string
  items?: IBackofficeLayoutSubMenu[]
}

export interface IBackofficeLayoutProps extends HTMLAttributes<HTMLDivElement> {
  menu?: IBackofficeLayoutMenuItem[]
  urlPathname?: string
  navbar?: ReactNode
  homePath?: string
}
