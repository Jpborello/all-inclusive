import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Load env vars manually to avoid missing dotenv package
const envConfig = fs.readFileSync('.env', 'utf8')
  .split('\n')
  .filter(line => line && !line.startsWith('#'))
  .reduce((acc, line) => {
    const [key, ...values] = line.split('=');
    acc[key.trim()] = values.join('=').trim();
    return acc;
  }, {});

const supabaseUrl = envConfig.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = envConfig.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;


if (!supabaseUrl || !supabaseKey) {
  console.error("Faltan las credenciales de Supabase en .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const categoriesToAdd = [
  { name: 'Pantalones', slug: 'pantalones' },
  { name: 'Buzos', slug: 'buzos' },
  { name: 'Sweaters', slug: 'sweaters' },
  { name: 'Camperas', slug: 'camperas' },
  { name: 'Remeras Mangas Largas', slug: 'remeras-mangas-largas' },
  { name: 'Cintos', slug: 'cintos' }
];

async function main() {
  console.log("Conectando a Supabase para insertar nuevas categorías...");
  let successCount = 0;
  
  for (const cat of categoriesToAdd) {
    // Check if exists
    const { data: existing } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', cat.slug)
      .single();

    if (existing) {
      console.log(`Categoría "${cat.name}" ya existe. Saltando.`);
    } else {
      const { error } = await supabase
        .from('categories')
        .insert([cat]);

      if (error) {
        console.error(`Error al crear "${cat.name}": ${error.message}`);
      } else {
        console.log(`Categoría "${cat.name}" creada exitosamente.`);
        successCount++;
      }
    }
  }
  console.log(`Proceso finalizado. ${successCount} categorías nuevas creadas.`);
}

main();
