import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect } from 'react'
import { z } from 'zod'
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from './ui/drawer'
import { Button } from './ui/button'
import { useForm } from 'react-hook-form'
import { Input } from './ui/input'
import { addNewCompany } from '@/api/api.Company'
import { BarLoader } from 'react-spinners'
import useFetch from '@/hooks/useFetch'

const schema = z.object({
    name: z.string().min(1, { message: "Company Name is required" }),
    logo: z.any().refine((file) =>
        file[0] &&
        (
            file[0].type === "image/png" ||
            file[0].type === "image/jpeg"
        ),
        { message: "Only Images are allowed" }
    ),
})

const AddCompanyDrawer = ({ fetchCompanies }) => {

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(schema)
    })

    const {
        fn: fnAddCompany,
        loading: loadingAddCompany,
        error: errorAddCompany,
        data: dataAddCompany } = useFetch(addNewCompany)

    const onSubmit = (data) => {
        fnAddCompany({
            ...data,
            logo: data.logo[0]
        });

    }

    useEffect(() => {
        if (dataAddCompany?.length > 0) {
            fetchCompanies();
        }
    }, [loadingAddCompany])


    return (
        <div>
            <Drawer>
                <DrawerTrigger>
                    <Button variant="secondary" size='sm' type="button">Add Company</Button>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Add a New Company</DrawerTitle>
                    </DrawerHeader>
                    <form className='flex gap-2 p-4 pb-0'>
                        <Input placeholder="Company Name" {...register("name")} />

                        <Input className="file:text-gray-500" accept="image/*" type="file" {...register("logo")} />

                        <Button className="" type="button" onClick={handleSubmit(onSubmit)} variant="destructive">Add</Button>
                    </form>
                    {
                        errors.name && (
                            <p className='text-red-500 text-sm'>{errors.name.message}</p>
                        )
                    }
                    {
                        errors.logo && (
                            <p className='text-red-500 text-sm'>{errors.logo.message}</p>
                        )
                    }
                    {
                        errorAddCompany?.message && (
                            <p className='text-red-500 text-sm'>{errorAddCompany?.message}</p>
                        )
                    }
                    {
                        loadingAddCompany && <BarLoader className='mt-1' width={"100%"} color='#36d7b7' />
                    }
                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button variant="secondary" >Cancel</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    )
}

export default AddCompanyDrawer
