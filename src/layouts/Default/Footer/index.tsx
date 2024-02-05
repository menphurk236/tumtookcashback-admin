import { Fragment, useEffect, useState } from 'react'

import clsx from 'clsx'

import Container from '@/components/Container'

import lineDesktop from '@/assets/line-desktop.png'
import lineMobile from '@/assets/line-mobile.png'

const Footer = () => {
  const [width, setWindowWidth] = useState(0)

  useEffect(() => {
    updateDimensions()

    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])
  const updateDimensions = () => {
    const width = window.innerWidth
    setWindowWidth(width)
  }

  const responsive = width > 1023
  return (
    <Fragment>
      <footer className={clsx(`fixed bottom-0 z-20 w-full`)}>
        <a href="https://www.tumtook.com/addline/" target={`_blank`} className={clsx(`no-underline`)}>
          <img src={responsive ? lineDesktop : lineMobile} />
        </a>
        <Container className={clsx(`flex items-center`)}>
          {/*<a*/}
          {/*  href="https://page.line.me/tumtook?openQrModal=true"*/}
          {/*  target={`_blank`}*/}
          {/*  className={clsx(`mr-2 rounded-xl bg-green-500 px-3 py-2 text-white-900 no-underline`)}*/}
          {/*>*/}
          {/*  <span>Line ID: @Tumtook</span>*/}
          {/*</a>*/}
          {/*<div className={clsx(`flex`)}>*/}
          {/*  <img src={lineDesktop} className={clsx(`w-5`)} />*/}
          {/*  <span className={clsx(``)}>0899008888</span>*/}
          {/*</div>*/}
        </Container>
      </footer>
    </Fragment>
  )
}

export default Footer
