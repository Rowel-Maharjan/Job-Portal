import { getSingleJob, updateHiringStatus } from '@/api/apiJobs'
import ApplicationCard from '@/components/ApplicationCard'
import ApplyJob from '@/components/ApplyJob'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import useFetch from '@/hooks/useFetch'
import { useUser } from '@clerk/clerk-react'
import MarkdownEditor from '@uiw/react-markdown-editor'
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from 'lucide-react'
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { BarLoader } from 'react-spinners'

const Job = () => {

  const { isLoaded, user } = useUser()
  const { id } = useParams()

  const {
    loading: loadingJob,
    data: job,
    fn: fnJob,
  } = useFetch(getSingleJob, { job_id: id });

  const {
    loading: loadingHiringStatus,
    fn: fnHiringStatus,
  } = useFetch(updateHiringStatus, { job_id: id });

  const handleStatusChange = (value) => {
    const isOpen = value === "open"
    fnHiringStatus(isOpen).then(() => {
      fnJob()
    })
  }

  useEffect(() => {
    if (isLoaded)
      fnJob()
  }, [isLoaded])

  if (!isLoaded || loadingJob) {
    return <BarLoader className='mb-4' width={"100%"} color='#36d7b7' />;
  }



  return (
    <div className='flex flex-col gap-8 mt-5'>
      <div className='flex flex-col-reverse gap-6 md:flex-row justify-between items-center'>
        <h1 className='gradient-title font-extrabold pb-3 text-4xl sm:text-6xl'>{job?.title}</h1>
        <img className='h-12' src={job?.company?.logo_url} alt={job?.company?.name} />
      </div>

      <div className='flex justify-between'>
        <div className='flex gap-2'>
          <MapPinIcon />
          {job?.location}
        </div>

        <div className='flex gap-2'>
          <Briefcase /> {job?.applications?.length} Applicants
        </div>

        <div className='flex gap-2'>
          {
            job?.isOpen ? (
              <>
                <DoorOpen /> <span className='text-green-500 font-bold'>Open</span>
              </>) : (
              <>
                <DoorClosed /> <span className='text-red-500 font-bold'>Closed</span>
              </>
            )

          }
        </div>
      </div>

      {/* hiring status */}
      {
        loadingHiringStatus && <BarLoader width={"100%"} color='#36d7b7' />
      }
      {
        job?.recruiter_id === user?.id && (
          <Select onValueChange={handleStatusChange}>
            <SelectTrigger className={`w-full ${job?.isOpen ? "bg-green-950" : "bg-red-950"}`}>
              <SelectValue
                placeholder={
                  "Hiring Status " + (job?.isOpen ? "( Open )" : "( Closed )")
                } />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        )
      }


      <h2 className='text-[#1b69ca] text-2xl sm:text-3xl font-bold'>
        About the Job
      </h2>

      <p className='sm:text-lg'>{job?.description}</p>

      <h2 className=' text-[#1b69ca] text-2xl sm:text-3xl font-bold'>
        What we are looking for
      </h2>

      <MarkdownEditor.Markdown
        source={job?.requirements}
        className='bg-transparent sm:text-lg'
      />

      {/* render application  */}
      {
        job?.recruiter_id !== user?.id && <ApplyJob job={job} user={user} fetchJob={fnJob} applied={job?.applications?.find(a => a.candidate_id === user.id)} />
      }

      {
        job?.recruiter_id === user?.id && job?.applications?.length > 0 && (
          <div className='flex flex-col gap-2'>
            <h2 className='text-[#1b69ca] text-2xl sm:text-3xl font-bold'>Applications</h2>
            {
              job?.applications.map((application)=>{
                return <ApplicationCard 
                  key={application.id}
                  application={application}
                />
              })
            }

          </div>
        )
      }

    </div>
  )
}

export default Job
