import React, { useState, useEffect } from 'react';
import { FileText, Download, Loader, AlertCircle, FolderOpen, ChevronDown, Search, Eye } from 'lucide-react';
import DocumentViewer from './DocumentViewer';

const DocumentManager = () => {
  const [documents, setDocuments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedYear, setExpandedYear] = useState(null);
  const [expandedSemester, setExpandedSemester] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocument, setSelectedDocument] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      // Fetch from our backend API that will handle Google Drive downloads
      const response = await fetch('/api/documents');
      
      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }
      
      const data = await response.json();
      setDocuments(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching documents:', err);
      setError('Unable to load documents. Please try again later.');
      // Use sample data for demonstration
      setDocuments(getSampleData());
    } finally {
      setLoading(false);
    }
  };

  const getSampleData = () => {
    return {
      'Agriculture': {
        'Year 1': {
          'Semester 1': [
            { id: 1, name: 'Agronomy Basics.pdf', size: '2.5 MB', url: '#' },
            { id: 2, name: 'Soil Science Notes.pdf', size: '3.1 MB', url: '#' }
          ],
          'Semester 2': [
            { id: 3, name: 'Crop Management.pdf', size: '2.8 MB', url: '#' }
          ]
        },
        'Year 2': {
          'Semester 1': [
            { id: 4, name: 'Plant Breeding.pdf', size: '4.2 MB', url: '#' }
          ]
        }
      }
    };
  };

  const toggleYear = (year) => {
    setExpandedYear(expandedYear === year ? null : year);
  };

  const toggleSemester = (semester) => {
    setExpandedSemester(expandedSemester === semester ? null : semester);
  };

  const downloadFile = (doc) => {
    // Implement actual download logic
    const link = document.createElement('a');
    link.href = doc.url || '#';
    link.download = doc.name || 'document';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    console.log('Downloading:', doc.name);
  };

  const viewFile = (doc) => {
    // Open document in viewer
    setSelectedDocument(doc);
  };

  const filterDocuments = (docs) => {
    if (!searchTerm) return docs;
    return docs.filter(doc => 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="document-manager">
      <div className="doc-header">
        <h2>📚 Study Materials Repository</h2>
        <p>Browse and download study materials organized by year and semester</p>
      </div>

      <div className="search-container">
        <Search size={20} />
        <input
          type="text"
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {loading && (
        <div className="loading-state">
          <Loader size={40} className="spinner" />
          <p>Loading documents...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <AlertCircle size={24} />
          <p>{error}</p>
          <button onClick={fetchDocuments} className="retry-btn">
            Retry
          </button>
        </div>
      )}

      {!loading && !error && Object.keys(documents).length === 0 && (
        <div className="empty-state">
          <FolderOpen size={48} />
          <p>No documents available yet</p>
        </div>
      )}

      {!loading && !error && (
        <div className="documents-container">
          {Object.entries(documents).map(([program, years]) => (
            <div key={program} className="program-section">
              <h3 className="program-title">{program}</h3>
              
              {Object.entries(years).map(([year, semesters]) => (
                <div key={year} className="year-section">
                  <button
                    onClick={() => toggleYear(year)}
                    className={`year-button ${expandedYear === year ? 'expanded' : ''}`}
                  >
                    <ChevronDown 
                      size={20} 
                      style={{ 
                        transform: expandedYear === year ? 'rotate(0)' : 'rotate(-90deg)',
                        transition: 'transform 0.2s'
                      }} 
                    />
                    <span>{year}</span>
                  </button>

                  {expandedYear === year && (
                    <div className="semesters-container">
                      {Object.entries(semesters).map(([semester, docs]) => (
                        <div key={semester} className="semester-section">
                          <button
                            onClick={() => toggleSemester(semester)}
                            className={`semester-button ${expandedSemester === semester ? 'expanded' : ''}`}
                          >
                            <ChevronDown 
                              size={16}
                              style={{ 
                                transform: expandedSemester === semester ? 'rotate(0)' : 'rotate(-90deg)',
                                transition: 'transform 0.2s'
                              }} 
                            />
                            <span>{semester}</span>
                          </button>

                          {expandedSemester === semester && (
                            <div className="documents-list">
                              {filterDocuments(docs).map((doc) => (
                                <div key={doc.id} className="document-item">
                                  <div className="doc-info">
                                    <FileText size={20} className="doc-icon" />
                                    <div className="doc-details">
                                      <p className="doc-name">{doc.name}</p>
                                      <p className="doc-size">{doc.size}</p>
                                    </div>
                                  </div>
                                  <div className="doc-actions">
                                    <button
                                      onClick={() => viewFile(doc)}
                                      className="action-btn view-btn"
                                      title="View document"
                                    >
                                      <Eye size={18} />
                                      View
                                    </button>
                                    <button
                                      onClick={() => downloadFile(doc)}
                                      className="action-btn download-btn"
                                      title="Download"
                                    >
                                      <Download size={18} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {selectedDocument && (
        <DocumentViewer
          document={selectedDocument}
          onClose={() => setSelectedDocument(null)}
          onDownload={downloadFile}
        />
      )}
    </div>
  );
};

export default DocumentManager;
