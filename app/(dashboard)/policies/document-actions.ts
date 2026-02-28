'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function uploadPolicyDocument(formData: FormData) {
    const supabase = await createClient()

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

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Unauthorized' }

    // Upload file to Supabase Storage
    const fileName = `${user.id}/${policyId}/${Date.now()}-${file.name}`
    const { data: uploadData, error: uploadError } = await supabase
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
