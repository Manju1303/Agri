#!/usr/bin/env node

/**
 * Document Downloader CLI
 * Downloads all documents from Agri Junction Google Drive
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { downloadAllDocuments, generateDocumentIndex } from '../src/utils/documentDownloader.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);
const command = args[0] || 'help';

async function createDirectoryStructure() {
  console.log('🚀 Initializing Deep Synchronization with Agri Junction Repository...\n');
  
  const docsDir = path.join(__dirname, '../public/documents');
  
  try {
    // Clear old local archives to ensure fresh placeholder generation
    if (fs.existsSync(docsDir)) {
      console.log('🧹 Clearing old local archives...');
      fs.rmSync(docsDir, { recursive: true, force: true });
    }
    
    fs.mkdirSync(docsDir, { recursive: true });
    await downloadAllDocuments(docsDir);
    
    // Generate and save index
    const index = generateDocumentIndex(path.join(__dirname, '../public/documents'));
    const indexPath = path.join(__dirname, '../public/documents-index.json');
    
    fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
    console.log(`\n✅ Index saved to: ${indexPath}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

function showStats() {
  try {
    const docsDir = path.join(__dirname, '../../public/documents');
    const index = generateDocumentIndex(docsDir);
    
    console.log('\n📊 Document Statistics:\n');
    
    let totalFiles = 0;
    let totalSize = 0;
    
    Object.entries(index).forEach(([program, years]) => {
      console.log(`${program}:`);
      
      Object.entries(years).forEach(([year, semesters]) => {
        Object.entries(semesters).forEach(([semester, docs]) => {
          console.log(`  ${year} - ${semester}: ${docs.length} files`);
          totalFiles += docs.length;
          
          docs.forEach(doc => {
            const size = parseFloat(doc.size);
            totalSize += size;
          });
        });
      });
    });
    
    console.log(`\n📈 Summary:`);
    console.log(`  Total Programs: ${Object.keys(index).length}`);
    console.log(`  Total Files: ${totalFiles}`);
    console.log(`  Total Size: ${totalSize.toFixed(2)} MB`);
    
  } catch (error) {
    console.error('Error reading statistics:', error.message);
  }
}

function showHelp() {
  console.log(`
📚 Agri Junction Document Downloader

Usage: node downloadDocuments.js [command]

Commands:
  init        Create document directory structure (run this first!)
  stats       Show document statistics
  help        Show this help message

Examples:
  node downloadDocuments.js init       # Initialize document structure
  node downloadDocuments.js stats      # View document stats

Setup Instructions:
  1. Run: npm install axios
  2. Run: node downloadDocuments.js init
  3. Run: npm run dev:server (in another terminal)
  4. Documents will be available at http://localhost:3001/api/documents

Note: Ensure Google Drive shared links are configured correctly.
  `);
}

// Run command
switch (command) {
  case 'init':
    createDirectoryStructure();
    break;
  case 'stats':
    showStats();
    break;
  case 'help':
  default:
    showHelp();
    break;
}
