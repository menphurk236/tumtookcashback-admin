export interface IUserBalance {
  id?: number
  createdAt?: Date | string
  deposit?: number | string | null
  withdraw?: number | string | null
  balance: number | string | null
  createdBy?: string
  remark: string
  file?: string | null
  type?: 'deposit' | 'withdraw'
}

export interface IUser {
  firstName: string
  lastName: string
  username: string
  role: string
}
