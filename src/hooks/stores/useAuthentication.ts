import { useEffect, useState } from 'react'

import { useAuthStore } from '@/stores/auth'

export const useAuthentication = () => {
  const { isAuth: _isAuthFn } = useAuthStore()
  const _isAuth = _isAuthFn()

  // _State
  const [isAuth, setIsAuth] = useState(_isAuth)

  // _Effect
  useEffect(() => {
    setIsAuth(_isAuth)
  }, [_isAuth])

  return {
    isAuth,
  }
}
