import type { FC } from 'react'

import SvgIcon from '../SvgIcon'
import type { ButtonProps } from './types'

import Button from '.'

const DeleteButton: FC<ButtonProps> = ({ ...props }) => {
  return (
    <Button variant="danger" buttonType="icon" size="medium" rounder="full" isInvert {...props}>
      <SvgIcon name="delete" />
    </Button>
  )
}

export default DeleteButton
