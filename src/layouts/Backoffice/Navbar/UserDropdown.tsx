import type { FC, ReactNode } from 'react'
import { useCallback, Fragment } from 'react'

import { Menu } from '@headlessui/react'
import clsx from 'clsx'
import { Link } from 'react-router-dom'

import type { ButtonProps } from '@/components/UI/Button/types'
import Dropdown, { DropdownDivider } from '@/components/UI/Dropdown'
import { useUserStore } from '@/stores/user'
import { useAuthStore } from '@/stores/auth'

interface IUserDropdownProps {
  button?: ReactNode
  showCaret?: boolean
  buttonProps?: ButtonProps
}

const UserDropdown: FC<IUserDropdownProps> = ({ button, buttonProps, showCaret = false }) => {
  const { clear } = useUserStore()
  const { logout } = useAuthStore()

  // _Callbacks
  const onLogout = useCallback(() => {
    clear()
    logout()
  }, [clear, logout])

  return (
    <Dropdown
      button={button ?? <div className={clsx(`bg-gradient-primary rounded-full square-8`)}></div>}
      buttonProps={{
        ...(buttonProps
          ? buttonProps
          : {
              size: 'small',
              className: clsx(`!p-0`),
            }),
      }}
      className={clsx(`flex items-center`)}
      showCaret={showCaret}
      items={
        <Fragment>
          <Menu.Item>
            {() => (
              <Link to="/backoffice/dashboard" className={clsx(`dropdown-dialog-item !min-h-[0px] !w-[180px]`)}>
                <span>Dashboard</span>
              </Link>
            )}
          </Menu.Item>
          <DropdownDivider />
          <Menu.Item>
            {() => (
              <button className={clsx(`dropdown-dialog-item !min-h-[0px] !w-[180px]`)} onClick={() => onLogout()}>
                <span>ออกจากระบบ</span>
              </button>
            )}
          </Menu.Item>
        </Fragment>
      }
    />
  )
}

export default UserDropdown
