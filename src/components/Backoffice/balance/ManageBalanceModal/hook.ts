import { create } from 'zustand'

import type { ITransaction } from '@/types/modules/transaction'

interface IState {
  visible: boolean
  data: ITransaction | null
}

interface IActions {
  show: (payload?: ITransaction) => void
  close: VoidFunction
}

export const manageBalanceModal = create<IState & IActions>((set) => ({
  visible: false,
  data: null,
  show: (data?: ITransaction) => {
    set((state) => ({
      ...state,
      visible: true,
      data,
    }))
  },
  close: () => {
    set((state) => ({
      ...state,
      visible: false,
      data: null,
    }))
  },
}))
