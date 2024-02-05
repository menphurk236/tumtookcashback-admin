import type { FC, ReactNode } from 'react'
import { useEffect, useMemo } from 'react'

import clsx from 'clsx'
import { IoClose } from '@react-icons/all-files/io5/IoClose'

import { DEFAULT_OPTIONS } from './configs'
import type { IDropFileProps } from './types'
import { useDropFile } from './hooks'
import UploadSvg from '../../../../assets/icons/upload.svg'

interface IImageDropFileFormInputProps extends IDropFileProps {
  objectFit?: 'cover' | 'contain'
  error?: ReactNode
  name?: string
  value?: string
  preview?: string
  onCancel?: VoidFunction
  onDelete?: VoidFunction
  getRemoveFileEvent?: (e: VoidFunction) => void
}

const ImageDropFileFormInput: FC<IImageDropFileFormInputProps> = ({
  className,
  invalid,
  objectFit = 'contain',
  options = DEFAULT_OPTIONS,
  onDrop,
  onDropRejected,
  error,
  preview,
  onCancel,
  onDelete,
  getRemoveFileEvent,
  ...props
}) => {
  const { getRootProps, getInputProps, files, isDragActive, onRemoveFile } = useDropFile({
    options,
    onDrop,
    onDropRejected,
    onCancel,
    onDelete,
  })

  // _Memo
  const hasOverlay = useMemo(() => {
    return files.length > 0 || preview
  }, [files.length, preview])

  const renderPreviewImage = useMemo(() => {
    if (options.maxFiles === 1) {
      const file = files.length > 0 ? files[0] : preview ? { preview } : null

      if (!file) return null

      return (
        <div className={clsx(`input-dropfile-form-preview`)}>
          <img
            src={file.preview}
            className={clsx([objectFit])}
            onLoad={() => {
              URL.revokeObjectURL(file.preview)
            }}
          />
        </div>
      )
    }

    return null
  }, [options.maxFiles, files, preview, objectFit])

  // _Effect
  useEffect(() => {
    getRemoveFileEvent?.(onRemoveFile)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={clsx(`input-dropfile-form-wrapper`)}>
      <div
        className={clsx(
          `input-dropfile-form`,
          {
            'is-invalid': typeof error === 'string' || !!error,
          },
          className,
        )}
        {...getRootProps()}
      >
        <input {...getInputProps(props)} />

        {renderPreviewImage}

        {hasOverlay && <div className={clsx(`input-dropfile-overlay`)}></div>}

        {isDragActive ? (
          <div className={clsx(`input-dropfile-form-info`, { 'has-overlay': hasOverlay })}>
            <img src={UploadSvg} className={clsx(`input-dropfile-form-icon`)} />
            <span className={clsx(`input-dropfile-form-text`)}>Drop the files here ...</span>
          </div>
        ) : (
          <div className={clsx(`input-dropfile-form-info`, { 'has-overlay': hasOverlay })}>
            <img src={UploadSvg} className={clsx(`input-dropfile-form-icon`)} />
            <span className={clsx(`input-dropfile-form-text`)}>Drag and Drop here</span>
            <span className={clsx(`input-dropfile-form-text`)}>or</span>
            <span className={clsx(`input-dropfile-form-text`)}>Browse files</span>
          </div>
        )}
      </div>
      {!!error && <span className={clsx(`input-invalid-message`)}>{error}</span>}

      {files.length > 0 && (
        <div className="input-dropfile-form-delete" onClick={onRemoveFile}>
          <IoClose />
        </div>
      )}
    </div>
  )
}

export default ImageDropFileFormInput
