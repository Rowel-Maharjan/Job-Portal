import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '@/components/Header'

const AppLayout = () => {
  return (
    <div>
      <div className='grid-background'></div>
      <main className='sm:px-10 px-8 md:px-14  min-h-screen'>
        <Header />
        <Outlet />
      </main>
      <div className='p-6 text-center bg-gray-800 mt-10'>Made with ❤️ by Rowel Maharjan</div>
    </div>
  )
}

export default AppLayout
