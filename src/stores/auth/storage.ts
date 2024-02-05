import Cookies from 'js-cookie'

import { STORE_KEY } from '@/constants'
import { createCookieStorage } from '@/utils/cookie-storage'

import type { IAuthState } from './types'

const KEY = STORE_KEY.auth.key

export const storage = createCookieStorage({
  secureKey: STORE_KEY.auth.secureKey,
  storage: Cookies,
})

export const getTokens = storage.get<IAuthState>(KEY)

export const setTokens = (tokens: IAuthState) => {
  storage.set<IAuthState>(KEY, tokens)
}

export const removeTokens = () => {
  storage.remove(KEY)
}
