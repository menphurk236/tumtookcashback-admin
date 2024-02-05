export interface IBaseResponseError {
  message: string
  statusCode: number
  status: number
  error?: string
  data?: unknown
}
