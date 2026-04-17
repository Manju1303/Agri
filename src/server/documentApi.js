import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { generateDocumentIndex } from '../utils/documentDownloader.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve documents as static files
const documentsDir = path.join(__dirname, '../../public/documents');
app.use('/documents', express.static(documentsDir));

/**
 * GET /api/documents
 * Returns JSON structure of all available documents
 */
app.get('/api/documents', (req, res) => {
  try {
    const documentIndex = generateDocumentIndex(documentsDir);
    
    if (Object.keys(documentIndex).length === 0) {
      return res.status(200).json({
        message: 'No documents found. Please run the downloader script first.',
        documents: {}
      });
    }

    res.status(200).json(documentIndex);
  } catch (error) {
    console.error('Error generating document index:', error);
    res.status(500).json({
      error: 'Failed to retrieve documents',
      message: error.message
    });
  }
});

/**
 * GET /api/documents/search
 * Search for documents by name
 */
app.get('/api/documents/search', (req, res) => {
  try {
    const query = req.query.q?.toLowerCase() || '';
    const documentIndex = generateDocumentIndex(documentsDir);
    
    const results = [];
    
    Object.entries(documentIndex).forEach(([program, years]) => {
      Object.entries(years).forEach(([year, semesters]) => {
        Object.entries(semesters).forEach(([semester, docs]) => {
          docs.forEach(doc => {
            if (doc.name.toLowerCase().includes(query)) {
              results.push({
                ...doc,
                program,
                year,
                semester
              });
            }
          });
        });
      });
    });

    res.status(200).json({ results, count: results.length });
  } catch (error) {
    console.error('Error searching documents:', error);
    res.status(500).json({
      error: 'Search failed',
      message: error.message
    });
  }
});

/**
 * GET /api/documents/stats
 * Get statistics about documents
 */
app.get('/api/documents/stats', (req, res) => {
  try {
    const documentIndex = generateDocumentIndex(documentsDir);
    
    let totalFiles = 0;
    let totalSize = 0;
    const programs = Object.keys(documentIndex);
    
    Object.values(documentIndex).forEach(years => {
      Object.values(years).forEach(semesters => {
        Object.values(semesters).forEach(docs => {
          totalFiles += docs.length;
          docs.forEach(doc => {
            const size = parseFloat(doc.size);
            totalSize += size;
          });
        });
      });
    });

    res.status(200).json({
      totalPrograms: programs.length,
      totalFiles,
      totalSize: `${totalSize.toFixed(2)} MB`,
      programs
    });
  } catch (error) {
    console.error('Error calculating stats:', error);
    res.status(500).json({
      error: 'Failed to calculate statistics',
      message: error.message
    });
  }
});

/**
 * Health check
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

/**
 * Error handling middleware
 */
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

/**
 * 404 handler
 */
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.path} not found`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`📚 Document API Server running on http://localhost:${PORT}`);
  console.log(`Available endpoints:`);
  console.log(`  - GET /api/documents (get all documents)`);
  console.log(`  - GET /api/documents/search?q=query (search documents)`);
  console.log(`  - GET /api/documents/stats (get statistics)`);
  console.log(`  - GET /api/health (health check)`);
});

export default app;
