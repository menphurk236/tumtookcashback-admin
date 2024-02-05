import type { ITransaction } from './transaction'

export interface ISearchData {
  tel: string
  balance: number
  name: string
  company: string
  transactions: Pick<ITransaction, 'remark'>
}

export interface ISearchList {
  item: ISearchData[]
}

export interface ISearchDataQueryParams extends IPaginationQuery {
  search?: string
}
