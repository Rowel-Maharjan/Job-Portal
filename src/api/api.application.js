import supabaseClient, { supabaseUrl } from "@/utils/supabase";

export async function applyToJob(token, _, jobData) {
    try {
        const supabase = await supabaseClient(token);

        const random = Math.floor(Math.random() * 90000);
        const fileName = `resume-${random}-${jobData.candidate_id}`;

        const { error: storageError } = await supabase.storage.from("resumes").upload(fileName, jobData.resume);

        if (storageError) {
            console.error("Error Uploading Resume:", storageError);
            return null;
        }

        const resume = `${supabaseUrl}/storage/v1/object/public/resumes/${fileName}`;

        const { data, error } = await supabase
            .from('application')
            .insert([{ ...jobData, resume }])
            .select();

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