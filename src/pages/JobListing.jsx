import React, { useEffect, useState } from 'react'
import { getJobs } from '@/api/apiJobs'
import { useSession, useUser } from '@clerk/clerk-react'
import useFetch from '@/hooks/useFetch'
import { BarLoader } from 'react-spinners'
import JobCard from '@/components/JobCard'
import { Input } from '@/components/ui/input'
import { getCompanies } from '@/api/api.Company'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import allDistricts from './config'

const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [location, setLocation] = useState("")
  const [comapany_id, setComapany_id] = useState("")

  const { isLoaded } = useUser()

  const { session } = useSession()
  const { fn, data, loading, error } = useFetch(getJobs, { location, comapany_id, searchQuery })

  const handleSearch = (e) => {
    e.preventDefault()
    let formData = new FormData(e.target)
    const query = formData.get("search-query")
    if (query) {
      setSearchQuery(query);
    }
  }

  const clearFilters = () => {
    setSearchQuery("")
    setLocation("")
    setComapany_id("")
  }

  const {
    fn: fnCompanies,
    data: companies
  } = useFetch(getCompanies)

  console.log(companies)

  useEffect(() => {
    if (session)
      fn()
  }, [session, location, comapany_id, searchQuery])

  useEffect(() => {
    if (session)
      fnCompanies()
  }, [session])

  if (!isLoaded) {
    return <BarLoader className='mb-4' width={"100%"} color='#36d7b7' />;
  }

  return (
    <div>
      <h1 className='gradient-title font-extrabold text-6xl sm:text-7xl text-center pb-8'>Latest Jobs</h1>

      <form onSubmit={handleSearch} className='h-14 flex w-full gap-2 items-center mb-3'>
        <Input type="text" placeholder="Search Jobs by Title..." name="search-query" className="h-full flex-1 px-4 text-md" />

        <Button type="submit" className="h-full sm:w-28" variant="blue">Search</Button>

      </form>

      <div className='flex flex-col sm:flex-row gap-2'>
        <Select value={location} onValueChange={(value) => { setLocation(value) }}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Location" />
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


        <Select value={comapany_id} onValueChange={(value) => { setComapany_id(value) }}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by Company" />
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

        <Button onClick={clearFilters} variant="destructive" className="sm:w-1/2"  >Clear Filter</Button>

      </div>

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
