const fs = require('fs');
const readline = require('readline');

// Create streams
const rl = readline.createInterface({
    input: fs.createReadStream('BueCont_TXT.txt'),
    crlfDelay: Infinity
});
const out = fs.createWriteStream('BueCont_clean.csv');

let isFirstLine = true;

// Process line by line
rl.on('line', (line) => {
    // 1. Remove the literal double quotes from the text
    let cleanLine = line.replace(/"/g, '');

    // 2. Remove trailing pipe | at the end of the line if it exists
    if (cleanLine.endsWith('|')) {
        cleanLine = cleanLine.slice(0, -1);
    }

    // 3. Split parts using the original pipe delimiter
    let parts = cleanLine.split('|');

    // Ensure header is written as standard CSV
    if (isFirstLine) {
        out.write('ruc,nombre_razon,a_partir_del,resolucion\n');
        isFirstLine = false;
        return;
    }

    // 4. Map parts to standard CSV
    if (parts.length >= 4) {
        const ruc = parts[0].trim();
        const name = parts[1].trim();
        let dateRaw = parts[2].trim();
        const res = parts[3].trim();

        // Convert DD/MM/YYYY to YYYY-MM-DD for PostgreSQL DATE column
        const dateParts = dateRaw.split('/');
        if (dateParts.length === 3) {
            dateRaw = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
        }

        // Quote the name properly ONLY for CSV format compatibility.
        // Supabase parsing will REMOVE these quotes when inserting into the DB.
        // We replace any comma in name with a full-width comma or just space avoiding standard CSV issues.
        // Standard CSV allows escaping with `\"` but quoting works flawlessly.
        const safeName = `"${name}"`;

        // Write standard comma-separated line
        out.write(`${ruc},${safeName},${dateRaw},${res}\n`);
    }
});

rl.on('close', () => {
    console.log('✅ Success: BueCont_clean.csv generated successfully.');
    console.log('You can now upload this file to Supabase!');
});
