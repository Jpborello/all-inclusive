import React, { useState } from 'react';
import { supabase } from '../../supabase/client';

const ProductImporter = () => {
    const [logs, setLogs] = useState([]);
    const [importing, setImporting] = useState(false);

    const log = (msg) => setLogs(prev => [...prev, msg]);

    // Map folder names (from storage) to category slugs (in DB)
    const folderToSlug = {
        'Bermudas': 'bermudas',
        'Camisas': 'camisas',
        'Camperas': 'camperas',
        'Pantalon_Gabardina': 'pantalon-gabardina',
        'Remeras': 'remeras',
        'Short_Bano': 'short-bano'
    };

    const runImport = async () => {
        setImporting(true);
        setLogs([]);
        log('Starting import...');

        try {
            // 1. Get Categories Map
            const { data: categories, error: catError } = await supabase
                .from('categories')
                .select('id, slug');

            if (catError) throw catError;

            const slugToId = categories.reduce((acc, cat) => {
                acc[cat.slug] = cat.id;
                return acc;
            }, {});

            log(`Loaded ${categories.length} categories.`);

            // 2. Iterate folders
            for (const [folderName, slug] of Object.entries(folderToSlug)) {
                const categoryId = slugToId[slug];
                if (!categoryId) {
                    log(`WARNING: Category slug '${slug}' not found in DB. Skipping folder '${folderName}'.`);
                    continue;
                }

                log(`Processing folder '${folderName}' (Category ID: ${categoryId})...`);

                const { data: files, error: listError } = await supabase
                    .storage
                    .from('products')
                    .list(folderName, { limit: 100 });

                if (listError) {
                    log(`Error listing folder ${folderName}: ${listError.message}`);
                    continue;
                }

                let count = 0;
                for (const file of files) {
                    if (file.name === '.emptyFolderPlaceholder') continue;

                    // Construct Public URL
                    const { data: { publicUrl } } = supabase
                        .storage
                        .from('products')
                        .getPublicUrl(`${folderName}/${file.name}`);

                    // Insert Product
                    const { error: insertError } = await supabase
                        .from('products')
                        .insert({
                            name: `${folderName} - ${file.name.split('.')[0]}`, // Simple name
                            description: 'Imported from storage',
                            price: 0, // Placeholder
                            stock: 10, // Placeholder
                            category_id: categoryId,
                            image_url: publicUrl
                        });

                    if (insertError) {
                        log(`  Error inserting ${file.name}: ${insertError.message}`);
                    } else {
                        count++;
                    }
                }
                log(`  Imported ${count} products from ${folderName}.`);
            }
            log('Import complete!');

        } catch (error) {
            log(`CRITICAL ERROR: ${error.message}`);
        } finally {
            setImporting(false);
        }
    };

    return (
        <div className="p-4 bg-gray-100 font-mono text-xs border-t border-gray-300">
            <h3 className="font-bold mb-2">Product Importer</h3>
            <button
                onClick={runImport}
                disabled={importing}
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 mb-4"
            >
                {importing ? 'Importing...' : 'Run Import'}
            </button>
            <pre className="h-64 overflow-y-auto bg-white p-2 border">{logs.join('\n')}</pre>
        </div>
    );
};

export default ProductImporter;
