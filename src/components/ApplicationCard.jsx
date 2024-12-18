import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Boxes, BriefcaseBusiness, Download, School } from 'lucide-react'
import { updateApplications } from '@/api/api.application'
import { BarLoader } from 'react-spinners'
import useFetch from '@/hooks/useFetch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'

const ApplicationCard = ({ application, isCandidate = false }) => {

    const handleDownload = () => {
        window.open(application?.resume, '_blank');
    }

    const {
        loading: loadingHiringStatus,
        fn: fnHiringStatus,
    } = useFetch(updateApplications, { job_id: application.job_id });

    const handleStatusChange = (status) => {
        fnHiringStatus(status)
    }
    return (
        <Card>
            {
                loadingHiringStatus && <BarLoader width={"100%"} color='#36d7b7' />
            }
            <CardHeader>
                <CardTitle className='flex justify-between font-bold'>
                    {
                        isCandidate ? `${application?.job?.title} at ${application?.job?.company?.name}` :
                            (
                                <div>
                                    <span>{application?.fullName}</span>
                                    <span className='text-gray-500 text-base'> ({application?.email})</span>
                                </div>
                            )


                    }
                    <Download onClick={handleDownload} size={18} className='bg-white text-black rounded-full h-8 w-8 p-1.5 cursor-pointer' />
                </CardTitle>
            </CardHeader>
            <CardContent className='flex flex-col gap-3 flex-1'>
                <div className='flex flex-col md:flex-row justify-between'>
                    <div className='flex gap-2 items-center'>
                        <BriefcaseBusiness size={15} />
                        {application?.experience} Years of Experience
                    </div>
                    <div className='flex gap-2 items-center'>
                        <School size={15} />
                        {application?.education}
                    </div>
                    <div className='flex w-1/2 md:justify-end gap-2 items-center'>
                        <Boxes size={15} />
                        {application?.skills}
                    </div>
                </div>
                <hr />

                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value={application?.id}>
                        <AccordionTrigger>Cover Letter</AccordionTrigger>
                        <AccordionContent>
                            <div className='whitespace-pre-wrap'>
                                {application?.coverLetter}
                            </div>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>


            </CardContent>
            <CardFooter className='flex justify-between'>
                <span>
                    {
                        new Date(application?.created_at).toLocaleString()
                    }
                </span>
                {
                    isCandidate ? (
                        <span className='captitalize font-bold'>Status: {application?.status}</span>
                    ) :
                        (
                            <Select onValueChange={handleStatusChange} defaultValue={application?.status}>
                                <SelectTrigger className="w-52">
                                    <SelectValue
                                        placeholder={
                                            "Application Status"
                                        } />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Applied">Applied</SelectItem>
                                    <SelectItem value="Interviewing">Interviewing</SelectItem>
                                    <SelectItem value="Hired">Hired</SelectItem>
                                    <SelectItem value="Rejected">Rejected</SelectItem>
                                </SelectContent>
                            </Select>
                        )
                }
            </CardFooter>
        </Card>
    )
}

export default ApplicationCard
