import { getApplications } from '@/api/api.application'
import useFetch from '@/hooks/useFetch';
import { useUser } from '@clerk/clerk-react';
import React, { useEffect } from 'react'
import { BarLoader } from 'react-spinners';
import ApplicationCard from './ApplicationCard';

const CreatedApplications = () => {
    const { isLoaded, user } = useUser();
    const {
        loading: loadingApplications,
        data: applications,
        fn: fnApplications,
    } = useFetch(getApplications, {
        user_id: user.id
    })

    useEffect(() => {
        if (isLoaded)
            fnApplications()
    }, [isLoaded])

    if (!isLoaded || loadingApplications) {
        return <BarLoader className='mb-4' width={"100%"} color='#36d7b7' />
    }

    return (
        <div className='flex flex-col gap-2'>
            {
                applications?.map((application) => (
                    <ApplicationCard application={application} key={application.id} isCandidate={true} />
                ))
            }
            {
                applications?.length === 0 && (
                    <h2 className="text-2xl text-gray-500 font-bold">No Job Applied Yet.</h2>
                )
            }

        </div>
    )
}

export default CreatedApplications
