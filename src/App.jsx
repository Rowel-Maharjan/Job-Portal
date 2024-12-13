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
        element: <Onboarding />
      },
      {
        path: '/jobs',
        element: <JobListing />
      },
      {
        path: '/job/:id',
        element: <Job />
      },
      {
        path: '/postjob',
        element: <PostJob />
      },
      {
        path: '/savejob',
        element: <SavedJob />
      },
      {
        path: '/myjobs',
        element: <MyJob />
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
