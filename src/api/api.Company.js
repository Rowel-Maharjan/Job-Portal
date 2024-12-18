import supabaseClient, { supabaseUrl } from "@/utils/supabase";

export async function getCompanies(token) {
    try {
        const supabase = await supabaseClient(token);

        const { data, error } = await supabase.from('companies').select('*');
        if (error) {
            console.error("Error fetching companies:", error);
            return null;
        }
        return data;
    } catch (error) {
        console.error("Error in getCompanies function:", error);
        return null;
    }
}

export async function addNewCompany(token, _, companyData) {
    try {
        const supabase = await supabaseClient(token);

        const random = Math.floor(Math.random() * 90000);
        const fileName = `logo-${random}-${companyData.name}`;

        const { error: storageError } = await supabase.storage.from("company_logo").upload(fileName, companyData.logo);

        if (storageError) {
            console.error("Error Uploading Company Logo:", storageError);
            return null;
        }

        const logo_url = `${supabaseUrl}/storage/v1/object/public/company_logo/${fileName}`;

        const { data, error } = await supabase
            .from('companies')
            .insert([{ name: companyData.name, logo_url }])
            .select();

        if (error) {
            console.error("Error Submitting Company:", error);
            return null;
        }
        return data;
    } catch (error) {
        console.error("Error in addNewCompany function:", error);
        return null;
    }
}