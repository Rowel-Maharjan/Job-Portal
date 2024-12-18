import { getSavedJobs } from '@/api/apiJobs'
import JobCard from '@/components/JobCard'
import useFetch from '@/hooks/useFetch'
import { useUser } from '@clerk/clerk-react'
import React, { useEffect } from 'react'
import { BarLoader } from 'react-spinners'

const SavedJob = () => {

  const { isLoaded } = useUser()

  const {
    loading: loadingSavedJob,
    data: savedJob,
    fn: fnSavedJob,
  } = useFetch(getSavedJobs)

  useEffect(() => {
    if (isLoaded)
      fnSavedJob()
  }, [isLoaded])


  if (!isLoaded || loadingSavedJob) {
    return <BarLoader className='mb-4' width={"100%"} color='#36d7b7' />
  }


  return (
    <div>
      <h1 className='gradient-title text-6xl font-extrabold sm:text-7xl text-center pb-8'>
        Saved Jobs
      </h1>

      {
        loadingSavedJob === false && (
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedJob?.length > 0 ? (
              savedJob?.map((saved) => (
                <JobCard key={saved.id} job={saved.job} savedInit={true} onJobSaved={fnSavedJob} />
              ))
            ) : (
              <h2 className="text-2xl text-gray-500 font-bold text-center">No Saved Jobs Found</h2>
            )}
          </div>

        )
      }


    </div>
  )
}

export default SavedJob
