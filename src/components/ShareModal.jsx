import React, { useState } from 'react';
import { Share2, Mail, Copy, Check, X } from 'lucide-react';
import { useSharing, useNotifications } from '../hooks/useAPI';
import '../styles/ShareModal.css';

const ShareModal = ({ itemType, itemId, itemTitle, onClose }) => {
  const { shareDocument, shareQuestionPaper, loading, error } = useSharing();
  const { createNotification } = useNotifications();
  const [sharedEmails, setSharedEmails] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);
  const [tabs, setTabs] = useState('email');
  const [userId] = useState('user-001');

  // Generate shareable link
  const shareLink = `${window.location.origin}/#/shared/${itemType}/${itemId}`;

  const handleShare = async (e) => {
    e.preventDefault();
    
    if (!sharedEmails.trim()) {
      alert('Please enter at least one email address');
      return;
    }

    const emails = sharedEmails
      .split(',')
      .map(email => email.trim())
      .filter(email => email);

    try {
      const shareData = {
        [itemType === 'document' ? 'documentId' : 'paperId']: itemId,
        sharedBy: userId,
        sharedWith: emails,
        message: message
      };

      if (itemType === 'document') {
        await shareDocument(shareData);
      } else {
        await shareQuestionPaper(shareData);
      }

      setSuccess(true);
      setSharedEmails('');
      setMessage('');

      // Create notification
      await createNotification({
        userId: userId,
        type: 'share',
        title: `Shared ${itemType === 'document' ? 'document' : 'question paper'}`,
        message: `You shared "${itemTitle}" with ${emails.length} recipient(s)`
      });

      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="share-modal-header">
          <h3>Share {itemType === 'document' ? 'Document' : 'Question Paper'}</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div className="share-success">
            <Check size={48} />
            <h4>Shared Successfully!</h4>
            <p>Your {itemType} has been shared with the selected recipients.</p>
            <p className="success-message">They'll receive notifications shortly.</p>
          </div>
        ) : (
          <>
            {/* Tabs */}
            <div className="share-tabs">
              <button
                className={`tab-btn ${tabs === 'email' ? 'active' : ''}`}
                onClick={() => setTabs('email')}
              >
                <Mail size={18} />
                Email Recipients
              </button>
              <button
                className={`tab-btn ${tabs === 'link' ? 'active' : ''}`}
                onClick={() => setTabs('link')}
              >
                <Share2 size={18} />
                Share Link
              </button>
            </div>

            {/* Tab Content */}
            <div className="share-modal-content">
              {tabs === 'email' ? (
                <form onSubmit={handleShare}>
                  <div className="form-group">
                    <label>Email Addresses</label>
                    <textarea
                      placeholder="Enter email addresses separated by commas&#10;e.g., student1@example.com, student2@example.com"
                      value={sharedEmails}
                      onChange={e => setSharedEmails(e.target.value)}
                      rows={4}
                      className="email-input"
                    />
                    <small>Enter one or more email addresses separated by commas</small>
                  </div>

                  <div className="form-group">
                    <label>Message (Optional)</label>
                    <textarea
                      placeholder="Add a personal message..."
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      rows={3}
                      className="message-input"
                    />
                  </div>

                  {error && <div className="error-message">{error}</div>}

                  <button
                    type="submit"
                    className="btn-share"
                    disabled={loading || !sharedEmails.trim()}
                  >
                    {loading ? 'Sharing...' : 'Share Now'}
                  </button>
                </form>
              ) : (
                <div className="link-share">
                  <div className="link-info">
                    <p>Anyone with this link can access the {itemType}:</p>
                  </div>

                  <div className="link-container">
                    <input
                      type="text"
                      value={shareLink}
                      readOnly
                      className="link-input"
                    />
                    <button
                      className="copy-btn"
                      onClick={copyToClipboard}
                      title="Copy link"
                    >
                      {copied ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                  </div>

                  <p className="copied-message" style={{ opacity: copied ? 1 : 0 }}>
                    ✓ Copied to clipboard!
                  </p>

                  <div className="link-share-methods">
                    <h4>Share via:</h4>
                    <div className="share-buttons">
                      <a
                        href={`https://mail.google.com/mail/?view=cm&fs=1&body=${encodeURIComponent(shareLink + '\n\nShared: ' + itemTitle)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="share-btn gmail"
                      >
                        Gmail
                      </a>
                      <a
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(itemTitle + '\n' + shareLink)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="share-btn whatsapp"
                      >
                        WhatsApp
                      </a>
                      <a
                        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(itemTitle + ' ' + shareLink)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="share-btn twitter"
                      >
                        Twitter
                      </a>
                      <a
                        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="share-btn facebook"
                      >
                        Facebook
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ShareModal;
