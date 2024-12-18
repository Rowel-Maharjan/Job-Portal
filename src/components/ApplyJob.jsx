import React from 'react'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Textarea } from './ui/textarea'
import { z } from 'zod'
import { Controller, useForm } from 'react-hook-form'
import { BarLoader } from 'react-spinners'
import { zodResolver } from '@hookform/resolvers/zod';
import useFetch from '@/hooks/useFetch'
import { applyToJob } from '@/api/api.application'
import { ScrollArea } from './ui/scroll-area'

const schema = z.object({
    fullName: z.string().min(1, { message: "Full Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    experience: z.number().min(0, { message: "Years of Experience must be greater than 0" }).int(),
    skills: z.string().min(1, { message: "Skills are required" }),
    education: z.enum(["Intermediate", "Graduate", "Post Graduate"]),
    resume: z.any().refine((file) =>
        file[0] &&
        (
            file[0].type === "application/pdf" ||
            file[0].type === "application/msword"
        ),
        { message: "Only PDF or Word files are allowed" }
    ),
    coverLetter: z.string().min(5, { message: "Cover Letter is required" }),
})

const ApplyJob = ({ user, job, applied = false, fetchJob }) => {
    const {
        register,
        handleSubmit,
        control,
        watch,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(schema),
    })

    const {
        loading: loadingApply,
        fn: fnApply,
        error: errorApply
    } = useFetch(applyToJob)

    const onSubmit = (data) => {
        fnApply({
            ...data,
            job_id: job?.id,
            candidate_id: user?.id,
            name: user.fullName,
            resume: data.resume[0],
            status: "Applied"
        }).then(() => {
            fetchJob();
            reset();
        })
    }

    return (
        <Drawer open={applied ? false : undefined}>
            <DrawerTrigger asChild>
                <Button size='lg' variant={job?.isOpen && !applied ? "blue" : "destructive"} disabled={!job?.isOpen || applied || user?.unsafeMetadata?.role !== "candidate"}>
                    {job?.isOpen ? (applied ? "Applied" : "Apply") : "Hiring Closed"}
                </Button>
            </DrawerTrigger>
            <DrawerContent className='max-h-screen'>
                <DrawerHeader>
                    <DrawerTitle>
                        Apply for {job?.title} at {job?.company?.name}
                    </DrawerTitle>
                    <DrawerDescription>Please fill the form below.</DrawerDescription>
                </DrawerHeader>

                <ScrollArea className='overflow-auto'>
                    <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4 p-4 pb-0'>
                        <Input
                            type="string"
                            placeholder="Enter Full Name"
                            className="flex-1"
                            {...register("fullName")}
                        />
                        {
                            errors.fullName && <p className="text-red-500">{errors.fullName.message}</p>
                        }

                        <Input
                            type="email"
                            placeholder="Enter Email"
                            className="flex-1"
                            {...register("email")}
                        />
                        {errors.email && <p className="text-red-500">{errors.email.message}</p>
                        }

                        <Input
                            type="number"
                            placeholder="Years of Experience"
                            className="flex-1"
                            {...register("experience", {
                                valueAsNumber: true
                            })}
                        />
                        {errors.experience && <p className="text-red-500">{errors.experience.message}</p>
                        }

                        <Input
                            type="text"
                            placeholder="Skills (Comma Spearated)"
                            className="flex-1"
                            {...register("skills")}
                        />
                        {errors.skills && <p className="text-red-500">{errors.skills.message}</p>}


                        <Controller
                            name='education'
                            control={control}
                            render={({ field }) => (
                                <RadioGroup className='flex gap-10' onValueChange={field.onChange} {...field}>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Intermediate" id="intermediate" />
                                        <Label htmlFor="intermediate">Intermediate</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Graduate" id="graduate" />
                                        <Label htmlFor="graduate">Graduate</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="Post Graduate" id="post-graduate" />
                                        <Label htmlFor="post-graduate">Post Graduate</Label>
                                    </div>

                                </RadioGroup>
                            )}
                        />
                        {errors.education && <p className="text-red-500">{errors.education.message}</p>}

                        <Input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="flex-1 file:text=gray-500"
                            {...register("resume")}
                        />
                        {errors.resume && <p className="text-red-500">{errors.resume.message}</p>}

                        <Textarea
                            className='whitespace-pre-wrap'
                            placeholder="Cover Letter"
                            rows={5}
                            {...register("coverLetter")}
                        />
                        {errors.coverLetter && <p className="text-red-500">{errors.coverLetter.message}</p>}

                        {errorApply?.message && <p className="text-red-500">{errorApply?.message}</p>}

                        {
                            loadingApply && <BarLoader width={"100%"} color='#36d7b7' />
                        }

                        <Button type="submit" variant="blue" size="lg">
                            Apply
                        </Button>

                    </form>
                </ScrollArea>

                <DrawerFooter>
                    <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer >



    )
}

export default ApplyJob
