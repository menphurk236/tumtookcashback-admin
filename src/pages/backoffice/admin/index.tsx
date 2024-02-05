import { Fragment, useState, useMemo } from 'react'

import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'

import { Button, Input, SvgIcon, Table } from '@/components/UI'
import { Pagination } from '@/components/UI/Pagination'
import type { TableColumn } from '@/components/UI/Table'
import EditButton from '@/components/UI/Button/EditButton'
import DeleteButton from '@/components/UI/Button/DeleteButton'
import ConfirmModal from '@/components/UI/ConfirmModal'
import { AdminService } from '@/services'
import SimplePageLoader from '@/components/UI/PageLoader/SimplePageLoader'
import { handleAxiosErrorMsg } from '@/libs/axios'
import { useUserStore } from '@/stores/user'

import type { IAdminQueryParams, ISimpleAdmin } from '@/types/modules/admin'
import { useBackofficeLayout } from '@/hooks'
import { RoleAdmin } from '@/enums'

export const AdminPage = () => {
  const { scrollToTop } = useBackofficeLayout()
  const { profile } = useUserStore()

  // _State
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [search, setSearch] = useState<string>('')
  const [queryParams, setQueryParams] = useState<IAdminQueryParams>({
    page: 1,
    perPage: 10,
    search: '',
  })

  //_ Query
  const { data, isLoading, refetch } = useQuery(
    ['get-admin-list', queryParams],
    ({ signal }) => AdminService.list(queryParams, { signal }),
    {
      onSuccess: scrollToTop,
    },
  )

  // _Mutation
  const { mutate: deleteAdmin, isLoading: isDeleteAdminLoading } = useMutation(
    (id: string | number) => AdminService.delete(id),
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
          dataIndex: 'firstName',
          align: 'center',
          className: clsx(`min-w-[160px]`),
        },
        {
          title: 'นามสกุล',
          dataIndex: 'lastName',
          align: 'center',
          className: clsx(`min-w-[160px]`),
        },
        {
          title: 'ชื่อผู้ใช้',
          dataIndex: 'username',
          align: 'center',
          className: clsx(`min-w-[160px]`),
        },
        {
          title: 'บทบาท',
          dataIndex: 'roleText',
          align: 'center',
          className: clsx(`min-w-[160px]`),
        },
        {
          title: 'เบอร์โทร',
          dataIndex: 'tel',
          align: 'center',
          className: clsx(`min-w-[160px]`),
        },
        {
          dataIndex: 'actions',
          title: '',
          align: 'right',
          className: clsx(`w-[120px] min-w-[120px]`),
          render: (_val, record) => {
            if (profile?.role === RoleAdmin.SUPERADMIN) {
              return (
                <div className={clsx(`flex items-center justify-center space-x-2`)}>
                  <Link to={`/backoffice/admin/${record.id}/edit`}>
                    <EditButton />
                  </Link>
                  {record.role !== RoleAdmin.SUPERADMIN && <DeleteButton onClick={() => setDeleteId(record.id)} />}
                </div>
              )
            } else if (profile?.role === RoleAdmin.ADMIN) {
              return (
                <div className={clsx(`flex items-center justify-center space-x-2`)}>
                  {(record.role === RoleAdmin.PARTICIPANT || record.role === RoleAdmin.ADMIN) && (
                    <Link to={`/backoffice/admin/${record.id}/edit`}>
                      <EditButton />
                    </Link>
                  )}
                  {record.role === RoleAdmin.PARTICIPANT && <DeleteButton onClick={() => setDeleteId(record.id)} />}
                </div>
              )
            }
          },
        },
      ] as TableColumn<ISimpleAdmin>[],
    [profile],
  )

  // if (isLoading) return <SimplePageLoader />

  return (
    <Fragment>
      <h3 className={clsx(`text-header-3`)}>ผู้ใช้ Admin</h3>

      <div className={clsx(`mb-6 mt-6 flex items-center`, `sm:flex-col sm:items-start sm:space-y-6`)}>
        <Link to="/backoffice/admin/create">
          <Button variant="success" buttonType="icon-text" size="medium">
            <SvgIcon name="backoffice-plus-circle" />
            <span>เพิ่มข้อมูลผู้ดูแล</span>
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
          deleteAdmin(deleteId)
        }}
        onCancel={() => {
          setDeleteId(null)
        }}
        closeModal={() => {
          setDeleteId(null)
        }}
        isLoading={isDeleteAdminLoading}
      >
        <p>คุณต้องการลบรายการนี้ ใช่หรือไม่?</p>
      </ConfirmModal>
    </Fragment>
  )
}
