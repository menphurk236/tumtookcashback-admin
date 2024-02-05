import type { AxiosRequestConfig } from 'axios'

import BaseService from './base'

import type { IAdmin, IAdminPaginationResponse, IAdminQueryParams } from '@/types/modules/admin'

export default class AdminService extends BaseService {
  /**
   *  Get user list
   */
  static async list(params: IAdminQueryParams, config?: AxiosRequestConfig): Promise<IAdminPaginationResponse> {
    return this._get(`/admin/user`, {
      params,
      ...config,
    })
  }

  /**
   * Create user
   */
  static async create(payload: Pick<IAdmin, 'firstName' | 'lastName' | 'username' | 'password'>): Promise<IAdmin> {
    return this._post('/admin/user', payload)
  }

  /**
   * Get user by id
   */
  static async byId(id: string): Promise<IAdmin> {
    return this._get(`/admin/user/${id}`)
  }

  /**
   * Update user
   */
  static async update(
    id: number | string,
    payload: Pick<IAdmin, 'firstName' | 'lastName' | 'username' | 'password'>,
  ): Promise<IAdmin> {
    return this._patch(`/admin/user/${id}`, payload)
  }

  /**
   * Delete user by id
   */
  static async delete(id: string | number): Promise<void> {
    return this._delete(`/admin/user/${id}`)
  }
}
