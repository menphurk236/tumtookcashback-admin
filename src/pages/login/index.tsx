import { Fragment, useEffect } from 'react'

import * as yup from 'yup'
import clsx from 'clsx'
import { useFormik } from 'formik'
import { useNavigate } from 'react-router'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

import { Input, Button } from '@/components/UI'
import { getErrorWithTouched } from '@/utils/form'
// import Button from '@/components/UI/Button'
// import Card from '@/components/UI/Card'
import { AuthService } from '@/services'
import { handleAxiosErrorMsg } from '@/libs/axios'
import { useAuthStore } from '@/stores/auth'

import LoginImage from '@/assets/login.jpg'

import type { IAuthEventError, IAuthLoginParams, IAuthResponse } from '@/types/auth'
import { useAuthentication } from '@/hooks'

interface IFormValues {
  username: string
  password: string
}

const validationSchema = yup.object().shape({
  username: yup.string().required(`กรุณากรอกบัญชีผู้ใช้`),
  password: yup.string().required(`กรุณากรอกรหัสผ่าน`),
})

export const LoginPage = () => {
  const navigate = useNavigate()
  const initialValues: IFormValues = { username: '', password: '' }
  const { isAuth } = useAuthentication()

  // _Form
  const formik = useFormik<IFormValues>({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      mutate(values)
    },
  })

  useEffect(() => {
    if (isAuth) navigate('/backoffice/dashboard')
  }, [isAuth, navigate])

  // _Mutation
  const { mutate, isLoading } = useMutation((params: IAuthLoginParams) => AuthService.login(params), {
    onError: (err: IAuthEventError) => {
      const msg = handleAxiosErrorMsg(err)
      toast.error(msg)
    },
    onSuccess: (res: IAuthResponse) => {
      useAuthStore.getState().login({
        accessToken: res.accessToken,
        refreshToken: res.accessToken,
      })

      navigate('/backoffice/dashboard')
    },
  })

  return (
    <Fragment>
      <div className={clsx(`flex items-center justify-center bg-gray-200 h-screen`)}>
        <div className={clsx(`flex items-center rounded bg-white-900`)}>
          <div className={clsx(`sm:hidden`)}>
            <img src={LoginImage} alt="" width={300} />
          </div>
          <div className={clsx(`w-[350px] px-5`, `sm:w-full sm:py-3`)}>
            <form onSubmit={formik.handleSubmit} className={clsx(`flex flex-col`)}>
              <div className={clsx(`mt-6`)}>
                <label htmlFor="username">บัญชีผู้ใช้</label>
                <Input
                  id="username"
                  name="username"
                  className={clsx(`mt-2`)}
                  placeholder="กรอกบัญชีผู้ใช้"
                  onChange={formik.handleChange}
                  value={formik.values.username}
                  error={getErrorWithTouched(formik, 'username')}
                  disabled={isLoading}
                />
              </div>

              <div className={clsx(`mt-4`)}>
                <label htmlFor="password">รหัสผ่าน</label>
                <Input.Password
                  id="password"
                  name="password"
                  className={clsx(`mt-2`)}
                  placeholder="กรอกรหัสผ่าน"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  error={getErrorWithTouched(formik, 'password')}
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" variant="primary-solid" className={clsx(`mt-6 w-full`)} loading={isLoading}>
                <span>เข้าสู่ระบบ</span>
              </Button>
            </form>
          </div>
        </div>
      </div>
      {/*<div className={clsx(`flex max-h-screen bg-primary-500/90 h-screen`)}>*/}
      {/*  <div className={clsx(`flex flex-1 flex-col items-center justify-center p-20`, `md:p-6`)}>*/}
      {/*    <Logo className="mb-6" />*/}
      {/*    <Card className={clsx(`flex w-[547px] max-w-full flex-col p-8`, `md:w-full`, `sm:p-6`)}>*/}
      {/*      <h1 className={clsx(`text-center text-header-1`, `sm:text-header-3`)}>LOGIN ADMIN</h1>*/}
      {/*      <form onSubmit={formik.handleSubmit} className={clsx(`flex flex-col`)}>*/}
      {/*        <div className={clsx(`mt-6`)}>*/}
      {/*          <label htmlFor="username">บัญชีผู้ใช้</label>*/}
      {/*          <Input*/}
      {/*            id="username"*/}
      {/*            name="username"*/}
      {/*            className={clsx(`mt-2`)}*/}
      {/*            placeholder="กรอกบัญชีผู้ใช้"*/}
      {/*            onChange={formik.handleChange}*/}
      {/*            value={formik.values.username}*/}
      {/*            error={getErrorWithTouched(formik, 'username')}*/}
      {/*            disabled={isLoading}*/}
      {/*          />*/}
      {/*        </div>*/}

      {/*        <div className={clsx(`mt-4`)}>*/}
      {/*          <label htmlFor="password">รหัสผ่าน</label>*/}
      {/*          <Input.Password*/}
      {/*            id="password"*/}
      {/*            name="password"*/}
      {/*            className={clsx(`mt-2`)}*/}
      {/*            placeholder="กรอกรหัสผ่าน"*/}
      {/*            onChange={formik.handleChange}*/}
      {/*            value={formik.values.password}*/}
      {/*            error={getErrorWithTouched(formik, 'password')}*/}
      {/*            disabled={isLoading}*/}
      {/*          />*/}
      {/*        </div>*/}

      {/*        <Button type="submit" variant="primary-solid" className={clsx(`mt-6 w-full`)} loading={isLoading}>*/}
      {/*          <span>เข้าสู่ระบบ</span>*/}
      {/*        </Button>*/}
      {/*      </form>*/}
      {/*    </Card>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </Fragment>
  )
}
