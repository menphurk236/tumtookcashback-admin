import type { AxiosRequestConfig } from 'axios'

import BaseService from './base'

import type { ICustomer, ICustomerPaginationResponse, ICustomerQueryParams } from '@/types/modules/customer'

export default class CustomerService extends BaseService {
  /**
   *  Get cutomer list
   */
  static async list(params: ICustomerQueryParams, config?: AxiosRequestConfig): Promise<ICustomerPaginationResponse> {
    return this._get(`/admin/customer`, {
      params,
      ...config,
    })
  }

  /**
   * Create cutomer
   */
  static async create(payload: Pick<ICustomer, 'name' | 'company' | 'tel' | 'tax'>): Promise<Pick<ICustomer, 'id'>> {
    return this._post('/admin/customer', payload)
  }

  /**
   * Get cutomer by id
   */
  static async byId(id: string): Promise<ICustomer> {
    return this._get(`/admin/customer/${id}`)
  }

  /**
   * Update cutomer
   */
  static async update(
    id: number | string,
    payload: Pick<ICustomer, 'name' | 'company' | 'tel' | 'tax'>,
  ): Promise<ICustomer> {
    return this._patch(`/admin/customer/${id}`, payload)
  }

  /**
   * Delete cutomer by id
   */
  static async delete(id: string | number): Promise<void> {
    return this._delete(`/admin/customer/${id}`)
  }
}
