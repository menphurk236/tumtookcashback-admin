import type { MouseEvent } from 'react'
import { Fragment, useMemo, createElement, forwardRef } from 'react'

import clsx from 'clsx'

import SvgIcon from '../SvgIcon'
import type { Button as TypeButton, ButtonProps } from './types'

import './styles.scss'

export type ButtonRef = HTMLButtonElement

const Button = forwardRef<TypeButton, ButtonProps>(
  (
    {
      as = 'button',
      variant = 'default',
      className,
      children,
      onClick,
      buttonType = 'default',
      rounder = 'lg',
      size = 'default',
      loading,
      disabled,
      active,
      isOutline,
      isInvert,
      ...props
    },
    ref,
  ) => {
    const renderChildren = useMemo(
      () => (
        <Fragment>
          {loading && <SvgIcon name="loader" className="loader-icon" />}
          {typeof children === 'string' ? <span>{children}</span> : children}
        </Fragment>
      ),
      [children, loading],
    )

    return createElement(
      as,
      {
        ref,
        className: clsx(
          `button`,
          [variant],
          `focus:outline-none disabled:cursor-not-allowed disabled:opacity-50`,
          className,
          [`button-type-${buttonType}`],
          [`button-rounder-${rounder}`],
          [`button-size-${size}`],
          {
            'button-loading': loading,
            active: active,
            'button-outline': isOutline,
            'button-invert': isInvert,
          },
        ),
        onClick: (e: MouseEvent<HTMLButtonElement, MouseEvent> | MouseEvent<HTMLAnchorElement, MouseEvent>) => {
          if (!disabled && onClick) onClick(e)
        },
        disabled: loading || disabled,
        ...props,
      },
      renderChildren,
    )
  },
)

Button.displayName = 'Button'

export default Button
