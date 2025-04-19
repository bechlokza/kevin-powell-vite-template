import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

/**
 * Vite plugin for sorting SCSS properties according to SMACSS principles
 */
export default function scssSorter() {
  return {
    name: 'vite-plugin-scss-sorter',
    configureServer(server) {
      // Add SCSS files to the watcher
      server.watcher.add('src/**/*.scss');
      
      // Watch for changes to SCSS files
      server.watcher.on('change', (filePath) => {
        if (filePath.endsWith('.scss')) {
          console.log(`💅 Sorting SCSS properties in ${path.basename(filePath)}`);
          
          // Run Stylelint with fix option
          exec(`npx stylelint "${filePath}" --fix`, (error, stdout, stderr) => {
            if (error) {
              console.error(`❌ Error: ${error.message}`);
              return;
            }
            
            if (stderr) {
              console.error(`⚠️ Warning: ${stderr}`);
              return;
            }
            
            console.log(`✅ Sorted ${path.basename(filePath)} according to SMACSS principles`);
          });
        }
      });
    }
  };
}
