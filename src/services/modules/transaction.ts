import type { AxiosRequestConfig } from 'axios'

import BaseService from './base'

import type {
  ITransaction,
  ITransactionById,
  ITransactionPaginationResponse,
  ITransactionQueryParams,
} from '@/types/modules/transaction'

export default class CustomerService extends BaseService {
  /**
   *  Get transaction list
   */
  static async list(
    params: ITransactionQueryParams,
    config?: AxiosRequestConfig,
  ): Promise<ITransactionPaginationResponse> {
    return this._get(`/admin/transaction`, {
      params,
      ...config,
    })
  }

  /**
   * Create transaction
   */
  static async create(payload: FormData): Promise<void> {
    return this._post('/admin/transaction', payload)
  }

  /**
   * Get transaction by id
   */
  static async byId(
    id: string,
    params: ITransactionQueryParams,
    config?: AxiosRequestConfig,
  ): Promise<ITransactionById> {
    return this._get(`/admin/transaction/${id}/customer`, {
      params,
      ...config,
    })
  }

  /**
   * Update transaction
   */
  static async update(id: number | string, payload: FormData): Promise<ITransaction> {
    return this._patch(`/admin/transaction/${id}`, payload)
  }

  /**
   * Delete transaction by id
   */
  static async delete(id: string | number): Promise<void> {
    return this._delete(`/admin/transaction/${id}`)
  }

  /**
   * Update transaction
   */
  static async updateFile(id: number | string, payload: FormData): Promise<void> {
    return this._patch(`/admin/transaction/${id}/file`, payload)
  }

  /**
   * Get file slip transaction
   */
  static async fileSlip(id: string | number): Promise<ITransaction> {
    return this._get(`/admin/transaction/generate/slip/${id}`)
    // return '/tumtook-slip.png'
  }

  /**
   * Download file slip transaction
   */
  static async downloadFileSlip(name: string): Promise<Blob> {
    return this._get(`/admin/transaction/download/slip/${name}`, { responseType: 'blob' })
  }

  /**
   * Download file pdf transaction
   */
  static async downloadFilePDF(
    id: string,
    params: ITransactionQueryParams,
    config?: AxiosRequestConfig,
  ): Promise<Blob> {
    return this._get(`/admin/transaction/generate/pdf/${id}`, {
      responseType: 'blob',
      params,
      ...config,
    })
  }
}
