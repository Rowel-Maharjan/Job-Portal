import supabaseClient from "@/utils/supabase";

export async function getJobs(token, { location, comapany_id, searchQuery }) {
    try {
        const supabase = await supabaseClient(token);

        let query = supabase.from('jobs').select("*, company:companies(name,logo_url), saved:saved_jobs(id)");

        if (location) {
            query = query.eq('location', location);
        }
        if (comapany_id) {
            query = query.eq('company_id', comapany_id);
        }
        if (searchQuery) {
            // query = await query.textSearch('title', searchQuery);
            query = await query.ilike('title', `%${searchQuery.trim()}%`);
        }

        const { data, error } = await query;

        if (error) {
            console.error("Error fetching jobs:", error);
            return null;
        }
        return data;
    } catch (error) {
        console.error("Error in getJobs function:", error);
        return null;
    }
}


export async function saveJobs(token, { alreadySaved }, saveData) {
    const supabase = await supabaseClient(token);

    if (alreadySaved) {
        const { data, error } = await supabase
            .from('saved_jobs')
            .delete()
            .eq('job_id', saveData.job_id);
        if (error) {
            console.error("Error deleting saved job:", error);
            return null;
        }
        return data
    } else {
        const { data, error } = await supabase
            .from('saved_jobs')
            .insert([saveData])
            .select();
        if (error) {
            console.error("Error saving job:", error);
            return null;
        }
        return data
    }
}



export async function getSingleJob(token, { job_id }) {
    try {
        const supabase = await supabaseClient(token);


        const { data, error } = await supabase
            .from('jobs')
            .select('*, company:companies(name,logo_url), applications:application(*)')
            .eq('id', job_id)
            .single();



        if (error) {
            console.error("Error fetching Job:", error);
            return null;
        }
        return data;
    } catch (error) {
        console.error("Error in getSingleJob function:", error);
        return null;
    }
}

export async function updateHiringStatus(token, { job_id }, isOpen) {
    try {
        const supabase = await supabaseClient(token);

        const { data, error } = await supabase
            .from('jobs')
            .update({ isOpen })
            .eq('id', job_id)
            .select()

        if (error) {
            console.error("Error Updating Job:", error);
            return null;
        }
        return data;
    } catch (error) {
        console.error("Error in updateHiringStatus function:", error);
        return null;
    }
}

export async function addNewJob(token, _, jobData) {
    try {
        const supabase = await supabaseClient(token);

        const { data, error } = await supabase
            .from('jobs')
            .insert([jobData])
            .select()

        if (error) {
            console.error("Error Creating Job:", error);
            return null;
        }
        return data;
    } catch (error) {
        console.error("Error in addNewJob function:", error);
        return null;
    }
}

export async function getSavedJobs(token) {
    try {
        const supabase = await supabaseClient(token);

        const { data, error } = await supabase
            .from('saved_jobs')
            .select('*, job:jobs(*, company:companies(name,logo_url))')

        if (error) {
            console.error("Error Fetching Saved Job:", error);
            return null;
        }
        return data;
    } catch (error) {
        console.error("Error in getSavedJobs function:", error);
        return null;
    }
}

export async function getMyJobs(token, { recruiter_id }) {
    try {
        const supabase = await supabaseClient(token);

        const { data, error } = await supabase
            .from('jobs')
            .select('*, company:companies(name,logo_url)')
            .eq("recruiter_id", recruiter_id)

        if (error) {
            console.error("Error Fetching Job:", error);
            return null;
        }
        return data;
    } catch (error) {
        console.error("Error in getMyjobs function:", error);
        return null;
    }
}

export async function deleteJob(token, { job_id }) {
    try {
        const supabase = await supabaseClient(token);

        const { data, error } = await supabase
            .from('jobs')
            .delete()
            .eq("id", job_id)
            .select()

        if (error) {
            console.error("Error Deleting Job:", error);
            return null;
        }
        return data;
    } catch (error) {
        console.error("Error in deleteJob function:", error);
        return null;
    }
}