#!/usr/bin/env node

import { exec } from 'child_process';
import { watch } from 'chokidar';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to your SCSS files
const scssDir = path.join(__dirname, 'src', 'scss');

// Initialize watcher
console.log(`🔍 Watching SCSS files in ${scssDir} for changes...`);
const watcher = watch(`${scssDir}/**/*.scss`, {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true
});

// Function to run Stylelint on a file
function sortScssFile(filePath) {
  console.log(`💅 Sorting SCSS properties in ${path.basename(filePath)}`);
  exec(`npx stylelint "${filePath}" --fix`, (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Error: ${error.message}`);
      return;
    }
    
    if (stderr) {
      console.error(`⚠️ Warning: ${stderr}`);
      return;
    }
    
    if (stdout) {
      console.log(stdout);
    }
    
    console.log(`✅ Sorted ${path.basename(filePath)} according to SMACSS principles`);
  });
}

// Watch for changes
watcher
  .on('change', sortScssFile)
  .on('error', error => console.error(`Watcher error: ${error}`));

console.log('✨ SMACSS sorting watcher is running. Press Ctrl+C to stop.');
