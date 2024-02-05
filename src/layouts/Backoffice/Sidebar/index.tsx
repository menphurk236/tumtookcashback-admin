import type { FC } from 'react'
import { useCallback, Fragment, useMemo } from 'react'

import clsx from 'clsx'
import { Disclosure } from '@headlessui/react'
import { IoChevronBack } from '@react-icons/all-files/io5/IoChevronBack'
import { useLocation } from 'react-router'
import { Link } from 'react-router-dom'

import { Logo, SvgIcon } from '@/components/UI'

import type { IBackofficeLayoutMenuItem } from '../types'

interface IBackofficeSidebarProps {
  isShowSidebar?: boolean
  menu: IBackofficeLayoutMenuItem[]
  urlPathname?: string
  onClickLink?: VoidFunction
  homePath?: string
}

const BackofficeSidebar: FC<IBackofficeSidebarProps> = ({
  isShowSidebar = false,
  menu,
  onClickLink,
  homePath = '/',
}) => {
  const { pathname } = useLocation()
  // _Callback
  const getIsActive = useCallback(
    (path: string) => {
      if (path === '/backoffice' || path === '/backoffice/dashboard') {
        return pathname === path || pathname === path + '/'
      }
      return pathname.includes(path)
    },
    [pathname],
  )

  // _Memo
  const renderMenu = useMemo(() => {
    return (
      <Fragment>
        {menu.map((item, itemIdx) => (
          <div key={`menu-${itemIdx}`} className={clsx(`backoffice-sidebar-menu`)}>
            {item.path ? (
              <Link
                to={item.path}
                className={clsx(`backoffice-sidebar-menu-link`, {
                  active: getIsActive(item.path),
                })}
                onClick={() => onClickLink?.()}
              >
                <SvgIcon name={item.iconName} />
                <span>{item.label}</span>
              </Link>
            ) : (
              <Disclosure defaultOpen={!!item?.items?.find((e) => e.path === pathname)}>
                <Disclosure.Button
                  className={clsx(`backoffice-sidebar-menu-link`, {
                    active: getIsActive(item.path),
                    'root-active': !!item?.items?.find((e) => e.path === pathname),
                  })}
                >
                  <SvgIcon name={item.iconName} />
                  <span>{item.label}</span>

                  <IoChevronBack className={clsx(`menu-caret`)} />
                </Disclosure.Button>
                <Disclosure.Panel className="text-gray-500">
                  {item.items?.map((submenu, submenuIdx) => (
                    <Link
                      key={`submenu-${submenuIdx}`}
                      to={submenu.path}
                      className={clsx(`backoffice-sidebar-submenu-link`, {
                        active: pathname === submenu.path,
                      })}
                      onClick={() => onClickLink?.()}
                    >
                      <span>{submenu.label}</span>
                    </Link>
                  ))}
                </Disclosure.Panel>
              </Disclosure>
            )}
          </div>
        ))}
      </Fragment>
    )
  }, [getIsActive, menu, onClickLink, pathname])

  return (
    <aside
      className={clsx(`backoffice-sidebar`, {
        active: isShowSidebar,
      })}
    >
      <div className={clsx(`backoffice-sidebar-logo`)}>
        <Link to={homePath} className={clsx(`px-10`)} onClick={() => onClickLink?.()}>
          <Logo type="white" />
        </Link>
      </div>

      {renderMenu}
    </aside>
  )
}

export default BackofficeSidebar
