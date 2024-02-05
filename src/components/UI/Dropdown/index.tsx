import type { FC, HTMLAttributes, ReactNode } from 'react'
import { Fragment, useEffect } from 'react'

import { Float } from '@headlessui-float/react'
import { Menu } from '@headlessui/react'
import { IoChevronDown } from '@react-icons/all-files/io5/IoChevronDown'
import clsx from 'clsx'

import Divider from '../Divider'
import Button from '../Button'
import type { ButtonProps } from '../Button/types'

import { useIsMounted } from '@/hooks'
import type { Placement } from '@/types/float'

export interface IDropdownProps {
  button?: ReactNode
  buttonProps?: ButtonProps
  items?: JSX.Element | JSX.Element[]
  showCaret?: boolean
  className?: string
  dialogClassName?: string
  placement?: Placement
  onClose?: () => void
}

export const DropdownDivider: FC<HTMLAttributes<HTMLDivElement>> = ({ className }) => {
  return (
    <div className={clsx('dropdown-divider', className)}>
      <Divider />
    </div>
  )
}

const Dropdown: FC<IDropdownProps> = ({
  button = 'button',
  buttonProps,
  items,
  showCaret = true,
  className,
  dialogClassName,
  placement = 'bottom-end',
  onClose,
}) => {
  const { isMounted } = useIsMounted()

  return (
    <Fragment>
      {!isMounted ? (
        <div className={className}>
          <Button {...buttonProps}>
            {button} {showCaret && <IoChevronDown className={clsx(`dropdown-caret-icon`)} />}
          </Button>
        </div>
      ) : (
        <Menu as="div" className={clsx(`dropdown`)}>
          {({ open }) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            useEffect(() => {
              if (!open) onClose?.()
            }, [open])

            return (
              <Float
                as={Fragment}
                placement={placement}
                offset={3}
                shift={5}
                flip={5}
                enter="dropdown-transition-enter"
                enterFrom="dropdown-transition-enter-from"
                enterTo="dropdown-transition-enter-to"
                leave="dropdown-transition-leave"
                leaveFrom="dropdown-transition-leave-from"
                leaveTo="dropdown-transition-leave-to"
                tailwindcssOriginClass
              >
                <Menu.Button as="div" className={className} role="button" aria-label="dropdown">
                  <Button {...buttonProps}>
                    {button} {showCaret && <IoChevronDown className={clsx(`dropdown-caret-icon`)} />}
                  </Button>
                </Menu.Button>
                <Menu.Items className={clsx(`dropdown-dialog`, dialogClassName)}>
                  <div className={clsx(`dropdown-dialog-container`)}>{items}</div>
                </Menu.Items>
              </Float>
            )
          }}
        </Menu>
      )}
    </Fragment>
  )
}

export default Dropdown
