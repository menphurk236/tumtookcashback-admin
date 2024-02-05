import type { IBackofficeLayoutMenuItem } from '@/layouts/Backoffice/types'

export const BACKOFFICE_SIDEBAR_CONFIG: IBackofficeLayoutMenuItem[] = [
  {
    key: 'dashboard',
    iconName: 'backoffice-dashboard',
    label: `Dashboard`,
    path: '/backoffice/dashboard',
  },
  {
    key: 'customer',
    iconName: 'backoffice-customer',
    label: `ข้อมูลลูกค้า`,
    path: '/backoffice/customer',
  },
  {
    key: 'balance',
    iconName: 'backoffice-balance',
    label: `ยอดคงเหลือ`,
    path: '/backoffice/balance',
  },
  {
    key: 'balance',
    iconName: 'backoffice-admin',
    label: `ผู้ใช้ Admin`,
    path: '/backoffice/admin',
  },
  // {
  //   key: 'submenu1',
  //   icon: 'loader',
  //   label: 'Submenu',
  //   items: [
  //     {
  //       label: 'menu1',
  //       path: '/app/sub1',
  //     },
  //   ],
  // },
]
