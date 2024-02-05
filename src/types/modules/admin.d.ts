import type { IPaginatedResponse, IPaginationQuery } from '../pagination'

export interface IAdmin {
  id?: number
  key?: number
  tel: string
  firstName: string
  lastName: string
  role: string
  username: string
  password?: string
  confirmPassword?: string
}

export interface IAdmins {
  admins: IAdmin[]
}

export interface ISimpleAdmin
  extends Pick<IAdmin, 'id' | 'key'  | 'tel' | 'firstName' | 'lastName' | 'username' | 'role'> {}

export interface IAdminQueryParams extends IPaginationQuery {
  search?: string
}

export interface IAdminPaginationResponse extends IPaginatedResponse<ISimpleAdmin> {}
