import type { DropzoneOptions } from 'react-dropzone'

export const DEFAULT_OPTIONS: DropzoneOptions = {
  accept: {
    // 'image/png, image/gif, image/jpeg'
    'image/png': [],
    'image/gif': [],
    'image/jpeg': [],
  },
  maxFiles: 1,
  maxSize: 1e7,
}
