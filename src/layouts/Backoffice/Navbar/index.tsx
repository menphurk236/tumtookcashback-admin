import { Fragment } from 'react'

import clsx from 'clsx'

import { useUserStore } from '@/stores/user'

import UserDropdown from './UserDropdown'

const BackofficeLayoutNavbar = () => {
  const { profile } = useUserStore()

  return (
    <Fragment>
      <UserDropdown
        button={
          <div className={clsx(`flex max-w-[150px] flex-col text-left`, `lg:max-w-[120px]`)}>
            <span className={clsx(`truncate`)}>{`${profile?.firstName} ${profile?.lastName}`}</span>
          </div>
        }
        showCaret={true}
        buttonProps={{
          className: clsx(`space-x-2 !px-0`),
        }}
      />
    </Fragment>
  )
}

export default BackofficeLayoutNavbar
