import type { FC } from 'react'

import clsx from 'clsx'

import LogoImage from '../../../assets/tumtook-logo-full.png'
import LogoWhiteImage from '../../../assets/tumtook-logo-full-white.png'
import LogoRedImage from '../../../assets/TumtookNewLogo.png'

interface ILogoProps {
  imageClassName?: string
  className?: string
  type?: 'white' | 'red' | 'default'
}

const Logo: FC<ILogoProps> = ({ className, imageClassName, type = 'white' }) => {
  return (
    <div className={clsx(`logo`, className)}>
      <img
        src={type === 'white' ? LogoWhiteImage : type === 'red' ? LogoRedImage : LogoImage}
        className={clsx(`logo-img`, imageClassName)}
      />
    </div>
  )
}

export default Logo
