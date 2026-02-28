'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { Policy } from '@/types'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { cache } from 'react'
import { addDays } from 'date-fns'
import { getAuthenticatedUser } from '@/lib/supabase/auth'

export type GetPoliciesParams = {
    query?: string
    page?: number
    limit?: number
    status?: string
    company_id?: string
    expiry_days?: number
    is_overdue?: boolean
    fromDate?: string
    toDate?: string
}

export async function getPolicies({ query = '', page = 1, limit = 10, status, company_id, expiry_days, is_overdue, fromDate, toDate }: GetPoliciesParams) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { data: [], count: 0, error: 'User not authenticated' }

    let queryBuilder = supabase
        .from('policies')
        .select(`
            *,
            customers (name, phone, customer_code),
            companies (name)
        `, { count: 'exact' })
        .eq('agent_id', user.id)
        .order('expiry_date', { ascending: true }) // Changed to expiry_date for reports alignment
        .range((page - 1) * limit, page * limit - 1)

    if (query) {
        // Search by policy number, vehicle reg, customer name, or customer code
        queryBuilder = queryBuilder.or(`policy_number.ilike.%${query}%,vehicle_reg_no.ilike.%${query}%,customers.name.ilike.%${query}%,customers.customer_code.ilike.%${query}%`)
    }

    if (status && status !== 'all') {
        queryBuilder = queryBuilder.eq('status', status)
    }

    if (company_id && company_id !== 'all') {
        queryBuilder = queryBuilder.eq('company_id', company_id)
    }

    // Date Filtering Logic
    const today = new Date().toISOString().split('T')[0]

    if (expiry_days) {
        const targetDate = addDays(new Date(), expiry_days).toISOString().split('T')[0]
        queryBuilder = queryBuilder.gte('expiry_date', today).lte('expiry_date', targetDate)
    }

    if (is_overdue) {
        queryBuilder = queryBuilder.lt('expiry_date', today).neq('status', 'Renewed')
    }

    if (fromDate && toDate) {
        queryBuilder = queryBuilder.gte('expiry_date', fromDate).lte('expiry_date', toDate)
    } else if (fromDate) {
        queryBuilder = queryBuilder.gte('expiry_date', fromDate)
    } else if (toDate) {
        queryBuilder = queryBuilder.lte('expiry_date', toDate)
    }

    const { data, count, error } = await queryBuilder
    return { data, count: count || 0, error }
}

export async function createPolicy(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('User not authenticated')

    const customer_id = formData.get('customer_id') as string
    const company_id = formData.get('company_id') as string
    const policy_number = formData.get('policy_number') as string
    const policy_type = formData.get('policy_type') as string

    // Vehicle
    const vehicle_reg_no = (formData.get('vehicle_reg_no') as string)?.toUpperCase()
    const vehicle_make = formData.get('vehicle_make') as string
    const vehicle_model = formData.get('vehicle_model') as string
    const vehicle_year = formData.get('vehicle_year') as string
    const fuel_type = formData.get('fuel_type') as string
    const engine_no = (formData.get('engine_no') as string)?.toUpperCase()
    const chassis_no = (formData.get('chassis_no') as string)?.toUpperCase()

    // Dates & Premium
    const start_date = formData.get('start_date') as string
    const expiry_date = formData.get('expiry_date') as string
    const premium_total = Number(formData.get('premium_total')) || 0
    const premium_od = Number(formData.get('premium_od')) || 0
    const premium_tp = Number(formData.get('premium_tp')) || 0
    const idv = Number(formData.get('idv')) || 0
    const ncb = formData.get('ncb') as string

    // Payment fields
    const payment_status = formData.get('payment_status') as string || 'due'
    const amount_paid = Number(formData.get('amount_paid')) || 0
    const payment_mode = formData.get('payment_mode') as string || 'Cash'
    const payment_reference = formData.get('payment_reference') as string || null

    // File Upload (Optional - don't fail if storage not configured)
    const file = formData.get('policy_file') as File
    let pdf_url = null

    if (file && file.size > 0) {
        try {
            const adminSupabase = createAdminClient()
            // Create unique path: user_id/timestamp-filename
            const fileExt = file.name.split('.').pop()
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
            const filePath = `${user.id}/${fileName}`

            const { error: uploadError } = await adminSupabase.storage
                .from('policy-documents')
                .upload(filePath, file)

            if (uploadError) {
                console.warn('File upload skipped (storage may not be configured):', uploadError.message)
                // Continue without file - don't fail the entire policy creation
            } else {
                // Get Public URL only if upload succeeded
                const { data: { publicUrl } } = adminSupabase.storage
                    .from('policy-documents')
                    .getPublicUrl(filePath)
                pdf_url = publicUrl
            }
        } catch (e) {
            console.warn('File upload error:', e)
            // Continue without file
        }
    }

    // Health & Fire Extra Fields
    const sum_insured = Number(formData.get('sum_insured')) || 0
    const tpa = formData.get('tpa') as string
    const health_members_json = formData.get('health_members_json') as string
    const property_address = formData.get('property_address') as string
    const occupancy_type = formData.get('occupancy_type') as string

    let notesData: any = {
        idv: idv,
        ncb: ncb // Store NCB in notes as well
    }

    if (policy_type === 'Health') {
        try {
            notesData = {
                ...notesData,
                tpa,
                sum_insured,
                insured_members: health_members_json ? JSON.parse(health_members_json) : []
            }
        } catch (e) {
            console.error('Failed to parse health members JSON', e)
            notesData = { ...notesData, tpa, sum_insured, insured_members: [], parsing_error: 'Invalid JSON for members' }
        }
    } else if (policy_type === 'Fire') {
        notesData = {
            ...notesData,
            property_address,
            occupancy_type,
            sum_insured
        }
    }

    // Insert policy
    const { data: newPolicy, error } = await supabase.from('policies').insert({
        agent_id: user.id,
        customer_id,
        company_id,
        policy_number,
        policy_type,
        vehicle_reg_no,
        vehicle_make,
        vehicle_model,
        vehicle_year,
        fuel_type,
        // idv: finalIdv, // Removed: Column does not exist
        // ncb, // Removed: Column does not exist
        engine_no,
        chassis_no,
        start_date,
        expiry_date,
        premium_total,
        premium_od,
        premium_tp,
        status: 'Active',
        payment_status,
        amount_paid,
        pdf_url,
        notes: JSON.stringify(notesData)
    }).select('id').single()

    if (error) {
        console.error('Error creating policy:', error)
        throw new Error(`Failed to create policy: ${error.message || error.code || JSON.stringify(error)}`)
    }

    // If payment was made, create a payment record
    if (amount_paid > 0 && newPolicy) {
        await supabase.from('payments').insert({
            agent_id: user.id,
            policy_id: newPolicy.id,
            amount: amount_paid,
            payment_date: new Date().toISOString().split('T')[0],
            payment_mode,
            reference_no: payment_reference,
            notes: 'Initial payment at policy creation'
        })
    }

    revalidatePath('/policies')
    revalidatePath('/payments')
    revalidatePath('/customers')
    redirect('/policies')
}

export async function deletePolicy(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
        .from('policies')
        .delete()
        .eq('id', id)
        .eq('agent_id', user.id)

    if (error) {
        console.error('Error deleting policy:', error)
        throw new Error('Failed to delete policy')
    }

    revalidatePath('/policies')
    revalidatePath('/customers')
}

// ----------------------------------------------------------------------
// PDF PARSING LOGIC (Using pdf2json)
// ----------------------------------------------------------------------
export async function extractPolicyData(formData: FormData) {
    const file = formData.get('policy_file') as File
    if (!file || file.size === 0) {
        return { error: 'No file provided' }
    }

    try {
        const PDFParser = (await import('pdf2json')).default;
        const pdfParser = new PDFParser(null, true); // true = text content only

        const buffer = Buffer.from(await file.arrayBuffer());

        const text: string = await new Promise((resolve, reject) => {
            pdfParser.on("pdfParser_dataError", (errData: any) => reject(new Error(errData.parserError)));
            pdfParser.on("pdfParser_dataReady", () => {
                resolve(pdfParser.getRawTextContent());
            });
            pdfParser.parseBuffer(buffer);
        });

        // Clean text
        const cleanText = text.replace(/\\r\\n/g, ' ').replace(/\\s+/g, ' ');

        const extracted: any = {
            policy_number: '',
            vehicle_reg_no: '',
            start_date: '',
            expiry_date: '',
            premium_total: '',
            vehicle_make: '',
            vehicle_model: '',
            idv: '',
            ncb: '',
            engine_no: '',
            chassis_no: '',
            company_id: '', // To be filled if found/created
        }

        // 1. Policy Number
        // Allow for spaces, slashes, hyphens, and alphanumeric
        const policyNoMatch = cleanText.match(/(?:Policy\s*(?:No|Number)|Pol\s*No)[\s:.-]*([A-Z0-9/\-]+)/i)
        if (policyNoMatch) extracted.policy_number = policyNoMatch[1].trim()

        // 2. Vehicle Reg No
        // Heuristics:
        // - Standard: MH-12-AB-1234 or MH12AB1234
        // - Spaces: MH 12 AB 1234
        const regNoPatterns = [
            /[A-Z]{2}[\s\-]?[0-9]{1,2}[\s\-]?[A-Z]{1,3}[\s\-]?[0-9]{4}/, // Standard
            /(?:Registration\s*No|Reg\s*No|Vehicle\s*No)[\s:.-]*([A-Z0-9\s-]+)/i // Labeled
        ]

        for (const pattern of regNoPatterns) {
            const match = cleanText.match(pattern)
            if (match) {
                // If the match is from the labeled group (index 1), use that. Otherwise use the whole match (index 0).
                const val = match[1] || match[0]
                // Clean up spaces/hyphens to get standard format
                extracted.vehicle_reg_no = val.replace(/[^A-Z0-9]/g, '').toUpperCase()
                break
            }
        }

        // 3. Dates (Start and Expiry)
        // Look for 2 dates. Usually the Period of Insurance.
        // Formats: dd/mm/yyyy, dd-mm-yyyy, dd.mm.yyyy
        const dateMatches = cleanText.match(/(\d{2}[\.\-\/]\d{2}[\.\-\/]\d{4})/g)
        if (dateMatches && dateMatches.length >= 2) {
            const toISODate = (str: string) => {
                const parts = str.split(/[\.\-\/]/)
                // Assuming dd-mm-yyyy matching the regex
                return `${parts[2]}-${parts[1]}-${parts[0]}`
            }
            // Often first date is "Issued on", but usually "Period: Start to End" comes together.
            // We'll take the first two found as a heuristic for now, but sorting them might be safer?
            // Usually Start < End.
            const d1 = toISODate(dateMatches[0])
            const d2 = toISODate(dateMatches[1])
            if (d1 < d2) {
                extracted.start_date = d1
                extracted.expiry_date = d2
            } else {
                extracted.start_date = d2
                extracted.expiry_date = d1
            }
        }

        // 4. Premium
        // Look for "Total Premium", "Gross Premium", "Final Premium" followed by amount
        const premiumMatch = cleanText.match(/(?:Total|Gross|Final|Net)\s*(?:Premium|Amount)[\s:.-]*(?:â‚¹|Rs\.?)?[\s]*([\d,]+\.?\d{0,2})/i)
        if (premiumMatch) {
            extracted.premium_total = premiumMatch[1].replace(/,/g, '')
        }

        // 5. IDV
        const idvMatch = cleanText.match(/(?:IDV|Insured\s*Declared\s*Value|Sum\s*Insured)[\s:.-]*(?:â‚¹|Rs\.?)?[\s]*([\d,]+\.?\d{0,2})/i)
        if (idvMatch) {
            extracted.idv = idvMatch[1].replace(/,/g, '')
        }

        // 6. NCB
        const ncbMatch = cleanText.match(/(?:NCB|No\s*Claim\s*Bonus)[\s:.-]*(\d{1,2}%?)/i)
        if (ncbMatch) {
            extracted.ncb = ncbMatch[1] // Keep % if present
        }

        // 7. Engine No & Chassis No
        // Labels: Engine No, Eng No, Engine Number
        const engineMatch = cleanText.match(/(?:Engine|Eng)\s*(?:No|Number)[\s:.-]*([A-Z0-9]+)/i)
        if (engineMatch) extracted.engine_no = engineMatch[1]

        // Labels: Chassis No, Chas No, VIN
        const chassisMatch = cleanText.match(/(?:Chassis|Chas)\s*(?:No|Number|ID)[\s:.-]*([A-Z0-9]+)/i)
        if (chassisMatch) extracted.chassis_no = chassisMatch[1]


        // 8. Company Detection & Auto-Creation
        // List of common insurers to check for
        const commonInsurers = [
            'HDFC ERGO', 'ICICI Lombard', 'Bajaj Allianz', 'New India Assurance',
            'United India', 'Oriental Insurance', 'National Insurance', 'Go Digit',
            'Acko', 'Tata AIG', 'Reliance General', 'SBI General', 'Magma HDI',
            'Kotak Mahindra', 'Royal Sundaram', 'Future Generali', 'Cholamandalam'
        ]

        let detectedCompany = null
        for (const insurer of commonInsurers) {
            if (cleanText.toLowerCase().includes(insurer.toLowerCase())) {
                detectedCompany = insurer
                break
            }
        }

        if (detectedCompany) {
            const supabase = await createClient()
            // Check if exists
            const { data: existing } = await supabase
                .from('companies')
                .select('id')
                .ilike('name', detectedCompany)
                .maybeSingle()

            if (existing) {
                extracted.company_id = existing.id
            } else {
                // Auto-create
                try {
                    const { data: newCompany, error: createError } = await supabase
                        .from('companies')
                        .insert({ name: detectedCompany, type: 'General' }) // Defaulting to General
                        .select('id')
                        .single()

                    if (newCompany) {
                        extracted.company_id = newCompany.id
                    }
                } catch (e) {
                    console.error('Failed to auto-create company:', e)
                    // Ignore, let user select manually
                }
            }
        }

        return { data: extracted, text_preview: cleanText.substring(0, 500) }

    } catch (error: any) {
        console.error('PDF Parse Error:', error)
        return { error: `Parse Failed: ${error.message || 'Unknown error'}. Ensure the PDF is not password protected.` }
    }
}

export const getPolicyById = cache(async (id: string) => {
    const { supabase, user } = await getAuthenticatedUser()

    const { data, error } = await supabase
        .from('policies')
        .select(`
            *,
            customers (id, name, phone, email),
            companies (id, name)
        `)
        .eq('id', id)
        .single()

    return { data, error }
})

export async function getAllPoliciesForExport(params: GetPoliciesParams = {}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return []

    const { query, status, company_id, fromDate, toDate } = params

    let queryBuilder = supabase
        .from('policies')
        .select(`
            *,
            customers (name, phone, email),
            companies (name)
        `)
        .eq('agent_id', user.id)
        .order('created_at', { ascending: false })

    if (query) {
        queryBuilder = queryBuilder.or(`policy_number.ilike.%${query}%,vehicle_reg_no.ilike.%${query}%`)
    }

    if (status && status !== 'all') {
        queryBuilder = queryBuilder.eq('status', status)
    }

    if (company_id && company_id !== 'all') {
        queryBuilder = queryBuilder.eq('company_id', company_id)
    }

    // Date Filtering
    if (fromDate && toDate) {
        queryBuilder = queryBuilder.gte('expiry_date', fromDate).lte('expiry_date', toDate)
    } else if (fromDate) {
        queryBuilder = queryBuilder.gte('expiry_date', fromDate)
    } else if (toDate) {
        queryBuilder = queryBuilder.lte('expiry_date', toDate)
    }

    const { data } = await queryBuilder

    // Flatten data for CSV
    return data?.map(policy => ({
        ...policy,
        customer_name: policy.customers?.name,
        customer_phone: policy.customers?.phone,
        customer_email: policy.customers?.email,
        company_name: policy.companies?.name,
        customers: undefined, // Remove nested objects
        companies: undefined
    })) || []
}
