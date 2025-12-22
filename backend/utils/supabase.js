const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase configuration. Please set SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Uploads a file to Supabase storage
 * @param {string} bucket - The bucket name
 * @param {string} filePath - The path where to store the file in the bucket
 * @param {Buffer} fileBuffer - The file data as a buffer
 * @param {string} contentType - The MIME type of the file
 * @returns {Promise<{data: {Key: string}, error: Error}>}
 */
const uploadToSupabase = async (bucket, filePath, fileBuffer, contentType) => {
    try {
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(filePath, fileBuffer, {
                contentType,
                upsert: true
            });

        if (error) throw error;

        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(filePath);

        return {
            data: {
                path: data.path,
                publicUrl
            },
            error: null
        };
    } catch (error) {
        console.error('Error uploading to Supabase:', error);
        return { data: null, error };
    }
};

/**
 * Deletes a file from Supabase storage
 * @param {string} bucket - The bucket name
 * @param {string} filePath - The path of the file in the bucket
 * @returns {Promise<{data: any, error: Error}>}
 */
const deleteFromSupabase = async (bucket, filePath) => {
    try {
        const { data, error } = await supabase.storage
            .from(bucket)
            .remove([filePath]);

        if (error) throw error;
        return { data, error: null };
    } catch (error) {
        console.error('Error deleting from Supabase:', error);
        return { data: null, error };
    }
};

module.exports = {
    supabase,
    uploadToSupabase,
    deleteFromSupabase
};
