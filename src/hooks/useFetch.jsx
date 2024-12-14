import { useSession } from '@clerk/clerk-react'
import { useState } from 'react'


const useFetch = (cb, options = {}) => {
    const [data, setdata] = useState(undefined)
    const [loading, setLoading] = useState(null)
    const [error, setError] = useState(null)
    const { session } = useSession()

    const fn = async (...args) => {
        setLoading(true)
        setError(null)
        try {
            const supabaseAccessToken = await session?.getToken({
                template: "Job-Portal",
            });
            const response = await cb(supabaseAccessToken, options, ...args)
            setdata(response)
            setError(null)
        } catch (err) {
            setError(err)
            throw err
        } finally {
            setLoading(false)
        }
    }

    return { fn, data, loading, error }

}

export default useFetch;