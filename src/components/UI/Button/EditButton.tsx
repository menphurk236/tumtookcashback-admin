import type { FC } from 'react'

import SvgIcon from '../SvgIcon'
import type { ButtonProps } from './types'

import Button from '.'

const EditButton: FC<ButtonProps> = ({ ...props }) => {
  return (
    <Button variant="warning" buttonType="icon" size="medium" rounder="full" isInvert {...props}>
      <SvgIcon name="edit" />
    </Button>
  )
}

export default EditButton
