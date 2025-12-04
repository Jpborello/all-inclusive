import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tpitmedayuzfjooxyzgm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwaXRtZWRheXV6Zmpvb3h5emdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxOTUzMDIsImV4cCI6MjA3OTc3MTMwMn0.EYIsdZ-mc_iv_-IMDZFEZR3QI5YPD8gntZZJNFTyZmA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkProducts() {
    console.log('Checking products table...');

    const { count, error: countError } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

    if (countError) {
        console.error('Error counting products:', countError.message);
        return;
    }

    console.log(`Total products: ${count}`);

    if (count > 0) {
        const { data, error } = await supabase
            .from('products')
            .select('name, category_id, image_url')
            .limit(5);

        if (error) {
            console.error('Error fetching sample:', error.message);
        } else {
            console.log('Sample products:', data);
        }
    }
}

checkProducts();
