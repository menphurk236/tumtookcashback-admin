import type { Key, ReactNode, TableHTMLAttributes, ThHTMLAttributes } from 'react'
import { useEffect, useState, useRef } from 'react'

import clsx from 'clsx'

export type TableColumn<T> = Omit<ThHTMLAttributes<HTMLTableCellElement>, 'title'> & {
  title: ReactNode
  dataIndex: string
  colSpan?: number
  rowSpan?: number
  onCell?: (record?: T, index?: number) => ThHTMLAttributes<HTMLTableCellElement>
  render?: (value: any, record?: T, index?: number) => ReactNode
}

export interface ITableProps<T> extends TableHTMLAttributes<HTMLTableElement> {
  className?: string
  tableClassName?: string
  headerClassName?: string
  headerRowClassName?: string
  bodyClassName?: string
  bodyRowClassName?: string
  maxHeight?: number
  minWidth?: number
  rowKey?: (record?: T, index?: number) => Key
  columns: TableColumn<T>[]
  dataSource: T[]
  loading?: boolean
  loadingMsg?: string
}

const Table = <T,>({
  className,
  tableClassName,
  bodyClassName,
  bodyRowClassName,
  headerClassName,
  headerRowClassName,
  minWidth,
  maxHeight,
  rowKey,
  columns,
  dataSource,
  loading,
  loadingMsg = `Loading`,
  ...props
}: ITableProps<T>) => {
  const tableBody = useRef<HTMLTableSectionElement>()

  const [isBodyHasScroll, setIsBodyHasScroll] = useState<boolean>(false)

  // _Effect
  useEffect(() => {
    if (maxHeight && tableBody.current) {
      if (tableBody.current.querySelector('.table-body-row')) {
        const rowHeight = tableBody.current.querySelector('.table-body-row').clientHeight
        const rowLength = tableBody.current.querySelectorAll('.table-body-row').length
        const contentHeight = rowHeight * rowLength

        setIsBodyHasScroll(maxHeight < contentHeight)
      }
    }
  }, [maxHeight])

  return (
    <div className={clsx(`table-wrapper`, className)}>
      <table
        className={clsx(`table`, isBodyHasScroll ? `has-scroll-body` : ``, tableClassName)}
        style={{
          ...(minWidth
            ? {
                minWidth,
              }
            : {}),
        }}
        {...props}
      >
        <thead className={clsx(`table-header`, headerClassName)}>
          <tr className={clsx(`table-header-row`, headerRowClassName)}>
            {columns.map((column, idx) => {
              if (column?.colSpan === 0) return

              return (
                <th
                  key={`${column.dataIndex}-${idx}`}
                  className={clsx(`table-th`, column.className)}
                  colSpan={column.colSpan}
                  rowSpan={column.rowSpan}
                  align={column.align}
                >
                  {column.title}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody ref={tableBody} className={clsx(`table-body`, bodyClassName)}>
          {!loading &&
            dataSource.map((data, idx) => {
              return (
                <tr key={rowKey?.(data, idx) ?? `row-${idx}`} className={clsx(`table-body-row`, bodyRowClassName)}>
                  {columns.map((column, columnIdx) => {
                    const cellProps = column.onCell?.(data, idx) ?? {}

                    if (!!cellProps && (cellProps.colSpan === 0 || cellProps.rowSpan === 0)) return

                    const { className: cellClassName, ...cellPropsRest } = cellProps

                    return (
                      <td
                        key={`${rowKey?.(data, idx) ?? `col-${idx}`}-${column.dataIndex}-${columnIdx}`}
                        className={clsx(`table-td`, cellClassName)}
                        align={column.align}
                        {...cellPropsRest}
                      >
                        {!!column?.render ? column.render(data[column.dataIndex], data, idx) : data[column.dataIndex]}
                      </td>
                    )
                  })}
                </tr>
              )
            })}

          {(dataSource.length === 0 || !!loading) && (
            <tr>
              <td colSpan={columns.length} className="text-center">
                <p
                  className={clsx('text-secondary w-full py-10 text-center text-body-14', {
                    'animate-text-loading': !!loading,
                  })}
                >{`👻 ${loading ? loadingMsg : `No data.`}`}</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Table
