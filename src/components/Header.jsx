import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import logo from '../assets/logo.png'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'

const Header = () => {
  return (
    <nav className=' flex justify-between items-center'>
      <Link>
        <img className='h-32 w-32 invert' src={logo} alt="" />
      </Link>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </nav>
  )
}

export default Header
