import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory database (in production, use MongoDB/PostgreSQL)
let documents = [];
let questionPapers = [];
let notifications = [];
let shares = [];

// Initialize with sample data
function initializeData() {
  // Sample documents
  documents = [
    {
      id: 'doc-001',
      title: 'Soil Science Fundamentals',
      course: 'AGL-301',
      semester: 'Semester 5',
      year: 2024,
      type: 'lecture',
      fileSize: '4.2 MB',
      uploadedDate: '2024-01-15',
      downloads: 234,
      tags: ['soil', 'agriculture', 'science'],
      description: 'Comprehensive lecture on soil composition, soil physics, and soil chemistry'
    },
    {
      id: 'doc-002',
      title: 'Plant Breeding Techniques',
      course: 'AGL-302',
      semester: 'Semester 5',
      year: 2024,
      type: 'lecture',
      fileSize: '3.8 MB',
      uploadedDate: '2024-02-10',
      downloads: 189,
      tags: ['breeding', 'genetics', 'plants'],
      description: 'Advanced techniques in crop improvement and genetic selection'
    },
    {
      id: 'doc-003',
      title: 'Crop Production Management',
      course: 'AGL-201',
      semester: 'Semester 3',
      year: 2023,
      type: 'lecture',
      fileSize: '5.1 MB',
      uploadedDate: '2023-11-20',
      downloads: 567,
      tags: ['crops', 'production', 'management'],
      description: 'Management practices for optimizing crop yield and quality'
    },
    {
      id: 'doc-004',
      title: 'Agricultural Extension Methods',
      course: 'AEX-101',
      semester: 'Semester 1',
      year: 2023,
      type: 'notes',
      fileSize: '2.3 MB',
      uploadedDate: '2023-09-05',
      downloads: 712,
      tags: ['extension', 'communication', 'farmers'],
      description: 'Effective communication strategies for agricultural extension'
    },
    {
      id: 'doc-005',
      title: 'Irrigation Engineering Design',
      course: 'AEE-401',
      semester: 'Semester 7',
      year: 2024,
      type: 'lecture',
      fileSize: '6.5 MB',
      uploadedDate: '2024-03-08',
      downloads: 345,
      tags: ['irrigation', 'engineering', 'water'],
      description: 'Design and management of irrigation systems for sustainable agriculture'
    }
  ];

  // Sample question papers
  questionPapers = [
    {
      id: 'qp-001',
      semester: 'Semester 5',
      year: 2024,
      course: 'AGL-301',
      courseTitle: 'Soil Science',
      examType: 'Final Exam',
      duration: 120,
      totalMarks: 100,
      questions: [
        {
          qid: 1,
          question: 'Explain the concept of soil maturity and its significance in agriculture',
          marks: 5,
          frequency: 3,
          years: [2024, 2023, 2022]
        },
        {
          qid: 2,
          question: 'Describe the physical properties of soil and their influence on plant growth',
          marks: 5,
          frequency: 4,
          years: [2024, 2023, 2022, 2021]
        },
        {
          qid: 3,
          question: 'What is soil pH and how does it affect nutrient availability?',
          marks: 5,
          frequency: 5,
          years: [2024, 2023, 2022, 2021, 2020]
        },
        {
          qid: 4,
          question: 'Explain soil erosion control measures and their importance in sustainable agriculture',
          marks: 5,
          frequency: 2,
          years: [2024, 2023]
        },
        {
          qid: 5,
          question: 'Describe different soil testing methods used in agricultural laboratories',
          marks: 5,
          frequency: 3,
          years: [2024, 2022, 2021]
        }
      ],
      uploadedBy: 'Dr. Sharma',
      uploadedDate: '2024-06-10'
    },
    {
      id: 'qp-002',
      semester: 'Semester 3',
      year: 2024,
      course: 'AGL-201',
      courseTitle: 'Crop Production',
      examType: 'Final Exam',
      duration: 120,
      totalMarks: 100,
      questions: [
        {
          qid: 1,
          question: 'Discuss the concept of crop rotation and its benefits in sustainable farming',
          marks: 5,
          frequency: 4,
          years: [2024, 2023, 2022, 2021]
        },
        {
          qid: 2,
          question: 'Explain the major pest management strategies in field crops',
          marks: 5,
          frequency: 3,
          years: [2024, 2023, 2022]
        },
        {
          qid: 3,
          question: 'Describe factors affecting crop yield and productivity',
          marks: 5,
          frequency: 5,
          years: [2024, 2023, 2022, 2021, 2020]
        },
        {
          qid: 4,
          question: 'What is intercropping and how does it improve farm productivity?',
          marks: 5,
          frequency: 2,
          years: [2024, 2023]
        },
        {
          qid: 5,
          question: 'Explain different harvesting techniques and post-harvest management practices',
          marks: 5,
          frequency: 3,
          years: [2024, 2022, 2021]
        }
      ],
      uploadedBy: 'Prof. Kumar',
      uploadedDate: '2024-05-15'
    }
  ];
}

// ==================== DOCUMENT ENDPOINTS ====================

// Get all documents
app.get('/api/documents', (req, res) => {
  const { semester, year, search, sort } = req.query;
  
  let filtered = [...documents];

  if (semester) {
    filtered = filtered.filter(doc => doc.semester === semester);
  }
  if (year) {
    filtered = filtered.filter(doc => doc.year === parseInt(year));
  }
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(doc =>
      doc.title.toLowerCase().includes(searchLower) ||
      doc.course.toLowerCase().includes(searchLower) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchLower))
    );
  }

  // Sorting
  if (sort === 'downloads') {
    filtered.sort((a, b) => b.downloads - a.downloads);
  } else if (sort === 'recent') {
    filtered.sort((a, b) => new Date(b.uploadedDate) - new Date(a.uploadedDate));
  }

  res.json({
    status: 'success',
    count: filtered.length,
    data: filtered
  });
});

// Get document by ID
app.get('/api/documents/:id', (req, res) => {
  const doc = documents.find(d => d.id === req.params.id);
  
  if (!doc) {
    return res.status(404).json({ status: 'error', message: 'Document not found' });
  }

  res.json({ status: 'success', data: doc });
});

// Download document (increment counter)
app.post('/api/documents/:id/download', (req, res) => {
  const doc = documents.find(d => d.id === req.params.id);
  
  if (!doc) {
    return res.status(404).json({ status: 'error', message: 'Document not found' });
  }

  doc.downloads += 1;

  res.json({
    status: 'success',
    message: 'Download counted',
    downloads: doc.downloads
  });
});

// Get popular documents
app.get('/api/documents/trending/popular', (req, res) => {
  const popular = [...documents]
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, 5);

  res.json({ status: 'success', data: popular });
});

// ==================== QUESTION PAPER ENDPOINTS ====================

// Get all question papers
app.get('/api/question-papers', (req, res) => {
  const { semester, year, course } = req.query;
  
  let filtered = [...questionPapers];

  if (semester) {
    filtered = filtered.filter(qp => qp.semester === semester);
  }
  if (year) {
    filtered = filtered.filter(qp => qp.year === parseInt(year));
  }
  if (course) {
    filtered = filtered.filter(qp => qp.course === course);
  }

  res.json({
    status: 'success',
    count: filtered.length,
    data: filtered
  });
});

// Get question paper by ID
app.get('/api/question-papers/:id', (req, res) => {
  const qp = questionPapers.find(q => q.id === req.params.id);
  
  if (!qp) {
    return res.status(404).json({ status: 'error', message: 'Question paper not found' });
  }

  res.json({ status: 'success', data: qp });
});

// Analyze question patterns (ML endpoint)
app.post('/api/question-papers/analyze/:semester', (req, res) => {
  const papers = questionPapers.filter(qp => qp.semester === req.params.semester);

  if (papers.length === 0) {
    return res.status(404).json({ status: 'error', message: 'No papers found for this semester' });
  }

  // Group questions by frequency
  const questionMap = new Map();

  papers.forEach(paper => {
    paper.questions.forEach(q => {
      const key = q.question;
      if (questionMap.has(key)) {
        const entry = questionMap.get(key);
        entry.frequency += 1;
        entry.years.push(paper.year);
      } else {
        questionMap.set(key, {
          question: q.question,
          marks: q.marks,
          frequency: 1,
          years: [paper.year],
          lastAsked: paper.year
        });
      }
    });
  });

  // Filter only repeated questions (frequency >= 2)
  const repeatedQuestions = Array.from(questionMap.values())
    .filter(q => q.frequency >= 2)
    .sort((a, b) => b.frequency - a.frequency);

  res.json({
    status: 'success',
    semester: req.params.semester,
    totalPapersAnalyzed: papers.length,
    totalQuestionsAnalyzed: questionMap.size,
    repeatedQuestions: repeatedQuestions,
    confidenceScore: (repeatedQuestions.length / questionMap.size) * 100
  });
});

// ==================== NOTIFICATION ENDPOINTS ====================

// Get notifications
app.get('/api/notifications', (req, res) => {
  const { userId, unread } = req.query;
  
  let filtered = [...notifications];

  if (userId) {
    filtered = filtered.filter(n => n.userId === userId);
  }
  if (unread === 'true') {
    filtered = filtered.filter(n => !n.read);
  }

  // Sort by date (newest first)
  filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  res.json({
    status: 'success',
    count: filtered.length,
    unreadCount: filtered.filter(n => !n.read).length,
    data: filtered
  });
});

// Create notification
app.post('/api/notifications', (req, res) => {
  const { userId, type, title, message, actionUrl } = req.body;

  if (!userId || !type || !title) {
    return res.status(400).json({ 
      status: 'error', 
      message: 'Missing required fields' 
    });
  }

  const notification = {
    id: `notif-${Date.now()}`,
    userId,
    type, // 'document', 'exam', 'announcement', 'alert'
    title,
    message,
    actionUrl,
    read: false,
    timestamp: new Date().toISOString(),
    icon: `icon-${type}`
  };

  notifications.push(notification);

  res.status(201).json({
    status: 'success',
    message: 'Notification created',
    data: notification
  });
});

// Mark notification as read
app.put('/api/notifications/:id/read', (req, res) => {
  const notif = notifications.find(n => n.id === req.params.id);

  if (!notif) {
    return res.status(404).json({ status: 'error', message: 'Notification not found' });
  }

  notif.read = true;

  res.json({ status: 'success', message: 'Notification marked as read' });
});

// Send exam reminder
app.post('/api/notifications/exam-reminder', (req, res) => {
  const { userId, courseCode, examDate, daysUntil } = req.body;

  const notification = {
    id: `notif-${Date.now()}`,
    userId,
    type: 'exam',
    title: `Exam Reminder: ${courseCode}`,
    message: `Your ${courseCode} exam is in ${daysUntil} days (${examDate})`,
    actionUrl: '/#/question-analyzer',
    read: false,
    timestamp: new Date().toISOString(),
    icon: 'icon-exam'
  };

  notifications.push(notification);

  res.status(201).json({
    status: 'success',
    message: 'Exam reminder sent',
    data: notification
  });
});

// ==================== SHARING ENDPOINTS ====================

// Share document
app.post('/api/share/document', (req, res) => {
  const { documentId, sharedBy, sharedWith, message } = req.body;

  if (!documentId || !sharedBy || sharedWith.length === 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Missing required fields'
    });
  }

  const doc = documents.find(d => d.id === documentId);
  if (!doc) {
    return res.status(404).json({ status: 'error', message: 'Document not found' });
  }

  const share = {
    id: `share-${Date.now()}`,
    documentId,
    documentTitle: doc.title,
    sharedBy,
    sharedWith, // array of user IDs or emails
    message: message || '',
    timestamp: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
  };

  shares.push(share);

  // Create notifications for shared users
  sharedWith.forEach(recipient => {
    notifications.push({
      id: `notif-${Date.now()}-${Math.random()}`,
      userId: recipient,
      type: 'share',
      title: `${sharedBy} shared a document`,
      message: `You received: ${doc.title}`,
      actionUrl: `/#/documents/${documentId}`,
      read: false,
      timestamp: new Date().toISOString(),
      icon: 'icon-share'
    });
  });

  res.status(201).json({
    status: 'success',
    message: 'Document shared successfully',
    data: share
  });
});

// Share question paper
app.post('/api/share/question-paper', (req, res) => {
  const { paperId, sharedBy, sharedWith, message } = req.body;

  if (!paperId || !sharedBy || sharedWith.length === 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Missing required fields'
    });
  }

  const paper = questionPapers.find(q => q.id === paperId);
  if (!paper) {
    return res.status(404).json({ status: 'error', message: 'Question paper not found' });
  }

  const share = {
    id: `share-${Date.now()}`,
    paperId,
    paperTitle: paper.courseTitle,
    sharedBy,
    sharedWith,
    message: message || '',
    timestamp: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  };

  shares.push(share);

  sharedWith.forEach(recipient => {
    notifications.push({
      id: `notif-${Date.now()}-${Math.random()}`,
      userId: recipient,
      type: 'share',
      title: `${sharedBy} shared a question paper`,
      message: `You received: ${paper.courseTitle} Question Paper`,
      actionUrl: `/#/question-analyzer`,
      read: false,
      timestamp: new Date().toISOString(),
      icon: 'icon-share'
    });
  });

  res.status(201).json({
    status: 'success',
    message: 'Question paper shared successfully',
    data: share
  });
});

// Get user shares
app.get('/api/share/received/:userId', (req, res) => {
  const userShares = shares.filter(s => 
    s.sharedWith.includes(req.params.userId) &&
    new Date(s.expiresAt) > new Date()
  );

  res.json({
    status: 'success',
    count: userShares.length,
    data: userShares
  });
});

// ==================== ANALYTICS ENDPOINTS ====================

// Get document statistics
app.get('/api/stats/documents', (req, res) => {
  const totalDownloads = documents.reduce((sum, doc) => sum + doc.downloads, 0);
  const mostDownloaded = [...documents].sort((a, b) => b.downloads - a.downloads)[0];
  const avgDownloads = (totalDownloads / documents.length).toFixed(2);

  res.json({
    status: 'success',
    stats: {
      totalDocuments: documents.length,
      totalDownloads,
      averageDownloads: parseFloat(avgDownloads),
      mostDownloadedDocument: mostDownloaded
    }
  });
});

// Get exam statistics
app.get('/api/stats/exams', (req, res) => {
  const totalQuestions = questionPapers.reduce((sum, qp) => sum + qp.questions.length, 0);
  const uniqueQuestions = new Set();

  questionPapers.forEach(qp => {
    qp.questions.forEach(q => {
      uniqueQuestions.add(q.question);
    });
  });

  const repeatedQuestions = Array.from(uniqueQuestions).filter(q => {
    let count = 0;
    questionPapers.forEach(qp => {
      qp.questions.forEach(question => {
        if (question.question === q) count++;
      });
    });
    return count >= 2;
  }).length;

  res.json({
    status: 'success',
    stats: {
      totalQuestionPapers: questionPapers.length,
      totalQuestionsAcrossAllPapers: totalQuestions,
      uniqueQuestions: uniqueQuestions.size,
      repeatedQuestions: repeatedQuestions,
      repetitionRate: ((repeatedQuestions / uniqueQuestions.size) * 100).toFixed(2) + '%'
    }
  });
});

// ==================== HEALTH CHECK ====================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'AgriArchive Backend API',
    version: '1.0.0'
  });
});

// ==================== ERROR HANDLING ====================

app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: 'Endpoint not found'
  });
});

// Initialize data and start server
initializeData();

app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   AgriArchive Backend API Server      ║
║   Running on http://localhost:${PORT}      ║
╚════════════════════════════════════════╝

Available Endpoints:
  
📚 Documents:
  GET  /api/documents
  GET  /api/documents/:id
  POST /api/documents/:id/download
  GET  /api/documents/trending/popular

❓ Question Papers:
  GET  /api/question-papers
  GET  /api/question-papers/:id
  POST /api/question-papers/analyze/:semester

🔔 Notifications:
  GET  /api/notifications
  POST /api/notifications
  PUT  /api/notifications/:id/read
  POST /api/notifications/exam-reminder

📤 Sharing:
  POST /api/share/document
  POST /api/share/question-paper
  GET  /api/share/received/:userId

📊 Analytics:
  GET  /api/stats/documents
  GET  /api/stats/exams

💚 Health:
  GET  /api/health
  `);
});

export default app;
