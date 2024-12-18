import { Button } from '@/components/ui/button'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { companies } from '@/components/config/companies'
import Autoplay from "embla-carousel-autoplay"
import { useUser } from '@clerk/clerk-react'


const LandingPage = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (isLoaded && !user?.unsafeMetadata?.role) {
        navigate("/onboarding");
      }
      if (isLoaded && user?.unsafeMetadata?.role === "candidate") {
        navigate("/jobs");  
      }

    }
  }, [isLoaded, user, navigate]);
  return (
    <main className='flex flex-col gap-10 sm:gap-20 py-10'>
      <section className='text-center'>
        <h1 className='gradient-title text-4xl font-extrabold sm:text-6xl lg:text-8xl tracking-tighter'>Find Your Dream Job</h1>
        <p className='text-gray-300 sm:mt-4 text-xs sm:text-xl'>Explore thousands of job listings or find the perfect candidate</p>
      </section>

      <div className='flex justify-center gap-6'>
        <Link to="/jobs">
          <Button variant="blue" size="xl">Find Jobs</Button>
        </Link>
        <Link to="/postjob">
          <Button variant="destructive" size="xl">Post Jobs</Button>
        </Link>
      </div>

      <Carousel className="w-full py-10"
        plugins={[
          Autoplay({
            delay: 2000,
          }),
        ]}
        opts={{
          align: "start",
          loop: true,
        }}>
        <CarouselContent className='flex gap-5 sm:gap-20 items-center'>
          {companies.map(({ name, id, path }) => {
            return (
              <CarouselItem className='basis-1/3 lg:basis-1/6' key={id}>
                <img src={path} alt={name} className='h-9 sm:h-14 object-contain' />
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </main>
  )
}

export default LandingPage
