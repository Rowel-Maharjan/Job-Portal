import { useUser } from '@clerk/clerk-react'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Heart, MapPinIcon, Trash2Icon } from 'lucide-react'
import { Button } from './ui/button'
import { deleteJob, saveJobs } from '@/api/apiJobs'
import useFetch from '@/hooks/useFetch'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { BarLoader } from 'react-spinners'


const JobCard = ({ job, isMyJob = false, savedInit = false, onJobSaved = () => { } }) => {
    const [saved, setSaved] = useState(savedInit);
    const { fn, data, loading, error } = useFetch(saveJobs, { alreadySaved: saved })
    const { user } = useUser()

    const handleSaveJob = async (e) => {
        e.stopPropagation()
        e.preventDefault()
        await fn({ user_id: user.id, job_id: job.id })
        onJobSaved();
    }

    const {
        loading: loadingDeleteJob,
        fn: fnDeleteJob,
    } = useFetch(deleteJob, { job_id: job.id })

    const handleDeleteJob = async (e) => {
        e.stopPropagation()
        e.preventDefault()
        await fnDeleteJob()
        onJobSaved();
    }



    useEffect(() => {
        if (data !== undefined)
            setSaved(data?.length > 0)
    }, [data])

    const navigate = useNavigate()

    return (
        <>
            <Card onClick={() => { navigate(`/jobs/${job.id}`); }} className='flex cursor-pointer flex-col w-full'>
                {
                    loadingDeleteJob && <BarLoader width={"100%"} color='#36d7b7' />
                }
                <CardHeader>
                    <CardTitle className='flex justify-between font-bold'>{job.title}
                        {
                            isMyJob && (
                                <Trash2Icon
                                    fill='red'
                                    size={18}
                                    className='text-red-300 cursor-pointer'
                                    onClick={handleDeleteJob}
                                />
                            )
                        }
                    </CardTitle>
                </CardHeader>

                <CardContent className="flex flex-col gap-4 flex-1">
                    <div className='flex justify-between'>
                        {job.company && <img src={job.company.logo_url} alt={job.company.name} className='h-6' />
                        }
                        <div className='flex gap-2 items-center'>
                            <MapPinIcon size={15} />{job.location}
                        </div>
                    </div>
                    <hr />
                    {job.description.split(".")[0] + '...'}
                </CardContent>
                <CardFooter className="flex gap-3">
                    <Link onClick={(e) => e.stopPropagation()} to={`/jobs/${job.id}`} className='flex-1'>
                        <Button className="w-full" variant="secondary">
                            More Details
                        </Button>
                    </Link>


                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                {
                                    !isMyJob && (
                                        <Button variant="outline" className="w-15" onClick={handleSaveJob} disabled={loading}>
                                            {
                                                saved ?
                                                    <Heart size={25} stroke='red' fill='red' /> :
                                                    <Heart size={25} stroke='red' />
                                            }
                                        </Button>
                                    )
                                }
                            </TooltipTrigger>
                            <TooltipContent side="bottom">
                                {
                                    saved ? <p>Unsave Job</p> : <p>Save Job</p>
                                }
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                </CardFooter>
            </Card>

        </>
    )
}

export default JobCard
