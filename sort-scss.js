#!/usr/bin/env node

import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to your SCSS files
const scssDir = path.join(__dirname, 'src', 'scss');

// Run Stylelint with fix option
exec(`npx stylelint "${scssDir}/**/*.scss" --fix`, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }
  
  console.log('✅ SCSS files sorted according to SMACSS principles');
  console.log(stdout);
});
