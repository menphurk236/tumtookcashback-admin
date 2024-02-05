import React from 'react'

import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { PhotoProvider } from 'react-photo-view'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'

import App from './App.tsx'

import './navbar.css'
import './styles/global.scss'
import 'virtual:svg-icons-register'
import 'react-photo-view/dist/react-photo-view.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <PhotoProvider bannerVisible={false}>
        <QueryClientProvider client={queryClient}>
          <App />

          <Toaster />
        </QueryClientProvider>
      </PhotoProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
