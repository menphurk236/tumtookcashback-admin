import { Fragment } from 'react'

import clsx from 'clsx'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { ref } from 'yup'
import { Link, useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import Select from 'react-select'

import { Button, Card, Input } from '@/components/UI'
import { getErrorWithTouched } from '@/utils/form'
import { AdminService } from '@/services'
import { handleAxiosErrorMsg } from '@/libs/axios'

import type { IAdmin } from '@/types/modules/admin'

const validationSchema = yup.object().shape({
  tel: yup.string().required(`กรุณากรอกเบอร์โทรศัพท์`),
  firstName: yup.string().required(`กรุณากรอกชื่อ`),
  lastName: yup.string().required(`กรุณากรอกนามสกุล`),
  username: yup.string().required(`กรุณากรอกชื่อผู้ใช้`),
  password: yup.string().required(`กรุณากรอกรหัสผ่าน`),
  confirmPassword: yup
    .string()
    .required('กรุณากรอกยืนยันรหัสผ่าน')
    .oneOf([ref('password')], 'ยืนยันรหัสไม่ตรงกัน'),
})

export const AdminCreatePage = () => {
  const navigate = useNavigate()
  const initialValues: Pick<
    IAdmin,
    'firstName' | 'lastName' | 'tel' | 'username' | 'password' | 'confirmPassword' | 'role'
  > = {
    firstName: '',
    lastName: '',
    username: '',
    tel: '',
    password: '',
    confirmPassword: '',
    role: '',
  }

  // _Form
  const formik = useFormik<
    Pick<IAdmin, 'firstName' | 'lastName' | 'tel' | 'username' | 'password' | 'confirmPassword' | 'role'>
  >({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      mutate(values)
    },
  })

  // _Mutation
  const { mutate, isLoading } = useMutation(
    (payload: Pick<IAdmin, 'firstName' | 'lastName' | 'tel' | 'username' | 'password' | 'confirmPassword' | 'role'>) =>
      AdminService.create(payload),
    {
      onError: (err) => {
        const msg = handleAxiosErrorMsg(err)
        toast.error(msg)
      },
      onSuccess: () => {
        navigate('/backoffice/admin')
      },
    },
  )

  const options = [
    { value: 'superAdmin', label: 'ผู้ดูแล' },
    { value: 'participant', label: 'ผู้มีส่วนร่วม' },
    { value: 'admin', label: 'แอดมิน' },
  ]

  return (
    <Fragment>
      <h3 className={clsx(`text-header-3`)}>เพิ่มข้อมูลผู้ดูแล</h3>
      <Card className={clsx(`mt-4`)}>
        <form onSubmit={formik.handleSubmit} className={clsx(`flex flex-col`)}>
          <div
            className={clsx(
              `mt-4 flex items-center space-x-4`,
              `sm:flex-col sm:items-stretch sm:space-x-0 sm:space-y-4`,
            )}
          >
            <div className={clsx(`flex-1`)}>
              <label htmlFor="firstName">ชื่อ</label>
              <Input
                id="firstName"
                name="firstName"
                className={clsx(`mt-2`)}
                placeholder="กรอกชื่อ"
                onChange={formik.handleChange}
                value={formik.values.firstName}
                error={getErrorWithTouched(formik, 'firstName')}
                disabled={isLoading}
              />
            </div>
            <div className={clsx(`flex-1`)}>
              <label htmlFor="lastName">นามสกุล</label>
              <Input
                id="lastName"
                name="lastName"
                className={clsx(`mt-2`)}
                placeholder="กรอกนามสกุล"
                onChange={formik.handleChange}
                value={formik.values.lastName}
                error={getErrorWithTouched(formik, 'lastName')}
                disabled={isLoading}
              />
            </div>
            <div className={clsx(`flex-1`)}>
              <label htmlFor="tel">เบอร์โทรศัพท์</label>
              <Input
                id="tel"
                name="tel"
                className={clsx(`mt-2`)}
                placeholder="กรอกเบอร์โทรศัพท์"
                onChange={formik.handleChange}
                value={formik.values.tel}
                error={getErrorWithTouched(formik, 'tel')}
                disabled={isLoading}
              />
            </div>
          </div>

          <div
            className={clsx(
              `mt-4 flex items-center space-x-4`,
              `sm:flex-col sm:items-stretch sm:space-x-0 sm:space-y-4`,
            )}
          >
            <div className={clsx(`flex-1`)}>
              <label htmlFor="username">ชื่อผู้ใช้</label>
              <Input
                id="username"
                name="username"
                className={clsx(`mt-2`)}
                placeholder="กรอกชื่อผู้ใช้"
                onChange={formik.handleChange}
                value={formik.values.username}
                error={getErrorWithTouched(formik, 'username')}
                disabled={isLoading}
              />
            </div>

            <div className={clsx(`flex-1`)}>
              <label htmlFor="role">บทบาท</label>
              <Select
                name="role"
                placeholder={`เลือกบทบาท`}
                required={true}
                options={options}
                onChange={(val) => {
                  if (typeof val.value === 'string') {
                    formik.values.role = val.value
                  }
                }}
              />
            </div>
          </div>

          <div
            className={clsx(
              `mt-4 flex items-center space-x-4`,
              `sm:flex-col sm:items-stretch sm:space-x-0 sm:space-y-4`,
            )}
          >
            <div className={clsx(`flex-1`)}>
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

            <div className={clsx(`flex-1`)}>
              <label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</label>
              <Input.Password
                id="confirmPassword"
                name="confirmPassword"
                className={clsx(`mt-2`)}
                placeholder="กรอกยืนยันรหัสผ่าน"
                onChange={formik.handleChange}
                value={formik.values.confirmPassword}
                error={getErrorWithTouched(formik, 'confirmPassword')}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className={clsx(`mt-6 flex items-center space-x-4`)}>
            <Link to="/backoffice/admin" className={clsx(`inline-block flex-1`)}>
              <Button variant="danger" className={clsx(`w-full`)} type="button" loading={isLoading}>
                <span className={clsx(`text-body-20`)}>ยกเลิก</span>
              </Button>
            </Link>
            <Button variant="success" className={clsx(`flex-1`)} type="submit" loading={isLoading}>
              <span className={clsx(`text-body-20`)}>บันทึก</span>
            </Button>
          </div>
        </form>
      </Card>
    </Fragment>
  )
}
