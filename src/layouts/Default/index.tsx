import type { FC } from 'react'
import { Fragment } from 'react'

import clsx from 'clsx'
import { Outlet } from 'react-router'

import Footer from '@/layouts/Default/Footer'

import type { IDefaultLayoutProps } from './types.ts'
import Header from '../Default/Header'

import { Layout } from '@/enums'

const DefaultLayout: FC<IDefaultLayoutProps> = ({ className }) => {
  return (
    <Fragment>
      <Header />
      <main className={clsx(`relative z-10`, className)}>
        <Outlet />
      </main>
      <Footer />
    </Fragment>
  )
}

DefaultLayout.displayName = Layout.DEFAULT

export default DefaultLayout
