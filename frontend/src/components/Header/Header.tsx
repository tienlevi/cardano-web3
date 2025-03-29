import { useState } from 'react'
import { Link } from 'react-router-dom'
import ConnectWallet from './ConnectWallet'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className='bg-white shadow-sm'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex-shrink-0'>
            <ConnectWallet />
          </div>

          <nav className='hidden md:flex space-x-8'>
            <Link to='/' className='text-gray-600 hover:text-gray-900'>
              Home
            </Link>
            <Link to='/transaction' className='text-gray-600 hover:text-gray-900'>
              Transaction
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className='md:hidden'>
            <button
              type='button'
              className='inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className='sr-only'>Open main menu</span>
              {!isMenuOpen ? (
                <svg
                  className='block h-6 w-6'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                </svg>
              ) : (
                <svg
                  className='block h-6 w-6'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className='md:hidden'>
            <div className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
              <Link to='/' className='text-gray-600 hover:text-gray-900'>
                Home
              </Link>
              <Link to='/transaction' className='text-gray-600 hover:text-gray-900'>
                Transaction
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
