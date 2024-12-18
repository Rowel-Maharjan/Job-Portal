import { getMyJobs } from '@/api/apiJobs';
import useFetch from '@/hooks/useFetch';
import { useUser } from '@clerk/clerk-react';
import React, { useEffect } from 'react'
import { BarLoader } from 'react-spinners';
import JobCard from './JobCard';

const CreatedJobs = () => {
    const { isLoaded, user } = useUser();
    const {
        loading: loadingCreatedJobs,
        data: createdJobs,
        fn: fnCreatedJobs,
    } = useFetch(getMyJobs, {
        recruiter_id: user.id
    })

    useEffect(() => {
        if (isLoaded)
            fnCreatedJobs()
    }, [isLoaded])

    if (!isLoaded || loadingCreatedJobs) {
        return <BarLoader className='mb-4' width={"100%"} color='#36d7b7' />
    }
    return (
        <div>
            <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {createdJobs?.length > 0 ? (
                    createdJobs?.map((job) => (
                        <JobCard key={job.id} job={job} 
                        onJobSaved={fnCreatedJobs}
                            isMyJob
                        />
                    ))
                ) : (
                    <h2 className="text-2xl text-gray-500 font-bold text-center">No Job Created Yet.</h2>
                )}
            </div>
        </div>
    )
}

export default CreatedJobs
