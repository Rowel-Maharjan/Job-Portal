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
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const JobListing = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [location, setLocation] = useState("")
  const [comapany_id, setComapany_id] = useState("")
  const [searchQueryValue, setSearchQueryValue] = useState("");

  const { isLoaded } = useUser()

  const { session } = useSession()
  const { fn, data, loading, error } = useFetch(getJobs, { location, comapany_id, searchQuery })

  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;

  const totalPages = Math.ceil(data?.length / jobsPerPage);

  // Get jobs for the current page
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = data?.slice(indexOfFirstJob, indexOfLastJob);

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const renderPageNumbers = () => {
    const pagination = [];
    const maxVisiblePages = 3;

    if (totalPages <= maxVisiblePages + 2) {
      return pageNumbers.map((number) => (
        <Button
          key={number}
          onClick={() => setCurrentPage(number)}
          variant={number === currentPage ? "blue" : "ghost"}

        >
          {number}
        </Button>
      ));
    }

    if (currentPage <= maxVisiblePages) {
      // Show first few pages and ellipsis at the end
      for (let i = 1; i <= maxVisiblePages; i++) {
        pagination.push(
          <Button
            key={i}
            onClick={() => setCurrentPage(i)}
            variant={i === currentPage ? "blue" : "ghost"}
          >
            {i}
          </Button>
        );
      }
      pagination.push(<span key="ellipsis-end" className="px-3 mt-1">...</span>);
    } else if (currentPage > totalPages - maxVisiblePages) {
      // Show ellipsis at the start and last few pages
      pagination.push(<span key="ellipsis-start" className="px-3 mt-1">...</span>);
      for (let i = totalPages - maxVisiblePages + 1; i <= totalPages; i++) {
        pagination.push(
          <Button
            key={i}
            onClick={() => setCurrentPage(i)}
            variant={i === currentPage ? "blue" : "ghost"}
          >
            {i}
          </Button>
        );
      }
    } else {
      pagination.push(<span key="ellipsis-start" className="px-3 mt-1">...</span>);
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pagination.push(
          <Button
            key={i}
            onClick={() => setCurrentPage(i)}
            variant={i === currentPage ? "blue" : "ghost"}
          >
            {i}
          </Button>
        );
      }
      pagination.push(<span key="ellipsis-end" className="px-3 mt-1">...</span>);
    }
    return pagination;
  };



  const handleSearch = (e) => {
    e.preventDefault()
    let formData = new FormData(e.target)
    const query = formData.get("search-query")
    if (query) {
      setSearchQuery(query);
    }
  }

  const clearFilters = () => {
    setSearchQueryValue("")
    setSearchQuery("")
    setLocation("")
    setComapany_id("")
  }

  const {
    fn: fnCompanies,
    data: companies
  } = useFetch(getCompanies)


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
        <Input value={searchQueryValue}
          onChange={(e) => setSearchQueryValue(e.target.value)} type="text" placeholder="Search Jobs by Title..." name="search-query" className="h-full flex-1 px-4 text-md" />

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

      <div>
        {loading ? (
          <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />
        ) : (
          <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentJobs?.length > 0 ? (
              currentJobs?.map((job) => (
                <JobCard key={job.id} job={job} savedInit={job?.saved?.length > 0} />
              ))
            ) : (
              <h2 className="text-2xl font-bold text-center">No Jobs Found</h2>
            )}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-4">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            variant="ghost"
          >
            <ChevronLeft />
            Previous
          </Button>
          {renderPageNumbers()}
          <Button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            variant="ghost"
          >
            Next
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default JobListing
