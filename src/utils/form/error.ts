import { getIn } from 'formik'
import type { FormikTouched, FormikErrors } from 'formik'

export const getErrorWithTouched = (formik: any, key: string) => {
  return formik.touched?.[key] ? formik.errors?.[key] : undefined
}

export const getErrorWithTouchedComponent = (errors: FormikErrors<any>, touched: FormikTouched<any>, key: string) => {
  const touchedField = getIn(touched, key)
  const errorField = getIn(errors, key)

  return touchedField && errorField ? errorField : undefined
}
