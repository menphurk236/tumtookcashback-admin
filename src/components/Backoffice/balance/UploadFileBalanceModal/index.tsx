import type { FC } from 'react'
import { ChangeEvent, useEffect, useMemo, useRef, useState } from 'react'

import { useFormik } from 'formik'
import * as yup from 'yup'
import clsx from 'clsx'

import Modal from '@/components/UI/Modal'
import type { IModalProps } from '@/components/UI/Modal/types'
import { Button } from '@/components/UI'

import { uploadFileBalanceModal } from './hook'

interface IUploadFileBalanceModalProps extends IModalProps {
  onSubmit?: (payload: FormData) => void
}

const validationSchema = yup.object().shape({
  // file: validateFieldImage,
})

const UploadFileBalanceModal: FC<IUploadFileBalanceModalProps> = ({ onSubmit, isLoading, ...props }) => {
  const { visible, close } = uploadFileBalanceModal()
  const inputFile = useRef(null)
  const [fileList, setFileList] = useState<FileList | null>(null)
  const files = fileList ? [...fileList] : []
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFileList(e.target.files)
  }

  // _Memo
  const initialValues = useMemo(() => {
    return {
      file: null,
    }
  }, [])

  // _Form
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: () => {
      const formData = new FormData()

      // for (const key in values) {
      //   if (values[key])
      //     if (values[key]?.name) formData.append(key, values[key], values[key].name)
      //     else formData.append(key, values[key])
      // }
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

  // _Effect
  useEffect(() => {
    if (!visible) formik.resetForm()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  return (
    <Modal visible={visible} closeModal={onCloseModal} isMobileFullScreen title={'แก้ไขรายการ'} {...props}>
      <form onSubmit={formik.handleSubmit}>
        <div className={clsx(`flex flex-col`)}>
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
            <Button variant="success" className={clsx(`flex-1`)} type="submit" loading={isLoading}>
              <span className={clsx(`text-body-20`)}>บันทึก</span>
            </Button>
          </div>
        </Modal.Footer>
      </form>
    </Modal>
  )
}

export default UploadFileBalanceModal
