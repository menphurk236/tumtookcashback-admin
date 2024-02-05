import type { ChangeEvent, FC } from 'react'
import { useState, useMemo, useEffect, useRef } from 'react'

import * as yup from 'yup'
import { useFormik } from 'formik'
import clsx from 'clsx'
import { useParams } from 'react-router'

import Modal from '@/components/UI/Modal'
import { getErrorWithTouched } from '@/utils/form'
import { Button, Input } from '@/components/UI'
import type { IModalProps } from '@/components/UI/Modal/types'

import { manageBalanceModal } from './hook'

export interface IFormUpdate {
  withdraw: number
  deposit: number
  remark: string
  file: number
  // type: string
}

interface IManageBalanceModalProps extends IModalProps {
  onSubmit?: (payload: FormData) => void
  data?: IFormUpdate
}

const validationSchema = yup.object().shape({
  remark: yup.string().required(`กรุณากรอกอ้างอิงธุรกรรม`),
  withdraw: yup.string().required(`กรุณากรอกใช้ Cashback`),
  deposit: yup.string().required(`กรุณากรอกได้รับ Cashback`),
})

const ManageBalanceModal: FC<IManageBalanceModalProps> = ({ onSubmit, data, isLoading, ...props }) => {
  const { visible, close } = manageBalanceModal()
  const inputFile = useRef(null)
  const [fileList, setFileList] = useState<FileList | null>(null)
  const files = fileList ? [...fileList] : []
  const isEdit = !!data
  const { id } = useParams()

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFileList(e.target.files)
  }

  // _Memo
  const initialValues = useMemo(() => {
    if (data) {
      return {
        ...data,
      }
    }

    return {
      withdraw: 0,
      deposit: 0,
      remark: null,
      // file: null,
    }
  }, [data])

  // _Form
  const formik = useFormik({
    initialValues,
    validationSchema,
    enableReinitialize: !!data,
    onSubmit: (values) => {
      const formData = new FormData()

      for (const key in values) {
        formData.append(key, values[key])
      }

      if (!isEdit) formData.append('customerId', id)

      files.forEach((file) => {
        formData.append(`files`, file, file.name)
      })

      onSubmit?.(formData)
    },
  })
  // _Events
  const onCloseModal = () => {
    close()
    formik.resetForm()
  }

  useEffect(() => {
    if (!visible) formik.resetForm()
  }, [visible])

  return (
    <Modal
      visible={visible}
      closeModal={onCloseModal}
      isMobileFullScreen
      title={!isEdit ? 'เพิ่มรายการ' : 'แก้ไขรายการ'}
      {...props}
    >
      <form onSubmit={formik.handleSubmit}>
        {/* Select Type */}
        {/*<div className={clsx(`space-x-5`)}>*/}
        {/*  <label className={clsx(`inline-flex items-center space-x-2`)}>*/}
        {/*    <input*/}
        {/*      type="radio"*/}
        {/*      name="type"*/}
        {/*      value={UserTransaction.DEPOSIT}*/}
        {/*      onChange={() => {*/}
        {/*        formik.setErrors({})*/}
        {/*        formik.setFieldValue('type', UserTransaction.DEPOSIT, false)*/}
        {/*        if (isEdit && initialValues?.type === UserTransaction.DEPOSIT)*/}
        {/*          formik.setFieldValue('type', initialValues.type)*/}
        {/*      }}*/}
        {/*      checked={formik.values?.type === UserTransaction.DEPOSIT}*/}
        {/*      disabled={isEdit}*/}
        {/*    />*/}
        {/*    <span className={clsx([{ 'text-white-400': isEdit }])}>ยอดเข้า</span>*/}
        {/*  </label>*/}
        {/*  <label className={clsx(`inline-flex items-center space-x-2`)}>*/}
        {/*    <input*/}
        {/*      type="radio"*/}
        {/*      name="type"*/}
        {/*      value={UserTransaction.WITHDRAW}*/}
        {/*      onChange={() => {*/}
        {/*        formik.setErrors({})*/}
        {/*        formik.setFieldValue('type', UserTransaction.WITHDRAW, false)*/}
        {/*        if (isEdit && initialValues?.type === UserTransaction.WITHDRAW)*/}
        {/*          formik.setFieldValue('type', initialValues.type)*/}
        {/*      }}*/}
        {/*      checked={formik.values?.type === UserTransaction.WITHDRAW}*/}
        {/*      disabled={isEdit}*/}
        {/*    />*/}
        {/*    <span className={clsx([{ 'text-white-400': isEdit }])}>ยอดออก</span>*/}
        {/*  </label>*/}
        {/*</div>*/}
        <div className={clsx(`mt-4`)}>
          <label htmlFor="deposit">ได้รับ Cashback</label>
          <Input.Numeric
            id="deposit"
            name="deposit"
            className={clsx(`mt-2`)}
            placeholder={'กรอกได้รับ Cashback'}
            onChange={(e) => {
              formik.setFieldValue('deposit', e)
            }}
            value={formik.values.deposit}
            error={getErrorWithTouched(formik, 'deposit')}
            disabled={isLoading || isEdit}
          />
        </div>
        <div className={clsx(`mt-4`)}>
          <label htmlFor="price">ใช้ Cashback</label>
          <Input.Numeric
            id="withdraw"
            name="withdraw"
            className={clsx(`mt-2`)}
            placeholder={'กรอกใช้ Cashback'}
            onChange={(e) => {
              formik.setFieldValue('withdraw', e)
            }}
            value={formik.values.withdraw}
            error={getErrorWithTouched(formik, 'withdraw')}
            disabled={isLoading || isEdit}
          />
        </div>

        <div className={clsx(`mt-4`)}>
          <label htmlFor="remark">เลขที่ใบเสนอราคา</label>
          <Input
            id="remark"
            name="remark"
            className={clsx(`mt-2`)}
            placeholder="กรอกเลขที่ใบเสนอราคา"
            onChange={formik.handleChange}
            value={formik.values.remark}
            error={getErrorWithTouched(formik, 'remark')}
            disabled={isLoading}
          />
        </div>
        <div className={clsx(`mt-4 flex flex-col`)}>
          <label>อัพโหลดภาพ</label>
          <input id="fileUpload" type="file" onChange={handleFileChange} multiple hidden={true} ref={inputFile} />
          <Button
            type="button"
            className={clsx(`mt-2 flex-1 bg-blue-400 text-white-900`)}
            onClick={() => inputFile.current.click()}
          >
            <span className={clsx(`text-body-20`)}>อัพโหลดรูปภาพ</span>
          </Button>
          <ul>
            {files.map((file, i) => (
              <li key={i}>{`${i + 1}. ${file.name}`}</li>
            ))}
          </ul>
        </div>

        <Modal.Footer>
          <div className={clsx(`mt-6 flex items-center space-x-4`)}>
            <Button type="button" variant="danger" className={clsx(`flex-1`)} onClick={onCloseModal}>
              <span className={clsx(`text-body-20`)}>ยกเลิก</span>
            </Button>
            <Button
              variant="success"
              className={clsx(`flex-1`)}
              type="submit"
              disabled={!formik.dirty && isEdit}
              loading={isLoading}
            >
              <span className={clsx(`text-body-20`)}>บันทึก</span>
            </Button>
          </div>
        </Modal.Footer>
      </form>
    </Modal>
  )
}

export default ManageBalanceModal
