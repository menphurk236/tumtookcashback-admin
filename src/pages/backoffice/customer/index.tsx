import { Fragment, useMemo, useState } from 'react'

import clsx from 'clsx'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'

import { Button, Input, SvgIcon, Table } from '@/components/UI'
import { formatNumber } from '@/utils/format/number'
import type { TableColumn } from '@/components/UI/Table'
import { Pagination } from '@/components/UI/Pagination'
import EditButton from '@/components/UI/Button/EditButton'
import DeleteButton from '@/components/UI/Button/DeleteButton'
import ViewButton from '@/components/UI/Button/ViewButton'
import ConfirmModal from '@/components/UI/ConfirmModal'
import { CustomerService } from '@/services'
import SimplePageLoader from '@/components/UI/PageLoader/SimplePageLoader'
import { handleAxiosErrorMsg } from '@/libs/axios'

import type { ICustomerQueryParams, ISimpleCustomer } from '@/types/modules/customer'
import { useBackofficeLayout } from '@/hooks'

export const CustomerPage = () => {
  const { scrollToTop } = useBackofficeLayout()

  // _State
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [search, setSearch] = useState<string>('')
  const [queryParams, setQueryParams] = useState<ICustomerQueryParams>({
    page: 1,
    perPage: 50,
    search: '',
  })

  //_ Query
  const { data, isLoading, refetch } = useQuery(
    ['get-contact-list', queryParams],
    ({ signal }) => CustomerService.list(queryParams, { signal }),
    {
      onSuccess: scrollToTop,
    },
  )

  // _Mutation
  const { mutate: deleteCustomer, isLoading: isDeleteCustomerLoading } = useMutation(
    (id: string | number) => CustomerService.delete(id),
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
          title: 'ชื่อ',
          dataIndex: 'name',
          className: clsx(`min-w-[140px]`),
        },
        // {
        //   title: 'ชื่อบริษัท',
        //   dataIndex: 'company',
        //   align: 'center',
        //   className: clsx(`min-w-[160px]`),
        // },
        {
          title: 'เบอร์โทร',
          dataIndex: 'tel',
          align: 'center',
          className: clsx(`min-w-[100px]`),
        },
        {
          title: 'หมายเลขผู้เสียภาษี',
          dataIndex: 'tax',
          align: 'center',
          className: clsx(`min-w-[160px]`),
        },
        {
          title: 'ยอดคงเหลือ',
          dataIndex: 'balance',
          align: 'center',
          className: clsx(`min-w-[150px]`),
          render: (val) => {
            return `${formatNumber({ number: val })}฿`
          },
        },
        {
          dataIndex: 'actions',
          title: '',
          align: 'right',
          className: clsx(`w-[100px] min-w-[120px]`),
          render: (_val, record) => (
            <div className={clsx(`flex items-center space-x-2`)}>
              <Link to={`/backoffice/balance/${record.id}`}>
                <ViewButton />
              </Link>
              <Link to={`/backoffice/customer/${record.id}/edit`}>
                <EditButton />
              </Link>
              <DeleteButton onClick={() => setDeleteId(record.id)} />
            </div>
          ),
        },
      ] as TableColumn<ISimpleCustomer>[],
    [],
  )

  // if (isLoading) return <SimplePageLoader />

  return (
    <Fragment>
      <h3 className={clsx(`text-header-3`)}>ข้อมูลลูกค้า</h3>

      <div className={clsx(`mb-6 mt-6 flex items-center`, `sm:flex-col sm:items-start sm:space-y-4`)}>
        <Link to="/backoffice/customer/create">
          <Button variant="success" buttonType="icon-text" size="medium" className={clsx(`sm:w-full`)}>
            <SvgIcon name="backoffice-plus-circle" />
            <span>เพิ่มข้อมูลลูกค้า</span>
          </Button>
        </Link>

        <form
          className={clsx(`ml-auto flex items-center space-x-2`, `sm:ml-0 sm:w-full`)}
          onSubmit={(e) => {
            e.preventDefault()
            setQueryParams((state) => ({
              ...state,
              search,
            }))
          }}
        >
          <Input
            name="search"
            suffix={<SvgIcon name="search" className={clsx(`square-6`)} />}
            placeholder="ค้นหา"
            className={clsx(`w-[300px]`, `sm:flex-1`)}
            value={search}
            onChange={(e) => {
              e.preventDefault()
              setSearch(e.target.value)
              setQueryParams((state) => ({
                ...state,
                search: e.target.value,
              }))
            }}
          />
          {/*<Button variant="primary-solid" type="submit" className={clsx(`min-h-[40px] !px-4`)}>*/}
          {/*  ค้นหา*/}
          {/*</Button>*/}
        </form>
      </div>
      {isLoading ? (
        <SimplePageLoader />
      ) : (
        <Table rowKey={(_, index) => index} columns={columns} dataSource={data.items} />
      )}
      <Pagination
        className={clsx(`mt-6 w-full`)}
        current={queryParams.page}
        total={data?.total}
        pageSize={queryParams.perPage}
        showLessItems
        onChange={(e) => {
          setQueryParams((state) => ({
            ...state,
            page: e,
          }))
        }}
      />

      <ConfirmModal
        visible={!!deleteId}
        title="ยืนยันการลบ"
        cancelText="ยกเลิก"
        confirmText="ลบ"
        onConfirm={() => {
          deleteCustomer(deleteId)
        }}
        onCancel={() => {
          setDeleteId(null)
        }}
        closeModal={() => {
          setDeleteId(null)
        }}
        isLoading={isDeleteCustomerLoading}
      >
        <p>คุณต้องการลบรายการนี้ ใช่หรือไม่?</p>
      </ConfirmModal>
    </Fragment>
  )
}
