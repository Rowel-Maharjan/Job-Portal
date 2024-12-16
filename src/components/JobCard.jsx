import { useUser } from '@clerk/clerk-react'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Heart, MapPinIcon, Trash2Icon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { saveJobs } from '@/api/apiJobs'
import useFetch from '@/hooks/useFetch'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'


const JobCard = ({ job, isMyJob = false, savedInit = false, onJobSaved = () => { } }) => {
    const [saved, setSaved] = useState(savedInit);
    const { fn, data, loading, error } = useFetch(saveJobs, { alreadySaved: saved })
    const { user } = useUser()

    const handleSaveJob = async (e) => {
        e.preventDefault()
        await fn({ user_id: user.id, job_id: job.id })
        onJobSaved();
    }

    useEffect(() => {
        if (data !== undefined)
            setSaved(data?.length > 0)
    }, [data])

    return (
        <>
            <Link to={`/jobs/${job.id}`} className='flex'>
                <Card className='flex flex-col'>
                    <CardHeader>
                        <CardTitle className='flex justify-between font-bold'>{job.title}
                            {
                                isMyJob && (
                                    <Trash2Icon
                                        fill='red'
                                        size={18}
                                        className='text-red-300 cursor-pointer'
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
                        <Link to={`/jobs/${job.id}`} className='flex-1'>
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
            </Link>
            

        </>
    )
}

export default JobCard
