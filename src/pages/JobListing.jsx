import React, { useEffect, useState } from 'react'
import { getJobs } from '@/api/apiJobs'
import { useSession, useUser } from '@clerk/clerk-react'
import useFetch from '@/hooks/useFetch'
import { BarLoader } from 'react-spinners'
import JobCard from '@/components/JobCard'

const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [location, setLocation] = useState("")
  const [comapany_id, setComapany_id] = useState("")

  const { isLoaded } = useUser()

  const { session } = useSession()
  const { fn, data, loading, error } = useFetch(getJobs, { location, comapany_id, searchQuery })

  useEffect(() => {
    if (session)
      fn()
  }, [session, location, comapany_id, searchQuery])

  if (!isLoaded) {
    return <BarLoader className='mb-4' width={"100%"} color='#36d7b7' />;
  }

  return (
    <div>
      <h1 className='gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8'>Latest Jobs</h1>
      {
        loading ? <BarLoader className='mb-4' width={"100%"} color='#36d7b7' /> :
          (
            <div className='mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {data?.length > 0 ?
                data?.map((job) => {
                  return <JobCard key={job.id} job={job} savedInit={job?.saved?.length > 0} />
                }) :
                (
                  <h2 className='text-2xl font-bold text-center'>No Jobs Found</h2>
                )}
            </div>
          )
      }


    </div>
  )
}

export default JobListing
