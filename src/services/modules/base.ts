import type { AxiosRequestConfig } from 'axios'

import axios from '@/libs/axios'

export default class BaseService {
  static async _get(url: string, config?: AxiosRequestConfig) {
    const params = config?.params

    try {
      const res = await axios.get(url, {
        ...config,
        params: params ? params : {},
      })
      return Promise.resolve(res.data)
    } catch (err) {
      return Promise.reject(err)
    }
  }

  static async _post(url: string, data?: unknown, config?: AxiosRequestConfig) {
    try {
      const res = await axios.post(url, data, config)
      return Promise.resolve(res.data)
    } catch (err) {
      return Promise.reject(err)
    }
  }

  static async _patch(url: string, data?: unknown, config?: AxiosRequestConfig) {
    try {
      const res = await axios.patch(url, data, config)
      return Promise.resolve(res.data)
    } catch (err) {
      return Promise.reject(err)
    }
  }

  static async _put(url: string, data?: unknown, config?: AxiosRequestConfig) {
    try {
      const res = await axios.put(url, data, config)
      return Promise.resolve(res.data)
    } catch (err) {
      return Promise.reject(err)
    }
  }

  static async _delete(url: string, data?: unknown, config?: AxiosRequestConfig) {
    try {
      const res = await axios.delete(url, {
        ...config,
        data,
      })
      return Promise.resolve(res.data)
    } catch (err) {
      return Promise.reject(err)
    }
  }
}
