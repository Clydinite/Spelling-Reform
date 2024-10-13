import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to convert the Markdown table to a TypeScript map
function convertMarkdownToMap(markdown: string): Record<string, string> {
    // Split the string into lines and remove the first two lines (heading and \r)
    const lines = markdown.trim().split('\n').slice(2); 
    const map: Record<string, string> = {};

    // Skip the first two lines (header and separator)
    for (let i = 2; i < lines.length; i++) { 
        const cells = lines[i].split('|').map(cell => cell.trim()).filter(cell => cell); // Get cells
        // Ensure there are at least three columns
        if (cells.length >= 3) { 
            const key = cells[0].replace(/\//g, ''); // First column as key and remove slashes
            const value = cells[2]; // Third column as value
            map[key] = value; // Add to the map
        }
    }

    return map; // Return the map
}

// Read the markdown file and convert it to a map
fs.readFile(path.join(__dirname, 'reform.md'), 'utf-8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    const resultMap = convertMarkdownToMap(data);
    console.log(JSON.stringify(resultMap));

    // Write the map to a TS file
    const ts = `export const IPAMapping: Record<string, string> = ${JSON.stringify(resultMap)};`;
    fs.writeFile(path.join(__dirname, 'reform.ts'), ts, (err) => {
        if (err) {
            console.error('Error writing file:', err);
            return;
        }

        console.log('IPAMapping written to reform.ts');
    });
});
