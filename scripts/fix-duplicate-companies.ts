import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function fixDuplicates() {
    const { data: companies } = await supabase.from('companies').select('*').order('name');
    console.log('All companies:', companies?.length);

    // Group by name
    const groups: Record<string, any[]> = {};
    companies?.forEach(c => {
        if (!groups[c.name]) groups[c.name] = [];
        groups[c.name].push(c);
    });

    for (const name of Object.keys(groups)) {
        const items = groups[name];
        if (items.length > 1) {
            console.log('Duplicate: ' + name + ' (' + items.length + ' entries)');
            const keepId = items[0].id;
            const deleteIds = items.slice(1).map((i: any) => i.id);

            for (const delId of deleteIds) {
                // Move policies to the kept company
                const { data: policies } = await supabase.from('policies').select('id').eq('company_id', delId);
                if (policies && policies.length > 0) {
                    console.log('  Moving ' + policies.length + ' policies from ' + delId + ' to ' + keepId);
                    await supabase.from('policies').update({ company_id: keepId }).eq('company_id', delId);
                }
                // Delete the duplicate
                const { error } = await supabase.from('companies').delete().eq('id', delId);
                if (error) console.log('  Error deleting ' + delId + ': ' + error.message);
                else console.log('  Deleted duplicate: ' + delId);
            }
        }
    }

    const { data: final } = await supabase.from('companies').select('*').order('name');
    console.log('\nFinal companies after cleanup:', final?.length);
    final?.forEach((c: any) => console.log('  ' + c.name + ' (' + c.type + ')'));
}

fixDuplicates();
