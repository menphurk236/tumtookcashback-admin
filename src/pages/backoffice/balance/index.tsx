import { Fragment, useMemo, useState } from 'react'

import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import ViewButton from '@/components/UI/Button/ViewButton'
import { formatNumber } from '@/utils/format/number'
import type { TableColumn } from '@/components/UI/Table'
import Table from '@/components/UI/Table'
import { Input, SvgIcon } from '@/components/UI'
import { Pagination } from '@/components/UI/Pagination'
import { TransactionService } from '@/services'
import SimplePageLoader from '@/components/UI/PageLoader/SimplePageLoader'

import { useBackofficeLayout } from '@/hooks'
import type { ISimpleTransaction, ITransactionQueryParams } from '@/types/modules/transaction'

export const BalancePage = () => {
  const { scrollToTop } = useBackofficeLayout()

  // _State
  const [search, setSearch] = useState<string>('')
  const [queryParams, setQueryParams] = useState<ITransactionQueryParams>({
    page: 1,
    perPage: 10,
    search: '',
  })

  //_ Query
  const { data, isLoading } = useQuery(
    ['get-transaction-list', queryParams],
    ({ signal }) => TransactionService.list(queryParams, { signal }),
    {
      onSuccess: scrollToTop,
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
          title: 'หมายเลขผู้เสียภาษี',
          dataIndex: 'tax',
          align: 'center',
          className: clsx(`min-w-[140px]`),
        },
        {
          title: 'เบอร์โทร',
          dataIndex: 'tel',
          align: 'center',
          className: clsx(`min-w-[100px]`),
        },
        {
          title: 'วันที่',
          dataIndex: 'createdAt',
          align: 'center',
          className: clsx(`min-w-[100px]`),
        },
        {
          title: 'ได้รับ Cashback',
          dataIndex: 'deposit',
          align: 'center',
          className: clsx(`min-w-[100px]`),
          render: (val) => {
            if (val > 0) {
              return <div className={clsx(`text-green-600`)}>+{formatNumber({ number: val })}</div>
            } else {
              return 0
            }
          },
        },
        {
          title: 'ใช้ Cashback',
          dataIndex: 'withdraw',
          align: 'center',
          className: clsx(`min-w-[100px]`),
          render: (val) => {
            if (val > 0) {
              return <div className={clsx(`text-red-600`)}>-{formatNumber({ number: val })}</div>
            } else {
              return 0
            }
          },
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
          title: 'ผู้ทำรายการ',
          dataIndex: 'createdBy',
          align: 'center',
          className: clsx(`min-w-[150px]`),
        },
        {
          dataIndex: 'actions',
          title: '',
          align: 'right',
          className: clsx(`w-[100px] min-w-[120px]`),
          render: (_val, record) => (
            <div className={clsx(`flex items-center space-x-2`)}>
              <Link to={`/backoffice/balance/${record.customerId}`}>
                <ViewButton />
              </Link>
            </div>
          ),
        },
      ] as TableColumn<ISimpleTransaction>[],
    [],
  )

  // if (isLoading) return <SimplePageLoader />

  return (
    <Fragment>
      <h3 className={clsx(`text-header-3`)}>ยอดคงเหลือ</h3>

      <div className={clsx(`mb-6 mt-6 flex items-center`, `sm:flex-col sm:items-start sm:space-y-6`)}>
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
    </Fragment>
  )
}
