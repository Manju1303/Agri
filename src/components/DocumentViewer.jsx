import React, { useState } from 'react';
import { FileText, Download, X, ChevronLeft, ChevronRight, Eye, Maximize2, Minimize2 } from 'lucide-react';

/**
 * DocumentViewer Component
 * Displays documents with preview capability
 * Supports PDFs, images, and other file types
 */

const DocumentViewer = ({ document, onClose, onDownload }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [scale, setScale] = useState(1);

  const getFileType = (filename) => {
    const ext = filename.split('.').pop().toLowerCase();
    return ext;
  };

  const fileType = getFileType(document.name);

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Handle zoom controls
  const zoomIn = () => setScale(s => Math.min(s + 0.2, 3));
  const zoomOut = () => setScale(s => Math.max(s - 0.2, 0.5));
  const resetZoom = () => setScale(1);

  const viewerClass = isFullscreen ? 'viewer-fullscreen' : '';

  return (
    <div className={`document-viewer-overlay ${viewerClass}`}>
      <div className={`document-viewer ${viewerClass}`}>
        {/* Header */}
        <div className="viewer-header">
          <div className="viewer-title">
            <FileText size={24} />
            <span>{document.name}</span>
            <span className="file-size">({document.size})</span>
          </div>

          <div className="viewer-controls">
            {/* Zoom Controls */}
            {['pdf', 'png', 'jpg', 'jpeg', 'gif'].includes(fileType) && (
              <div className="zoom-controls">
                <button
                  onClick={zoomOut}
                  title="Zoom out"
                  className="zoom-btn"
                >
                  −
                </button>
                <span className="zoom-label">{Math.round(scale * 100)}%</span>
                <button
                  onClick={zoomIn}
                  title="Zoom in"
                  className="zoom-btn"
                >
                  +
                </button>
                <button
                  onClick={resetZoom}
                  title="Reset zoom"
                  className="zoom-btn reset"
                >
                  Reset
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <button
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
              className="control-btn"
            >
              {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>

            <button
              onClick={() => onDownload(document)}
              title="Download"
              className="control-btn download-btn"
            >
              <Download size={20} />
              Download
            </button>

            <button
              onClick={onClose}
              title="Close"
              className="control-btn close-btn"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="viewer-content" style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>
          {/* PDF Preview */}
          {fileType === 'pdf' && (
            <div className="pdf-preview">
              <embed
                src={document.url}
                type="application/pdf"
                width="100%"
                height="100%"
              />
            </div>
          )}

          {/* Image Preview */}
          {['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(fileType) && (
            <div className="image-preview">
              <img
                src={document.url}
                alt={document.name}
                style={{ maxWidth: '100%', height: 'auto' }}
              />
            </div>
          )}

          {/* Text Files */}
          {['txt', 'md', 'json', 'xml', 'csv'].includes(fileType) && (
            <div className="text-preview">
              <iframe
                src={document.url}
                title={document.name}
                style={{ width: '100%', height: '100%', border: 'none' }}
              />
            </div>
          )}

          {/* Word/Excel/PowerPoint */}
          {['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(fileType) && (
            <div className="office-preview">
              <div className="office-message">
                <FileText size={48} />
                <p>Preview not available for {fileType.toUpperCase()} files</p>
                <p className="sub-text">Use the download button to view this file</p>
                <button
                  onClick={() => onDownload(document)}
                  className="download-btn-large"
                >
                  <Download size={20} />
                  Download {fileType.toUpperCase()}
                </button>
              </div>
            </div>
          )}

          {/* Unsupported Format */}
          {!['pdf', 'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'txt', 'md', 'json', 'xml', 'csv', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(fileType) && (
            <div className="unsupported-preview">
              <div className="unsupported-message">
                <FileText size={48} />
                <p>Preview not available</p>
                <p className="sub-text">File type: .{fileType}</p>
                <button
                  onClick={() => onDownload(document)}
                  className="download-btn-large"
                >
                  <Download size={20} />
                  Download File
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="viewer-footer">
          <p>💡 Tip: Use Ctrl+Scroll or +/- buttons to zoom. Click download to save the file.</p>
        </div>
      </div>
    </div>
  );
};

export default DocumentViewer;
