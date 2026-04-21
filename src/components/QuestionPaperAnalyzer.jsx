import React, { useState } from 'react';
import { FileText, Zap, BarChart3, Download, Loader, AlertCircle, TrendingUp, Target } from 'lucide-react';
import { analyzeQuestionPapers, generatePredictedPaper, createPredictedPaperObject, exportPredictedPaper, generatePerfectQuestionPaper } from '../utils/questionAnalyzer';

import samplePapersData from '../data/samplePapers.json';

/**
 * QuestionPaperAnalyzer Component
 * Analyzes question papers to predict likely questions for upcoming exams
 */

const QuestionPaperAnalyzer = () => {
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [predictedPaper, setPredictedPaper] = useState(null);

  // Use imported sample data
  const sampleQuestionPapers = samplePapersData;

  const analyzeSemester = async (semester) => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Get question papers for selected semester
      const papers = sampleQuestionPapers[semester] || [];

      // Analyze papers
      const analysisResult = analyzeQuestionPapers(
        papers.map(p => ({
          name: p.name,
          content: p.content,
          text: p.content
        }))
      );

      setAnalysis(analysisResult);

      // Create predicted paper
      const predicted = createPredictedPaperObject(analysisResult, semester);
      setPredictedPaper(predicted);
      setSelectedSemester(semester);

    } catch (err) {
      setError(`Error analyzing: ${err.message}`);
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const downloadPredictedPaper = () => {
    if (!predictedPaper) return;

    // Use perfect question paper format
    const paperContent = generatePerfectQuestionPaper(analysis, selectedSemester, 120);
    
    const element = document.createElement('a');
    const file = new Blob([paperContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${selectedSemester}_Question_Paper_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="question-analyzer">
      {/* Header */}
      <div className="analyzer-header">
        <div className="header-content">
          <Zap size={28} className="header-icon" />
          <div>
            <h2>📊 Question Paper Analyzer & Predictor</h2>
            <p>Analyze past question papers to predict likely questions for your exam</p>
          </div>
        </div>
      </div>

      <div className="analyzer-container">
        {/* Semester Selection */}
        <section className="analyzer-section">
          <h3 className="section-title">📚 Select Semester to Analyze</h3>
          <div className="semester-grid">
            {Object.keys(sampleQuestionPapers).map(semester => (
              <button
                key={semester}
                onClick={() => analyzeSemester(semester)}
                disabled={loading}
                className={`semester-card ${selectedSemester === semester ? 'active' : ''} ${loading ? 'disabled' : ''}`}
              >
                <div className="semester-icon">📖</div>
                <div className="semester-label">{semester}</div>
                <div className="semester-status">
                  {selectedSemester === semester ? '✓ Analyzing...' : 'Click to analyze'}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Loading State */}
        {loading && (
          <div className="loading-section">
            <Loader className="spinner" size={40} />
            <p>Analyzing question papers...</p>
            <p className="sub-text">Finding repeated questions across years</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="error-section">
            <AlertCircle size={24} />
            <p>{error}</p>
          </div>
        )}

        {/* Analysis Results */}
        {analysis && !loading && (
          <section className="analyzer-section results-section">
            <h3 className="section-title">📈 Analysis Results for {selectedSemester}</h3>

            {/* Statistics */}
            <div className="statistics-grid">
              <div className="stat-card">
                <div className="stat-icon">📄</div>
                <div className="stat-content">
                  <div className="stat-label">Papers Analyzed</div>
                  <div className="stat-value">{analysis.totalPapers}</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">❓</div>
                <div className="stat-content">
                  <div className="stat-label">Total Questions</div>
                  <div className="stat-value">{analysis.totalQuestions}</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">🔄</div>
                <div className="stat-content">
                  <div className="stat-label">Repeated Questions</div>
                  <div className="stat-value">{analysis.analysis.totalRepeatedQuestions}</div>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">⚡</div>
                <div className="stat-content">
                  <div className="stat-label">Max Frequency</div>
                  <div className="stat-value">{analysis.analysis.mostRepeatedCount}x</div>
                </div>
              </div>
            </div>

            {/* Frequency Distribution */}
            <div className="frequency-chart">
              <h4>Question Frequency Distribution</h4>
              <div className="chart-bars">
                {Object.entries(analysis.frequencyDistribution)
                  .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
                  .map(([freq, count]) => (
                    <div key={freq} className="bar-item">
                      <div className="bar-label">{freq}x</div>
                      <div className="bar-container">
                        <div
                          className="bar-fill"
                          style={{
                            width: `${(count / Math.max(...Object.values(analysis.frequencyDistribution))) * 100}%`
                          }}
                        >
                          {count}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </section>
        )}

        {/* Predicted Paper */}
        {predictedPaper && !loading && (
          <section className="analyzer-section predicted-section">
            <div className="predicted-header">
              <div className="predicted-title">
                <Target size={24} />
                <h3>📄 Question Paper (Based on Repeated Questions Only)</h3>
              </div>
              <button className="download-predicted-btn" onClick={downloadPredictedPaper}>
                <Download size={18} />
                Download Paper
              </button>
            </div>

            <div className="paper-info-box">
              <div className="info-row">
                <span className="info-label">📚 Semester:</span>
                <span className="info-value">{selectedSemester}</span>
              </div>
              <div className="info-row">
                <span className="info-label">⏱️ Duration:</span>
                <span className="info-value">2 Hours (120 minutes)</span>
              </div>
              <div className="info-row">
                <span className="info-label">⭐ Total Marks:</span>
                <span className="info-value">{analysis.repeatedQuestions.filter(q => q.frequency >= 2).length * 5}</span>
              </div>
              <div className="info-row">
                <span className="info-label">📊 Questions:</span>
                <span className="info-value">{analysis.repeatedQuestions.filter(q => q.frequency >= 2).length} questions (5 marks each)</span>
              </div>
            </div>

            <div className="paper-instructions">
              <h4>📋 Instructions:</h4>
              <ul>
                <li>Answer ALL questions.</li>
                <li>Each question carries 5 marks.</li>
                <li>All questions are based on topics that repeated 2+ times in past {analysis.totalPapers} years.</li>
                <li>Write your answers clearly in your own words.</li>
                <li>Draw diagrams wherever necessary.</li>
              </ul>
            </div>

            <div className="question-paper-section">
              <h4>QUESTIONS</h4>
              <div className="question-paper-content">
                {analysis.repeatedQuestions
                  .filter(q => q.frequency >= 2)
                  .map((group, idx) => (
                    <div key={idx} className="paper-question-item">
                      <div className="paper-question-number">{idx + 1}</div>
                      <div className="paper-question-body">
                        <p className="paper-question-text">{group.questions[0]}</p>
                        <div className="paper-question-marks">[5 marks]</div>
                        <div className="paper-question-note">
                          ✓ Repeated {group.frequency} times in past papers
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="analysis-section-bottom">
              <h4>📊 Analysis Report</h4>
              <div className="analysis-details">
                <p>✓ Total Question Papers Analyzed: <strong>{analysis.totalPapers}</strong> years</p>
                <p>✓ Total Questions Processed: <strong>{analysis.totalQuestions}</strong></p>
                <p>✓ Questions Repeated 2+ Times: <strong>{analysis.repeatedQuestions.filter(q => q.frequency >= 2).length}</strong></p>
                <p>✓ Most Repeated: <strong>{analysis.analysis.mostRepeatedCount} times</strong></p>
                <p className="highlight">
                  💡 <strong>All questions in this paper have appeared in past {analysis.totalPapers} years 
                  (minimum 2 times). These are the most probable topics for the upcoming exam.</strong>
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Empty State */}
        {!analysis && !loading && (
          <div className="empty-state">
            <TrendingUp size={48} />
            <p>Select a semester to analyze question papers</p>
            <p className="sub-text">
              The analyzer will find repeated questions and predict likely exam questions
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionPaperAnalyzer;
