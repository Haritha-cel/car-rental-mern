import React, { useEffect, useState } from 'react'
import NavbarOwner from '../../components/owner/NavbarOwner'
import Sidebar from '../../components/owner/Sidebar'
import { Outlet, useLocation } from 'react-router-dom'
import { useAppContext } from '../../context/AppContext'
import { assets } from '../../assets/assets'

const Layout = () => {
  const { isOwner, navigate } = useAppContext()
  const location = useLocation() // ✅ Used to detect route changes
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!isOwner) {
      navigate('/')
    }
  }, [isOwner])

  // ✅ Automatically close mobile menu when navigating to a new page
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  return (
    <div className='flex flex-col min-h-screen'>
      <NavbarOwner />
      
      <div className='flex flex-1 relative'>
        
        {/* Floating Mobile Menu Button */}
        <button 
          className='fixed bottom-6 right-6 z-50 md:hidden w-14 h-14 bg-primary text-white rounded-full shadow-2xl flex items-center justify-center cursor-pointer'
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <img src={assets.menu_icon} alt="menu" className='w-6 h-6 invert brightness-0' />
        </button>

        {/* Dark Overlay when mobile menu is open */}
        {isMobileMenuOpen && (
          <div 
            className='fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity'
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar Wrapper - Handles the sliding animation & proper width */}
        <div className={`
          fixed md:static inset-y-0 left-0 z-40 
          transform transition-transform duration-300 ease-in-out
          w-60 md:w-64 // ✅ Fixes the thin sidebar issue on desktop
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0
        `}>
          <Sidebar />
        </div>

        {/* Main Content Area */}
        <div className='flex-1 overflow-y-auto bg-white'>
          <Outlet />
        </div>

      </div>
    </div>
  )
}

export default Layout