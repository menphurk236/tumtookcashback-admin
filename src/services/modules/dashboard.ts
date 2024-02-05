import type { AxiosRequestConfig } from 'axios'

import BaseService from './base'

import type { IDashboardTransactionQueryParams, IDashboardTransactionResponse } from '@/types/modules/dashboard'

export default class DashboardService extends BaseService {
  /**
   *  Get dashboard list
   */
  static async dashboard(
    params: IDashboardTransactionQueryParams,
    config?: AxiosRequestConfig,
  ): Promise<IDashboardTransactionResponse> {
    return this._get(`/admin/dashboard`, {
      params,
      ...config,
    })
  }
}
