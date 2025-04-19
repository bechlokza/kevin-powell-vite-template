import { resolve } from "path";
import { defineConfig } from "vite";
import purgecss from "vite-plugin-purgecss";
import scssSorter from "./vite-plugin-scss-sorter";
import fs from 'fs';
import path from 'path';

// Plugin to watch and update SCSS index files
function scssIndexPlugin() {
  return {
    name: 'scss-index-plugin',
    configureServer(server) {
      server.watcher.add('src/scss/**/*.scss');
      server.watcher.on('add', (filePath) => {
        try {
          // Only process SCSS files
          if (!filePath.endsWith('.scss')) return;
          
          const dirPath = path.dirname(filePath);
          const fileName = path.basename(filePath);
          const indexPath = path.join(dirPath, '_index.scss');
          
          // Only process if:
          // 1. The file is not an index file itself
          // 2. The file starts with underscore (is a partial)
          // 3. An index file exists in the directory
          if (fileName !== '_index.scss' && fileName.startsWith('_') && fs.existsSync(indexPath)) {
            const moduleName = fileName.slice(1, -5); // Remove leading underscore and .scss extension
            const indexContent = fs.readFileSync(indexPath, 'utf8');
            
            // Check if import/forward already exists
            if (!indexContent.includes(`"${moduleName}"`) && !indexContent.includes(`'${moduleName}'`)) {
              // Determine if we should use @forward or @use based on existing content
              const useForward = indexContent.includes('@forward');
              const statement = useForward ? '@forward' : '@use';
              
              // Add new statement at the end of the file
              const newContent = indexContent.trim() + `\n${statement} "${moduleName}";\n`;
              fs.writeFileSync(indexPath, newContent);
              console.log(`Added ${statement} "${moduleName}" to ${indexPath}`);
            }
          }
        } catch (error) {
          // Log error but don't crash the server
          console.error(`SCSS Index Plugin Error: ${error.message}`);
        }
      });
    },
    handleHotUpdate({ file }) {
      // Handle SCSS compilation errors gracefully
      if (file.endsWith('.scss')) {
        return [];
      }
    }
  };
}

export default defineConfig({
  plugins: [
    purgecss(),
    scssIndexPlugin(),
    scssSorter()
  ],
  root: resolve(__dirname, "src/"),
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        home: resolve(__dirname, "src/index.html"),
        about: resolve(__dirname, "src/about/index.html"),
        contact: resolve(__dirname, "src/contact/index.html"),
      },
    },
  },
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        // Handle SCSS errors gracefully
        onError: err => {
          console.error('SCSS Error:', err.message);
          return false; // prevents the process from exiting
        }
      }
    },
    postcss: {
      writeToFile: true
    }
  }
});
