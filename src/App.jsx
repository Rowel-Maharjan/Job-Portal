import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider } from "@/components/theme-provider"
import './App.css'
import AppLayout from './layout/AppLayout'
import LandingPage from './pages/LandingPage'
import Onboarding from './pages/Onboarding'
import JobListing from './pages/JobListing'
import Job from './pages/Job'
import PostJob from './pages/PostJob'
import SavedJob from './pages/SavedJob'
import MyJob from './pages/MyJob'
import ProtectedRoutes from './components/ProtectedRoutes'

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <LandingPage />
      },
      {
        path: '/onboarding',
        element:
          (<ProtectedRoutes>
            <Onboarding />
          </ProtectedRoutes>)
      },
      {
        path: '/jobs',
        element:
          (<ProtectedRoutes>
            <JobListing />
          </ProtectedRoutes>)
      },
      {
        path: '/job/:id',
        element:
          (<ProtectedRoutes>
            <Job />
          </ProtectedRoutes>)
      },
      {
        path: '/postjob',
        element:
          (<ProtectedRoutes>
            <PostJob />
          </ProtectedRoutes>)
      },
      {
        path: '/savejob',
        element:
          (<ProtectedRoutes>
            <SavedJob />
          </ProtectedRoutes>)
      },
      {
        path: '/myjobs',
        element:
          (<ProtectedRoutes>
            <MyJob />
          </ProtectedRoutes>)
      },
    ]
  }


])

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
