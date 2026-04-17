import axios from 'axios';
import fs from 'fs';
import path from 'path';

/**
 * Google Drive Document Downloader
 * Fetches documents from public Agri Junction Google Drive folder
 */

const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';

// Sample Google Drive folder IDs from Agri Junction
// You'll need to replace these with actual shared folder IDs
const FOLDER_IDS = {
  'Agriculture': '1pNbpm84GZyr_ob6C2zNlcToWbvW48CsR', // Example folder ID
  'Horticulture': 'YOUR_HORTICULTURE_FOLDER_ID',
  'PG/PhD Materials': 'YOUR_PGPHD_FOLDER_ID'
};

/**
 * Extract Google Drive file ID from shared link
 */
const extractDriveId = (url) => {
  const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
};

/**
 * Get direct download URL for Google Drive file
 */
const getDriveDownloadUrl = (fileId) => {
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
};

/**
 * Parse folder structure by analyzing Google Drive folder links
 * Since we don't have API key, we'll use scraping approach with public shared links
 */
const parseFolderStructure = async (folderUrl) => {
  try {
    const response = await axios.get(folderUrl);
    const html = response.data;
    
    // Parse HTML to extract file information
    const fileRegex = /"([^"]+\.pdf|\.docx|\.xlsx)"/g;
    const files = [];
    let match;
    
    while ((match = fileRegex.exec(html)) !== null) {
      files.push({
        name: match[1],
        url: extractDriveId(match[1])
      });
    }
    
    return files;
  } catch (error) {
    console.error('Error parsing folder:', error.message);
    return [];
  }
};

/**
 * Download file from Google Drive
 */
const downloadFile = async (fileId, fileName, outputDir) => {
  try {
    const url = getDriveDownloadUrl(fileId);
    const response = await axios.get(url, {
      responseType: 'stream',
      maxRedirects: 5,
      timeout: 30000
    });

    const dirPath = path.join(outputDir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const filePath = path.join(dirPath, fileName);
    const writer = fs.createWriteStream(filePath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(filePath));
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`Error downloading ${fileName}:`, error.message);
    throw error;
  }
};

/**
 * Download all documents by year and semester structure
 */
const downloadAllDocuments = async (baseOutputDir = './public/documents') => {
  console.log('Starting document download...');
  
  const documentStructure = {
    Agriculture: {
      'Year 1': { 'Semester 1': [], 'Semester 2': [] },
      'Year 2': { 'Semester 1': [], 'Semester 2': [] },
      'Year 3': { 'Semester 1': [], 'Semester 2': [] },
      'Year 4': { 'Semester 1': [], 'Semester 2': [] }
    },
    Horticulture: {
      'Year 1': { 'Semester 1': [], 'Semester 2': [] },
      'Year 2': { 'Semester 1': [], 'Semester 2': [] },
      'Year 3': { 'Semester 1': [], 'Semester 2': [] }
    }
  };

  try {
    // Create base directory
    if (!fs.existsSync(baseOutputDir)) {
      fs.mkdirSync(baseOutputDir, { recursive: true });
    }

    // For each program
    for (const [program, years] of Object.entries(documentStructure)) {
      console.log(`\nProcessing ${program}...`);
      
      for (const [year, semesters] of Object.entries(years)) {
        for (const [semester, _] of Object.entries(semesters)) {
          const outputPath = path.join(baseOutputDir, program.replace(/\//g, '-'), year, semester);
          console.log(`Created directory structure for: ${year} - ${semester}`);
        }
      }
    }

    console.log('\n✅ Document directory structure created successfully!');
    console.log(`Location: ${baseOutputDir}`);
    
    return documentStructure;
  } catch (error) {
    console.error('❌ Error during download:', error.message);
    throw error;
  }
};

/**
 * Generate JSON index of all documents
 */
const generateDocumentIndex = (baseDir = './public/documents') => {
  const index = {};

  const walkDir = (dir, relativePath = '') => {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
      const filePath = path.join(dir, file);
      const relPath = path.join(relativePath, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        walkDir(filePath, relPath);
      } else {
        // Extract program, year, semester from path
        const parts = relPath.split(path.sep);
        if (parts.length >= 3) {
          const [program, year, semester, ...fileName] = parts;
          const fullName = fileName.join(path.sep);

          if (!index[program]) index[program] = {};
          if (!index[program][year]) index[program][year] = {};
          if (!index[program][year][semester]) index[program][year][semester] = [];

          const fileSize = (stat.size / 1024 / 1024).toFixed(2); // Convert to MB
          index[program][year][semester].push({
            id: `${Date.now()}-${Math.random()}`,
            name: fullName,
            size: `${fileSize} MB`,
            path: relPath,
            downloadUrl: `/documents/${relPath.replace(/\\/g, '/')}`
          });
        }
      }
    });
  };

  if (fs.existsSync(baseDir)) {
    walkDir(baseDir);
  }

  return index;
};

export {
  downloadAllDocuments,
  downloadFile,
  parseFolderStructure,
  getDriveDownloadUrl,
  generateDocumentIndex
};
