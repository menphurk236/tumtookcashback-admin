export interface IAuthLoginParams {
  username: string
  password: string
}

// export interface IAuthRegisterParams extends IAuthLoginParams {
//   referral?: string
// }

export interface IAuthResponse {
  accessToken: string
}

export interface IAuthEventError {
  code: AuthErrorCodes
  message: string
}
