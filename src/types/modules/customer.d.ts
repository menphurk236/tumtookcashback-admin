import type { IPaginatedResponse, IPaginationQuery } from '../pagination'

export interface ICustomer {
  id?: number
  key?: number
  name?: string | null
  company?: string | null
  tel: string
  tax?: string
  balance?: number
  createdAt: string
}

export interface ICustomers {
  customers: ICustomer[]
}

export interface ISimpleCustomer extends Pick<ICustomer, 'id' | 'key' | 'name' | 'tel' | 'tax' | 'balance'> {}

export interface ICustomerQueryParams extends IPaginationQuery {
  search?: string
}

export interface ICustomerPaginationResponse extends IPaginatedResponse<ISimpleCustomer> {}
