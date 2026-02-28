
export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Agent {
    id: string
    email: string
    name: string | null
    agency_name: string | null
    phone: string | null
    role: 'owner' | 'agent'
    created_at: string
}

export interface Customer {
    id: string
    agent_id: string
    name: string
    phone: string | null
    email: string | null
    city: string | null
    date_of_birth: string | null
    tags: string[] | null
    created_at: string
}

export interface Company {
    id: string
    name: string
    type: string | null
    portal_url: string | null
    support_phone: string | null
    support_email: string | null
    created_at: string
}

export interface Policy {
    id: string
    agent_id: string
    customer_id: string
    company_id: string | null
    policy_number: string
    policy_type: 'Car' | 'Bike' | 'Commercial' | 'Health' | string
    vehicle_reg_no: string | null
    vehicle_make: string | null
    vehicle_model: string | null
    vehicle_variant: string | null
    fuel_type: string | null
    vehicle_year: string | null
    issue_date: string | null
    start_date: string | null
    expiry_date: string | null
    premium_od: number | null
    premium_tp: number | null
    premium_total: number | null
    idv: number | null
    ncb: string | null
    engine_no: string | null
    chassis_no: string | null
    status: 'Active' | 'Expired' | 'Renewed' | 'Cancelled'
    pdf_url: string | null
    notes: string | null
    payment_status: 'paid' | 'partial' | 'due' | string
    payment_mode: string | null
    amount_paid: number | null
    payment_reference: string | null
    created_at: string
    updated_at: string

    // Relations
    customers?: Customer
    companies?: Company
}

export interface HealthDetails {
    insured_members: {
        name: string
        age: number
        relation: string
        pre_existing_diseases?: string
    }[]
    tpa?: string
    sum_insured: number
}

export interface FireDetails {
    property_address: string
    assets_covered: {
        description: string
        value: number
    }[]
    occupancy_type: 'Residential' | 'Commercial' | 'Industrial'
    fire_brigade_clause: boolean
}

export type ActionResult<T = any> = {
    error?: string;
    data?: T;
}
