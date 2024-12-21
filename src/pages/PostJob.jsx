import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { z } from 'zod'
import allDistricts from './config'
import useFetch from '@/hooks/useFetch'
import { getCompanies } from '@/api/api.Company'
import { useUser } from '@clerk/clerk-react'
import { BarLoader } from 'react-spinners'
import { Navigate, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import MDEditor from '@uiw/react-md-editor'
import { addNewJob } from '@/api/apiJobs'
import AddCompanyDrawer from '@/components/AddCompanyDrawer'

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Select a Location" }),
  company_id: z.string().min(1, { message: "Select or Add a new Company" }),
  requirements: z.string().min(1, { message: "Requirements are required" }),

})
const PostJob = () => {
  const { user, isLoaded } = useUser()
  const navigate = useNavigate()

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      description: '',
      location: '',
      company_id: '',
      requirements: '',
    },
    resolver: zodResolver(schema)
  })

  const {
    fn: fnCompanies,
    data: companies,
    loading: loadingCompanies
  } = useFetch(getCompanies)

  const {
    fn: fnCreateJob,
    error: errorCreateJob,
    data: dataCreateJob,
    loading: loadingCreateJob
  } = useFetch(addNewJob)

  const onSubmit = (data) => {
    fnCreateJob({ ...data, recruiter_id: user.id, isOpen: true })
  }

  useEffect(() => {
    if (dataCreateJob?.length > 0) {
      navigate("/jobs")
    }
  }, [loadingCreateJob])

  useEffect(() => {
    if (isLoaded)
      fnCompanies()
  }, [isLoaded])

  if (!isLoaded || loadingCompanies) {
    return <BarLoader className='mb-4' width={"100%"} color='#36d7b7' />
  }

  if (user?.unsafeMetadata.role !== "recruiter") {
    return <Navigate to="/jobs" />
  }


  return (
    <div>
      <h1 className='gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8'>Post a Job</h1>

      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 p-4 pb-0'>
        <Input
          type="string"
          placeholder="Job Title"
          className="flex-1"
          {...register("title")}
        />
        {
          errors.title && <p className="text-red-500">{errors.title.message}</p>
        }

        <Textarea
          className="whitespace-pre-wrap"
          placeholder="Job Description"
          {...register("description")}
        />
        {errors.description && <p className="text-red-500">{errors.description.message}</p>}

        <div className='flex flex-col gap-4 md:flex-row items-center'>
          <div className='flex gap-4 w-full'>
            <Controller
              name='location'
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {
                        allDistricts.map((district) => {
                          return <SelectItem key={district} value={district}>{district}</SelectItem>
                        })

                      }
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />

            <Controller
              name='company_id'
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Company">
                      {companies?.find((company) => company.id === Number(field.value))?.name || 'Select Company'}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {
                        companies?.map((company) => {
                          return <SelectItem key={company.name} value={company.id}>{company.name}</SelectItem>
                        })

                      }
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          {/* Add Company Drawer  */}
          <AddCompanyDrawer fetchCompanies={fnCompanies} />
        </div>
        {
          errors.location && <p className="text-red-500">{errors.location.message}</p>
        }
        {
          errors.company_id && <p className="text-red-500">{errors.company_id.message}</p>
        }




        <Controller
          name='requirements'
          control={control}
          render={({ field }) => (

            <MDEditor
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {
          errors.requirements && <p className="text-red-500">{errors.requirements.message}</p>
        }

        {
          loadingCreateJob && <BarLoader width={"100%"} color='#36d7b7' />
        }

        {
          errorCreateJob?.message && <p className="text-red-500">{errorCreateJob?.message}</p>
        }

        <Button type="submit" variant="blue" size="lg">
          Post Job
        </Button>

      </form>



    </div>
  )
}

export default PostJob
