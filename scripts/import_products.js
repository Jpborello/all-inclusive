import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const supabaseUrl = 'https://tpitmedayuzfjooxyzgm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRwaXRtZWRheXV6Zmpvb3h5emdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxOTUzMDIsImV4cCI6MjA3OTc3MTMwMn0.EYIsdZ-mc_iv_-IMDZFEZR3QI5YPD8gntZZJNFTyZmA';

const supabase = createClient(supabaseUrl, supabaseKey);

const folderToSlug = {
    'Bermudas': 'bermudas',
    'Camisas': 'camisas',
    'Camperas': 'camperas',
    'Pantalon_Gabardina': 'pantalon-gabardina',
    'Remeras': 'remeras',
    'Short_Bano': 'short-bano'
};

async function runImport() {
    console.log('Starting SQL generation...');
    let sqlContent = '-- Import Products SQL\n\n';

    try {
        // 1. Get Categories Map (Just for logging, not strictly needed for subqueries)
        const { data: categories, error: catError } = await supabase
            .from('categories')
            .select('id, slug');

        if (catError) console.error('Error fetching categories:', catError);
        else console.log(`Loaded ${categories.length} categories.`);

        // 2. Iterate folders
        for (const [folderName, slug] of Object.entries(folderToSlug)) {
            console.log(`Processing folder '${folderName}' (Slug: ${slug})...`);

            const { data: files, error: listError } = await supabase
                .storage
                .from('products')
                .list(folderName, { limit: 100 });

            if (listError) {
                console.log(`Error listing folder ${folderName}: ${listError.message}`);
                continue;
            }

            console.log(`Folder ${folderName}: Found ${files.length} files.`);

            let count = 0;
            for (const file of files) {
                if (file.name === '.emptyFolderPlaceholder') continue;

                // Construct Public URL
                const { data: { publicUrl } } = supabase
                    .storage
                    .from('products')
                    .getPublicUrl(`${folderName}/${file.name}`);

                const name = `${folderName} - ${file.name.split('.')[0]}`.replace(/'/g, "''"); // Escape quotes
                const description = 'Imported from storage';

                // Append SQL Insert using Subquery for Category ID
                sqlContent += `INSERT INTO public.products (name, description, price, stock, category_id, image_url) VALUES ('${name}', '${description}', 0, 10, (SELECT id FROM public.categories WHERE slug = '${slug}' LIMIT 1), '${publicUrl}');\n`;

                count++;
            }
            console.log(`  Generated SQL for ${count} products from ${folderName}.`);
        }

        // Prepend Category Creation
        const categorySQL = `
-- Ensure Categories Exist
INSERT INTO public.categories (name, slug) VALUES
('Remeras', 'remeras'),
('Camisas', 'camisas'),
('Bermudas', 'bermudas'),
('Camperas', 'camperas'),
('Pantalon Gabardina', 'pantalon-gabardina'),
('Short Baño', 'short-bano')
ON CONFLICT (slug) DO NOTHING;

`;

        fs.writeFileSync('supabase_fix_and_import.sql', categorySQL + sqlContent);
        console.log('SQL file generated: supabase_fix_and_import.sql');

    } catch (error) {
        console.error(`CRITICAL ERROR: ${error.message}`);
    }
}

runImport();
