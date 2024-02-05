import { Fragment, useMemo, useState } from 'react'

import clsx from 'clsx'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router'
import { toast } from 'react-hot-toast'

import { Button, Card, SvgIcon } from '@/components/UI'
import { Pagination } from '@/components/UI/Pagination'
import type { TableColumn } from '@/components/UI/Table'
import Table from '@/components/UI/Table'
import { formatNumber } from '@/utils/format/number'
import EditButton from '@/components/UI/Button/EditButton'
import ManageBalanceModal from '@/components/Backoffice/balance/ManageBalanceModal'
import { manageBalanceModal } from '@/components/Backoffice/balance/ManageBalanceModal/hook'
import DeleteButton from '@/components/UI/Button/DeleteButton'
import ConfirmModal from '@/components/UI/ConfirmModal'
import UploadFileBalanceModal from '@/components/Backoffice/balance/UploadFileBalanceModal'
import { uploadFileBalanceModal } from '@/components/Backoffice/balance/UploadFileBalanceModal/hook'
import { TransactionService } from '@/services'
import SimplePageLoader from '@/components/UI/PageLoader/SimplePageLoader'
import { handleAxiosErrorMsg } from '@/libs/axios'
import { ENV } from '@/constants'
import Modal from '@/components/UI/Modal'

import { useBackofficeLayout } from '@/hooks'
import type { ISimpleTransaction, ITransaction, ITransactionQueryParams } from '@/types/modules/transaction'

export const BalanceIdPage = () => {
  const { id } = useParams()
  const { show, data: initData, close, visible: visibleManage } = manageBalanceModal()
  const {
    show: showUpdaload,
    close: closeUpload,
    data: initDataFile,
    visible: visibleUpload,
  } = uploadFileBalanceModal()
  const { scrollToTop } = useBackofficeLayout()

  // _State
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [slipFile, setSlipFile] = useState<string | null>(null)

  // _State
  const [queryParams, setQueryParams] = useState<ITransactionQueryParams>({
    page: 1,
    perPage: 10,
    search: '',
  })

  //_ Query
  const { data, isLoading, refetch } = useQuery(
    ['get-transactio-byId', queryParams],
    ({ signal }) => TransactionService.byId(id, queryParams, { signal }),
    {
      onSuccess: scrollToTop,
    },
  )

  // _Mutation
  const { mutate: deleteTransaction, isLoading: isDeleteTransactionLoading } = useMutation(
    (id: string | number) => TransactionService.delete(id),
    {
      onError: (err) => {
        const msg = handleAxiosErrorMsg(err)
        toast.error(msg)
      },
      onSuccess: () => {
        toast.success(`ทำรายการสำเร็จ`)
        refetch()
        setDeleteId(null)
      },
    },
  )

  const { mutate: create, isLoading: isCreateLoading } = useMutation(
    (payload: FormData) => TransactionService.create(payload),
    {
      onError: (err) => {
        const msg = handleAxiosErrorMsg(err)
        toast.error(msg)
      },
      onSuccess: () => {
        refetch()
        close()
        toast.success(`ทำรายการสำเร็จ`)
      },
    },
  )

  const { mutate: update, isLoading: isUpdateLoading } = useMutation(
    (payload: FormData) => TransactionService.update(initData?.id, payload),
    {
      onError: (err) => {
        const msg = handleAxiosErrorMsg(err)
        toast.error(msg)
      },
      onSuccess: () => {
        refetch()
        close()
        toast.success(`ทำรายการสำเร็จ`)
      },
    },
  )

  const { mutate: updateFiles, isLoading: isUpdateFileLoading } = useMutation(
    (payload: FormData) => TransactionService.updateFile(initDataFile?.id, payload),
    {
      onError: (err) => {
        const msg = handleAxiosErrorMsg(err)
        toast.error(msg)
      },
      onSuccess: () => {
        refetch()
        closeUpload()
        toast.success(`ทำรายการสำเร็จ`)
      },
    },
  )

  // TransactionService.downloadFilePdf(id)
  const { mutate: onDownloadPdf, isLoading: isGetPdfFile } = useMutation(
    () => TransactionService.downloadFilePDF(id, queryParams),
    {
      onError: (err) => {
        const msg = handleAxiosErrorMsg(err)
        toast.error(msg)
      },
      onSuccess: (res) => {
        const href = window.URL.createObjectURL(res)

        const anchorElement = document.createElement('a')

        anchorElement.href = href
        anchorElement.download = 'transaction.pdf'

        document.body.appendChild(anchorElement)
        anchorElement.click()

        document.body.removeChild(anchorElement)
        window.URL.revokeObjectURL(href)
      },
    },
  )

  // TransactionService.fileSlip(id)
  const { mutate: getFileSlip, isLoading: isGetSlipFile } = useMutation(() => TransactionService.fileSlip(id), {
    onError: (err) => {
      const msg = handleAxiosErrorMsg(err)
      toast.error(msg)
    },
    onSuccess: (res) => {
      setSlipFile(res.slip)
    },
  })

  // TransactionService.downloadFileSlip(id)
  const { mutate: onDownloadFile } = useMutation(() => TransactionService.downloadFileSlip(slipFile), {
    onError: (err) => {
      const msg = handleAxiosErrorMsg(err)
      toast.error(msg)
    },
    onSuccess: (res) => {
      const href = window.URL.createObjectURL(res)

      const anchorElement = document.createElement('a')

      anchorElement.href = href
      anchorElement.download = 'slip.png'

      document.body.appendChild(anchorElement)
      anchorElement.click()

      document.body.removeChild(anchorElement)
      window.URL.revokeObjectURL(href)
    },
  })

  // _Memo
  const columns = useMemo(
    () =>
      [
        {
          title: 'ลำดับ',
          dataIndex: 'key',
          align: 'center',
        },
        {
          title: 'วันที่',
          dataIndex: 'createdAt',
          align: 'center',
          className: clsx(`min-w-[110px]`),
        },
        {
          title: 'เบอร์โทร',
          dataIndex: 'tel',
          align: 'center',
          className: clsx(`min-w-[110px]`),
        },
        {
          title: 'ใช้ Cashback',
          dataIndex: 'withdraw',
          align: 'center',
          className: clsx(`min-w-[110px]`),
          render: (val) => {
            if (val > 0) {
              return <div className={clsx(`text-red-600`)}>-{formatNumber({ number: val, decimals: 2 })}</div>
            } else {
              return 0
            }
          },
        },
        {
          title: 'ได้รับ Cashback',
          dataIndex: 'deposit',
          align: 'center',
          className: clsx(`min-w-[110px]`),
          render: (val) => {
            if (val > 0) {
              return <div className={clsx(`text-green-600`)}>+{formatNumber({ number: val, decimals: 2 })}</div>
            } else {
              return 0
            }
          },
        },
        {
          title: 'ยอดคงเหลือ',
          dataIndex: 'balance',
          align: 'center',
          className: clsx(`min-w-[110px]`),
          render: (val) => {
            return `${formatNumber({ number: val, decimals: 2 })}฿`
          },
        },
        {
          title: 'ผู้ทำรายการ',
          dataIndex: 'createdBy',
          align: 'center',
          className: clsx(`min-w-[120px]`),
        },
        {
          title: 'เลขที่ใบเสนอราคา',
          dataIndex: 'remark',
          align: 'center',
          className: clsx(`min-w-[120px]`),
        },
        {
          title: 'แนบรูป',
          dataIndex: 'file',
          align: 'center',
          className: clsx(`min-w-[160px]`),
          render: (val, record) => {
            if (val.length > 0) {
              return (
                <PhotoProvider>
                  <div className="foo">
                    {val.map((item, index) => (
                      <PhotoView key={index} src={ENV.API_ENDPOINT.concat(item.path)}>
                        {index === 0 && (
                          <SvgIcon name="backoffice-image" className={clsx(`cursor-pointer text-sky-500 square-10`)} />
                        )}
                      </PhotoView>
                    ))}
                  </div>
                </PhotoProvider>
              )
            } else {
              return (
                <SvgIcon
                  onClick={() => showUpdaload(record)}
                  name="backoffice-plus-circle"
                  className={clsx(`cursor-pointer text-sky-500 square-5`)}
                />
              )
            }
          },
        },
        {
          dataIndex: 'actions',
          title: '',
          align: 'right',
          render: (_val, record) => (
            <div className={clsx(`flex items-center space-x-2`)}>
              <EditButton onClick={() => show(record)} />
              <DeleteButton onClick={() => setDeleteId(record.id)} />
            </div>
          ),
        },
      ] as TableColumn<ISimpleTransaction>[],
    [show, showUpdaload],
  )

  // _Events
  const transformData = (e: ITransaction) => {
    return {
      deposit: e?.deposit,
      withdraw: e?.withdraw,
      remark: e?.remark,
      file: e?.file.length,
      // type: e?.deposit > 0 ? UserTransaction.DEPOSIT : UserTransaction.WITHDRAW,
    }
  }

  if (isLoading) return <SimplePageLoader />

  return (
    <Fragment>
      <Card>
        <div className={clsx(`grid grid-cols-1`)}>
          <div className={clsx(`flex min-w-[300px] items-baseline text-body-20`)}>
            <div className={clsx(`mr-2 text-header-4`)}>ชื่อ - นามสกุล:</div>
            <div>{data?.customer.name}</div>
          </div>
          <div className={clsx(`mt-2 flex min-w-[300px] items-baseline text-body-20`)}>
            <div className={clsx(`mr-2 text-header-4`)}>ชื่อบริษัท:</div>
            <div>{data?.customer.company}</div>
          </div>
          <div className={clsx(`mt-2 flex min-w-[300px] items-baseline text-body-20`)}>
            <div className={clsx(`mr-2 text-header-4`)}>หมายเลขผู้เสียภาษี:</div>
            <div>{data?.customer.tax}</div>
          </div>
          <div className={clsx(`mt-2 flex min-w-[300px] items-baseline text-body-20`)}>
            <div className={clsx(`mr-2 text-header-4`)}>วันที่:</div>
            <div>{data?.customer.createdAt}</div>
          </div>
          <div className={clsx(`mt-2 flex min-w-[300px] items-baseline text-body-20`)}>
            <div className={clsx(`mr-2 text-header-4`)}>เบอร์โทร:</div>
            <div>{data?.customer.tel}</div>
          </div>
        </div>
      </Card>
      <div className={clsx(`mt-6 flex items-center space-x-2`, `sm:flex-col sm:items-stretch sm:space-y-2`)}>
        <Button variant="success" buttonType="icon-text" size="medium" onClick={() => show()}>
          <SvgIcon name="backoffice-plus-circle" />
          <span>เพิ่มรายการ</span>
        </Button>
        <Button
          buttonType="icon-text"
          size="medium"
          className={clsx(`bg-amber-600 text-white-900`, `sm:ml-0`)}
          onClick={() => onDownloadPdf()}
          loading={isGetPdfFile}
        >
          <SvgIcon name="backoffice-document" />
          <span>บันทึก PDF</span>
        </Button>
        <Button
          variant="warning"
          buttonType="icon-text"
          size="medium"
          className={clsx(`sm:ml-0`)}
          onClick={() => getFileSlip()}
          loading={isGetSlipFile}
        >
          <SvgIcon name="backoffice-print" />
          <span>พิมพ์สลิปยอดคงเหลือล่าสุด</span>
        </Button>
      </div>

      <Table
        className={clsx(`mt-6`)}
        rowKey={(_, index) => index}
        columns={columns}
        dataSource={data.transactions.items}
      />

      <Pagination
        className={clsx(`mt-6 w-full`)}
        current={queryParams.page}
        total={data?.transactions.total}
        pageSize={queryParams.perPage}
        showLessItems
        onChange={(e) => {
          setQueryParams((state) => ({
            ...state,
            page: e,
          }))
        }}
      />

      {visibleManage && (
        <ManageBalanceModal
          isLoading={isCreateLoading || isUpdateLoading}
          data={initData && transformData(initData)}
          onSubmit={(values) => {
            if (!initData) create(values)
            else update(values)
          }}
        />
      )}

      {visibleUpload && (
        <UploadFileBalanceModal
          isLoading={isUpdateFileLoading}
          onSubmit={(values) => {
            updateFiles(values)
          }}
        />
      )}

      <ConfirmModal
        visible={!!deleteId}
        title="ยืนยันการลบ"
        cancelText="ยกเลิก"
        confirmText="ลบ"
        onConfirm={() => {
          deleteTransaction(deleteId)
        }}
        onCancel={() => {
          setDeleteId(null)
        }}
        closeModal={() => {
          setDeleteId(null)
        }}
        isLoading={isDeleteTransactionLoading}
      >
        <p>คุณต้องการลบรายการนี้ ใช่หรือไม่?</p>
      </ConfirmModal>

      <Modal
        visible={!!slipFile}
        closeModal={() => {
          setSlipFile(null)
        }}
      >
        <Fragment>
          <img
            src={ENV.API_ENDPOINT.concat(`/uploads/slip/${slipFile}`)}
            alt="slip"
            className={clsx(`mt-8 object-contain`)}
          />

          <div className={clsx(`mt-4 flex items-center space-x-4`)}>
            <Button variant="success" className={clsx(`flex-1`)} onClick={() => onDownloadFile()}>
              <span>บันทึกสลิป</span>
            </Button>
            <Button
              variant="danger"
              className={clsx(`flex-1`)}
              onClick={() => {
                setSlipFile(null)
              }}
            >
              <span>ปิด</span>
            </Button>
          </div>
        </Fragment>
      </Modal>
    </Fragment>
  )
}
