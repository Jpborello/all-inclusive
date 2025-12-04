import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase/client';

const StorageScanner = () => {
    const [logs, setLogs] = useState([]);

    const log = (msg) => setLogs(prev => [...prev, msg]);

    useEffect(() => {
        const scan = async () => {
            log('Starting scan of bucket "products"...');

            // List top level folders/files
            const { data: rootFiles, error: rootError } = await supabase
                .storage
                .from('products')
                .list();

            if (rootError) {
                log(`Error listing root: ${rootError.message}`);
                return;
            }

            log(`Found ${rootFiles.length} items in root.`);

            for (const item of rootFiles) {
                if (item.id === null) { // It's a folder
                    log(`Folder found: ${item.name}`);

                    // List files in folder
                    const { data: subFiles, error: subError } = await supabase
                        .storage
                        .from('products')
                        .list(item.name, { limit: 100 });

                    if (subError) {
                        log(`Error listing folder ${item.name}: ${subError.message}`);
                        continue;
                    }

                    log(`  - Found ${subFiles.length} files in ${item.name}`);
                    subFiles.forEach(f => log(`    - ${f.name}`));
                } else {
                    log(`File in root: ${item.name}`);
                }
            }
            log('Scan complete.');
        };

        scan();
    }, []);

    return (
        <div className="p-4 bg-gray-100 font-mono text-xs">
            <h3>Storage Scanner Log</h3>
            <pre>{logs.join('\n')}</pre>
        </div>
    );
};

export default StorageScanner;
