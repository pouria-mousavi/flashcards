
import fs from 'fs';
import path from 'path';

const manualProcessDir = path.resolve(process.cwd(), 'manual_ai_process');
const simplifiedChunksDir = path.join(manualProcessDir, 'simplified_chunks');
const outputDir = path.join(manualProcessDir, 'gemini_output');

async function consolidate() {
    console.log("Restoring Input Chunks...");
    const files = fs.readdirSync(simplifiedChunksDir);
    const bakFiles = files.filter(f => f.endsWith('.bak'));

    for (const bak of bakFiles) {
        const originalName = bak.replace('.bak', '');
        const originalPath = path.join(simplifiedChunksDir, originalName);
        const bakPath = path.join(simplifiedChunksDir, bak);
        
        // Restore original
        try {
            if (fs.existsSync(bakPath)) {
                fs.renameSync(bakPath, originalPath);
                console.log(`Restored ${originalName}`);
            }
        } catch (e) {
             console.error(`Failed to restore ${bak}: ${e.message}`);
             continue;
        }

        // Delete parts
        // Pattern: chunk_X_partY...
        const chunkPrefix = originalName.replace('.json', '_part');
        const parts = files.filter(f => f.startsWith(chunkPrefix));
        for (const part of parts) {
            try {
                const p = path.join(simplifiedChunksDir, part);
                if (fs.existsSync(p)) {
                   fs.unlinkSync(p);
                   console.log(`Deleted slice ${part}`);
                }
            } catch (e) {
                // ignore
            }
        }
    }

    console.log("\nConsolidating Output Chunks...");
    if (fs.existsSync(outputDir)) {
        const outFiles = fs.readdirSync(outputDir);
        // We only care about merging slices if the Unified parent doesn't exist?
        // Actually, if we restored input chunk X, we should ideally have processed_chunk_X.json.
        // If we have processed_chunk_X_part1... and part2..., we can try to merge them.
        
        // Group by chunk ID
        // Format: processed_chunk_(\d+)(_part.*)?.json
        const chunks = new Map(); // id -> [files]

        for (const f of outFiles) {
            if (!f.startsWith('processed_chunk_') || !f.endsWith('.json')) continue;
            
            // Extract ID
            const match = f.match(/processed_chunk_(\d+)/);
            if (match) {
                const id = match[1];
                if (!chunks.has(id)) chunks.set(id, []);
                chunks.get(id).push(f);
            }
        }

        for (const [id, fileList] of chunks) {
            const unifiedFile = `processed_chunk_${id}.json`;
            
            // If unified file already exists, and we have parts, do we delete parts?
            // If unified exists, we assume it's good.
            if (fileList.includes(unifiedFile)) {
                 // Remove any parts
                 for (const f of fileList) {
                     if (f !== unifiedFile) {
                         fs.unlinkSync(path.join(outputDir, f));
                         console.log(`Deleted output slice ${f} (Unified exists)`);
                     }
                 }
            } else {
                // We have parts but no unified file.
                // Sort parts (alphabetically should work for _part1, _part2)
                const parts = fileList.sort();
                if (parts.length > 0) {
                     // Start merging
                     console.log(`Merging chunks for ID ${id}: ${parts.join(', ')}`);
                     let merged = [];
                     for (const partFile of parts) {
                         try {
                             const content = JSON.parse(fs.readFileSync(path.join(outputDir, partFile), 'utf8'));
                             if (Array.isArray(content)) {
                                 merged = merged.concat(content);
                             }
                         } catch (e) {
                             console.error(`Error reading ${partFile}:`, e.message);
                         }
                     }
                     
                     // Write unified
                     fs.writeFileSync(path.join(outputDir, unifiedFile), JSON.stringify(merged, null, 2));
                     console.log(`Created ${unifiedFile} from ${parts.length} slices`);
                     
                     // Delete parts
                     for (const f of parts) {
                         fs.unlinkSync(path.join(outputDir, f));
                     }
                }
            }
        }
    }
    
    console.log("Consolidation Complete.");
}

consolidate();
