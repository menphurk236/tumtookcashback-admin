import type { Order } from '@/enums'

export interface IPaginationSortOrder<T> {
  sort: 'id' | keyof T
  order: Order
}

export interface IPaginationQuery extends Partial<IPaginationSortOrder<T>> {
  page: number
  perPage: number
}

export interface IPaginatedResponse<T> {
  items: T[]
  lastPage: number
  page: number
  perPage: number
  total: number
}
