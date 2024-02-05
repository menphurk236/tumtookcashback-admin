import type { Dispatch, FC, SetStateAction } from 'react'
import { useCallback, createContext, useState, useEffect } from 'react'

import clsx from 'clsx'
import { Outlet, useNavigate } from 'react-router'

import { BACKOFFICE_SIDEBAR_CONFIG } from '@/constants/backoffice/sidebar'
import { AuthService } from '@/services'

import type { IBackofficeLayoutProps } from './types'
import TopNavbar from './TopNavbar'
import BackofficeLayoutNavbar from './Navbar'
import BackofficeSidebar from './Sidebar'

import { useAuthentication } from '@/hooks'

interface IBackofficeLayoutContext {
  setSimplePageLoadingVisible: Dispatch<SetStateAction<boolean>>
  scrollToTop: VoidFunction
}

export const BackofficeLayoutContext = createContext<Partial<IBackofficeLayoutContext>>({})

const BackofficeLayout: FC<IBackofficeLayoutProps> = () => {
  const navigate = useNavigate()
  const { isAuth } = useAuthentication()

  // _State
  const [_simplePageLoadingVisible, setSimplePageLoadingVisible] = useState<boolean>(false)
  const [isShowSidebar, setIsShowSidebar] = useState<boolean>(false)

  // _Callback
  const scrollToTop = useCallback(() => {
    document.querySelector('main').scrollTo(0, 0)
  }, [])

  // _Effects
  // - Get me profile
  useEffect(() => {
    AuthService.me().catch(() => {
      navigate('/login')
    })
  }, [navigate])

  // - Protect page for authentication only
  useEffect(() => {
    if (!isAuth) navigate('/')
  }, [isAuth, navigate])

  return (
    <BackofficeLayoutContext.Provider
      value={{
        setSimplePageLoadingVisible,
        scrollToTop,
      }}
    >
      <div className={clsx(`backoffice-layout`)}>
        <div
          className={clsx(`backoffice-sidebar-overlay`, {
            active: isShowSidebar,
          })}
          onClick={() => setIsShowSidebar(false)}
        ></div>
        <BackofficeSidebar
          isShowSidebar={isShowSidebar}
          menu={BACKOFFICE_SIDEBAR_CONFIG}
          onClickLink={() => setIsShowSidebar(false)}
          homePath={'/backoffice/dashboard'}
        />
        <div className={clsx(`backoffice-content`)}>
          <TopNavbar onClickMenuIcon={() => setIsShowSidebar((e) => !e)}>
            <BackofficeLayoutNavbar />
          </TopNavbar>
          <main>
            <Outlet />
          </main>
        </div>
      </div>
    </BackofficeLayoutContext.Provider>
  )
}

export default BackofficeLayout
