import type { FC } from 'react'

import SvgIcon from '../SvgIcon'
import type { ButtonProps } from './types'

import Button from '.'

const ViewButton: FC<ButtonProps> = ({ ...props }) => {
  return (
    <Button variant="info" buttonType="icon" size="medium" rounder="full" isInvert {...props}>
      <SvgIcon name="search" />
    </Button>
  )
}

export default ViewButton
