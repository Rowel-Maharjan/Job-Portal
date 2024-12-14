import { useUser } from '@clerk/clerk-react'
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

const ProtectedRoutes = ({ children }) => {
    const { isSignedIn, user, isLoaded } = useUser()
    const location = useLocation()

    if (isLoaded && !isSignedIn && isSignedIn !== undefined) {
        return <Navigate to="/?sign-in=true" />
    }

    if (user !== undefined && !user?.unsafeMetadata.role && location.pathname !== "/onboarding") {
        return <Navigate to="/onboarding" />
    }

    return children
}

export default ProtectedRoutes
