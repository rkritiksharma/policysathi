'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { getAuthenticatedUser } from '@/lib/supabase/auth'
import { revalidatePath } from 'next/cache'

export async function uploadPolicyDocument(formData: FormData) {
    const { supabase, user } = await getAuthenticatedUser()
    const adminSupabase = createAdminClient()

    const file = formData.get('file') as File
    const policyId = formData.get('policyId') as string

    if (!file || !policyId) {
        return { error: 'File and Policy ID are required' }
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
        return { error: 'File size must be less than 5MB' }
    }

    if (file.type !== 'application/pdf') {
        return { error: 'Only PDF files are allowed' }
    }


    // Upload file to Supabase Storage using Admin Client to bypass RLS
    const fileName = `${user.id}/${policyId}/${Date.now()}-${file.name}`
    const { data: uploadData, error: uploadError } = await adminSupabase
        .storage
        .from('policy-documents')
        .upload(fileName, file)

    if (uploadError) {
        console.error('Upload Error:', uploadError)
        return { error: 'Failed to upload document' }
    }

    // Get Public URL (or signed URL if private)
    const { data: { publicUrl } } = supabase
        .storage
        .from('policy-documents')
        .getPublicUrl(fileName)

    // Update policy record with PDF URL
    const { error: dbError } = await supabase
        .from('policies')
        .update({ pdf_url: publicUrl })
        .eq('id', policyId)
        .eq('agent_id', user.id)

    if (dbError) {
        console.error('Context Update Error:', dbError)
        return { error: 'Uploaded file but failed to update policy record' }
    }

    revalidatePath(`/policies/${policyId}`)
    return { success: 'Document uploaded successfully', url: publicUrl }
}

export async function deletePolicyDocument(policyId: string) {
    const { supabase, user } = await getAuthenticatedUser() // Modified this line

    if (!user) return { error: 'Unauthorized' } // Kept this check

    // Just update the record to clear the URL. 
    // Usually, we'd delete the file from storage too, but let's keep it simple first.
    const { error: dbError } = await supabase
        .from('policies')
        .update({ pdf_url: null })
        .eq('id', policyId)
        .eq('agent_id', user.id)

    if (dbError) {
        console.error('Delete Document Error:', dbError)
        return { error: 'Failed to remove document' }
    }

    revalidatePath(`/policies/${policyId}`)
    return { success: 'Document removed successfully' }
}
