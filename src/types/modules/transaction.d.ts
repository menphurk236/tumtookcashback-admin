import type { IPaginatedResponse, IPaginationQuery } from '../pagination'
import type { ICustomer } from './customer'

export interface ITransaction {
  id?: number
  key?: number
  balance: number
  createdAt: string
  createdBy: string
  customerId: number
  deposit: number
  file?: string
  slip?: string
  tax: string
  tel: string
  withdraw: 0
  remark?: string
}

export interface ITransactions {
  transactions: ITransaction[]
}

export interface ISimpleTransaction extends ITransaction {}

export interface ITransactionQueryParams extends IPaginationQuery {
  search?: string
}

export interface ITransactionPaginationResponse extends IPaginatedResponse<ISimpleTransaction> {}

export interface ITransactionById {
  customer: Omit<ICustomer, 'balance' | 'key'>
  transactions: ITransactionPaginationResponse
}
