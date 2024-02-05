import * as yup from 'yup'

// import { isValidFileType } from './form'

export const validateFieldImage = yup.mixed().required('กรุณาเลือกรูปภาพ')
// .test('is-valid-type', 'ประเภทรูปภาพไม่ถูกต้อง', (value) =>
//   isValidFileType(value && value.name.toLowerCase(), 'image'),
// )
