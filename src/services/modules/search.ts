import type { AxiosRequestConfig } from 'axios'

import BaseService from './base'

import type { ISearchDataQueryParams, ISearchList } from '@/types/modules/search'

export default class SearchService extends BaseService {
  /**
   *  Get cutomer list
   */
  static async search(params: ISearchDataQueryParams, config?: AxiosRequestConfig): Promise<ISearchList> {
    return this._get(`/homepage/customer`, {
      params,
      ...config,
    })
  }
}
