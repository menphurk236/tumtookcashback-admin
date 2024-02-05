import type { IPaginatedResponse, IPaginationQuery } from '../pagination'

export interface IDashboardTransaction {
  id?: number
  key?: number
  createdAt: Date | string
  deposit: string | null
  withdraw: string | null
  balance: string | null
  createdBy: string
  remark: string
}

export interface IDashboardTransactions {
  transactions: IDashboardTransaction[]
}

export interface ISimpleDashboardTransaction
  extends Pick<IDashboardTransaction, 'id' | 'key' | 'createdAt' | 'deposit' | 'withdraw' | 'balance' | 'remark'> {}

export interface IDashboardTransactionQueryParams extends IPaginationQuery {
  search?: string
}

export interface IDashboardTransactionResponse {
  totalBalance: number
  totalCustomer: number
  transactionToDay: IPaginatedResponse<ISimpleDashboardTransaction>
}
export interface IDashboardTransactionPaginationResponse extends IPaginatedResponse<ISimpleDashboardTransaction> {}
