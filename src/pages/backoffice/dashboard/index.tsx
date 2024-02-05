import { Fragment, useMemo, useState } from 'react'

import clsx from 'clsx'
import { useQuery } from '@tanstack/react-query'

import { Card, Table } from '@/components/UI'
import { formatNumber } from '@/utils/format/number'
import type { TableColumn } from '@/components/UI/Table'
import { DashboardService } from '@/services'
import SimplePageLoader from '@/components/UI/PageLoader/SimplePageLoader'
import { Pagination } from '@/components/UI/Pagination'

import { useBackofficeLayout } from '@/hooks'
import type { IDashboardTransactionQueryParams, ISimpleDashboardTransaction } from '@/types/modules/dashboard'

export const DashboardPage = () => {
  const { scrollToTop } = useBackofficeLayout()

  // _State
  // const [search, setSearch] = useState<string>('')
  const [queryParams, setQueryParams] = useState<IDashboardTransactionQueryParams>({
    page: 1,
    perPage: 10,
    search: '',
  })

  //_ Query
  const { data, isLoading } = useQuery(
    ['get-dashboard', queryParams],
    ({ signal }) => DashboardService.dashboard(queryParams, { signal }),
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
          title: 'เบอร์โทร',
          dataIndex: 'tel',
          align: 'center',
          className: clsx(`min-w-[180px]`),
          // render: (val) => formatDate(val, 'dd/MM/yyyy'),
        },
        {
          title: 'ใช้ Cashback',
          dataIndex: 'withdraw',
          align: 'center',
          className: clsx(`min-w-[180px]`),
          render: (val) => {
            if (val > 0) {
              return <div className={clsx(`text-red-600`)}>-{formatNumber({ number: val })}</div>
            } else {
              return 0
            }
          },
        },
        {
          title: 'ได้รับ Cashback',
          dataIndex: 'deposit',
          align: 'center',
          className: clsx(`min-w-[180px]`),
          render: (val) => {
            if (val > 0) {
              return <div className={clsx(`text-green-600`)}>+{formatNumber({ number: val })}</div>
            } else {
              return 0
            }
          },
        },
        {
          title: 'ยอดคงเหลือ',
          dataIndex: 'balance',
          align: 'center',
          className: clsx(`min-w-[180px]`),
          render: (val) => {
            return `${formatNumber({ number: val })}`
          },
        },
        {
          title: 'ผู้ทำรายการ',
          dataIndex: 'name',
          align: 'center',
          className: clsx(`min-w-[200px]`),
        },
        {
          title: 'เลขที่ใบเสนอราคา',
          dataIndex: 'remark',
          align: 'center',
          className: clsx(`min-w-[200px]`),
        },
      ] as TableColumn<ISimpleDashboardTransaction>[],
    [],
  )

  if (isLoading) return <SimplePageLoader />

  return (
    <Fragment>
      <h3 className={clsx(`text-header-3`)}>Dashboard</h3>

      <div className={clsx(`mt-6 grid grid-cols-4 gap-6`, `2xl:grid-cols-3`, `lg:grid-cols-2`, `sm:grid-cols-1`)}>
        <Card className={clsx(`bg-gradient-primary`)}>
          <h4 className={clsx(`text-header-4 text-white-900`)}>ยอดคงเหลือทั้งหมดในระบบ</h4>
          <div className="flex items-center">
            <div className={clsx(`mt-2 text-white-900`)}>
              <div className={clsx(`text-header-2`)}>
                {formatNumber({ number: data.totalBalance })} <span className={clsx(`text-body-16`)}>บาท</span>
              </div>
            </div>
          </div>
        </Card>
        <Card className={clsx(`bg-gradient-secondary`)}>
          <h4 className={clsx(`text-header-4 text-white-900`)}>ลูกค้าทั้งหมดในระบบ</h4>
          <div className="flex items-center">
            <div className={clsx(`mt-2 text-white-900`)}>
              <div className={clsx(`text-header-2`)}>
                {formatNumber({ number: data.totalCustomer })} <span className={clsx(`text-body-16`)}>คน</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <h3 className={clsx(`mt-6 text-header-3`)}>รายการทั้งหมดของวันนี้</h3>

      <Table
        className={clsx(`mt-6`)}
        rowKey={(_, index) => index}
        columns={columns}
        dataSource={data?.transactionToDay.items}
      />
      <Pagination
        className={clsx(`mt-6 w-full`)}
        current={queryParams.page}
        total={data?.transactionToDay.total}
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
