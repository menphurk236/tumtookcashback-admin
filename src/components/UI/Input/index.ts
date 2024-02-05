import type { InputProps, InputRef } from './Input'
import InternalInput from './Input'
import { default as Numeric } from './NumericInput'
import { default as Password } from './Password'
import { default as AutoComplete } from './AutoComplete'
import { default as ImageDropFile } from './DropFile/ImageDropFile'
import { default as ImageDropFileForm } from './DropFile/ImageDropFileForm'

type CompoundedComponent = React.ForwardRefExoticComponent<InputProps & React.RefAttributes<InputRef>> & {
  Numeric: typeof Numeric
  Password: typeof Password
  AutoComplete: typeof AutoComplete
  ImageDropFile: typeof ImageDropFile
  ImageDropFileForm: typeof ImageDropFileForm
}

const Input = InternalInput as CompoundedComponent

Input.Numeric = Numeric
Input.Password = Password
Input.AutoComplete = AutoComplete
Input.ImageDropFile = ImageDropFile
Input.ImageDropFileForm = ImageDropFileForm

export default Input
