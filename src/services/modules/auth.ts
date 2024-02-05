import { useUserStore } from '@/stores/user'

import BaseService from './base'

import type { IUser } from '@/types/modules/user'
import type { IAuthLoginParams, IAuthResponse } from '@/types/auth'

export default class AuthService extends BaseService {
  /**
   * Login
   */
  static async login(params: IAuthLoginParams): Promise<IAuthResponse> {
    return this._post('/admin/auth/login', params)
  }

  /**
   * Get user profile
   */
  static async me(): Promise<IUser> {
    try {
      const data = await this._get('/admin/auth/me')
      useUserStore.getState().setProfile(data)
      return data
    } catch (error) {
      throw error
    }
  }

  /**
   * Logout
   */
  // static async logout(): Promise<void> {
  //   return signOut(auth)
  // }
}
