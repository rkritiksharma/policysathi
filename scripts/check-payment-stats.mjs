import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
async function checkStats() {
    const { data: policies, error } = await supabase.from('policies').select('payment_status');
    if (error) {
        console.error(error);
        return;
    }
    const statusCounts = policies.reduce((acc, p) => {
        const status = p.payment_status || 'due';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});
    console.log('Status Counts in DB:', statusCounts);
}
checkStats();
