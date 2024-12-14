import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/clerk-react';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarLoader } from 'react-spinners';

const Onboarding = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoaded && user.unsafeMetadata.role) {
      const rolePath = user.unsafeMetadata.role === "candidate" ? "/jobs" : "/postjob";
      navigate(rolePath);
    }
  }, [isLoaded, user, navigate]);

  const handleRoleSelection = async (role) => {
    try {
      await user.update({
        unsafeMetadata: {
          role,
        },
      });
      const rolePath = role === "candidate" ? "/jobs" : "/postjob";
      navigate(rolePath);
    } catch (err) {
      console.error(err);
    }
  };

  if (!isLoaded) {
    return <BarLoader className='mb-4' width={"100%"} color='#36d7b7' />;
  }

  return (
    <div className='flex flex-col items-center justify-center mt-4'>
      <h2 className='gradient-title font-extrabold text-5xl sm:text-7xl md:text-8xl tracking-tighter'>I am a...</h2>
      <div className='mt-16 grid grid-cols-2 gap-4 w-full md:px-40'>
        <Button onClick={() => handleRoleSelection("candidate")} variant="blue" className='h-36 text-2xl'>
          Candidate
        </Button>
        <Button onClick={() => handleRoleSelection("recruiter")} variant="destructive" className='h-36 text-2xl'>
          Recruiter
        </Button>
      </div>
    </div>
  );
};

export default Onboarding;
