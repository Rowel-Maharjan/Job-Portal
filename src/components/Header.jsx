import React, { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Button } from './ui/button'
import logo from '../assets/logo.png'
import { SignedIn, SignedOut, SignIn, SignInButton, UserButton, useUser } from '@clerk/clerk-react'
import { BriefcaseBusiness, Heart, PenBox } from 'lucide-react'

const Header = () => {
  const [showSignIn, setshowSignIn] = useState(false)
  const [search, setSearch] = useSearchParams()
  const { user } = useUser()

  useEffect(() => {
    if (search.get('sign-in')) {
      setshowSignIn(true)
    }
  }, [search])


  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget)
      setshowSignIn(false)
    setSearch({})
  }

  return (
    <>
      <nav className='flex justify-between items-center'>
        <Link>
          <img className='h-32 w-32 invert' src={logo} alt="" />
        </Link>
        <div className='flex gap-8'>
          <SignedOut>
            <Button onClick={() => setshowSignIn(true)} variant="outline">Login</Button>
          </SignedOut>
          <SignedIn>

            {user?.unsafeMetadata.role === "recruiter" && (<Link to="/postjob">
              <Button className='rounded-full' variant="destructive">
                <PenBox size={20} className='mr-2' />
                Post a Job
              </Button>
            </Link>)}

            <UserButton appearance={{
              elements: {
                avatarBox: "w-10 h-10"
              }
            }}>
              <UserButton.MenuItems>
                <UserButton.Link label='My Jobs' labelIcon={<BriefcaseBusiness size={15} />} href='/myjobs' />
                <UserButton.Link label='Saved Jobs' labelIcon={<Heart size={15} />} href='/savejob' />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>
      </nav>

      {showSignIn && <div onClick={handleOverlayClick} className='fixed inset-0 flex items-center justify-center bg-black z-10 bg-opacity-50'>
        <SignIn
          signUpFallbackRedirectUrl='/onboarding'
          fallbackRedirectUrl='/onboarding'
        />
      </div>

      }
    </>
  )
}

export default Header
