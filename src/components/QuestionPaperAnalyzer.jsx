import React, { useState } from 'react';
import { FileText, Zap, BarChart3, Download, Loader, AlertCircle, TrendingUp, Target } from 'lucide-react';
import { analyzeQuestionPapers, generatePredictedPaper, createPredictedPaperObject, exportPredictedPaper } from '../utils/questionAnalyzer';

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

  // Sample question papers for demonstration
  const sampleQuestionPapers = {
    'Semester 1': [
      {
        name: 'Semester 1 - Year 1 (2022)',
        content: `
          Q1) Define Agronomy and its scope
          Q2) Explain soil formation processes
          Q3) What are the different types of soil?
          Q4) Discuss the role of microorganisms in soil
          Q5) Explain nitrogen cycle
          Q6) Define Agronomy and its importance in agriculture
          Q7) What are essential nutrients for plants?
          Q8) Explain soil formation processes and factors
        `
      },
      {
        name: 'Semester 1 - Year 2 (2023)',
        content: `
          Q1) What is Agronomy? State its importance
          Q2) Explain soil formation with examples
          Q3) Describe different soil types
          Q4) Role of microorganisms in soil fertility
          Q5) Explain the nitrogen cycle in agriculture
          Q6) What are macro and micronutrients?
          Q7) Discuss soil composition
          Q8) Explain weathering and its types
        `
      },
      {
        name: 'Semester 1 - Year 3 (2024)',
        content: `
          Q1) Define Agronomy
          Q2) Soil formation factors and processes
          Q3) Types of soil and their characteristics
          Q4) Importance of microorganisms
          Q5) Nitrogen cycle explanation
          Q6) Plant nutrient requirements
          Q7) Soil profile and horizons
          Q8) Parent material and soil formation
        `
      },
      {
        name: 'Semester 1 - Year 4 (2025)',
        content: `
          Q1) Agronomy definition and scope
          Q2) How are soils formed?
          Q3) Soil classification systems
          Q4) Microbial role in agriculture
          Q5) Carbon and nitrogen cycles
          Q6) Essential elements for plant growth
          Q7) Soil properties and their importance
          Q8) Erosion and soil conservation
        `
      }
    ],
    'Semester 2': [
      {
        name: 'Semester 2 - Year 1 (2022)',
        content: `
          Q1) Explain crop rotation benefits
          Q2) What is irrigation?
          Q3) Discuss different irrigation methods
          Q4) Explain crop rotation benefits
          Q5) Water management in agriculture
          Q6) Types of irrigation systems
          Q7) Crop rotation and soil health
          Q8) Water conservation techniques
        `
      },
      {
        name: 'Semester 2 - Year 2 (2023)',
        content: `
          Q1) Importance of crop rotation
          Q2) Irrigation and its methods
          Q3) Crop rotation practices
          Q4) Water requirements of crops
          Q5) Drip irrigation advantages
          Q6) Soil-water relationships
          Q7) Sustainable irrigation practices
          Q8) Crop rotation examples
        `
      },
      {
        name: 'Semester 2 - Year 3 (2024)',
        content: `
          Q1) Benefits of crop rotation
          Q2) Types of irrigation systems
          Q3) Crop rotation benefits and examples
          Q4) Irrigation scheduling
          Q5) Sprinkler irrigation systems
          Q6) Soil water availability
          Q7) Sustainable water management
          Q8) Crop rotation for pest management
        `
      },
      {
        name: 'Semester 2 - Year 4 (2025)',
        content: `
          Q1) Crop rotation importance
          Q2) Irrigation methods and systems
          Q3) Crop rotation and sustainability
          Q4) Water management for agriculture
          Q5) Drip vs sprinkler irrigation
          Q6) Soil moisture and plant growth
          Q7) Water harvesting techniques
          Q8) Crop rotation for disease control
        `
      }
    ],
    'Semester 3': [
      {
        name: 'Semester 3 - Year 1 (2022)',
        content: `
          Q1) Explain plant family classification
          Q2) What is plant breeding?
          Q3) Discuss hybridization techniques
          Q4) Plant genetics basics
          Q5) Types of plant breeding methods
          Q6) Mutation and selection
          Q7) Plant family characteristics
          Q8) Major crops and their families
        `
      },
      {
        name: 'Semester 3 - Year 2 (2023)',
        content: `
          Q1) Plant family importance
          Q2) Plant breeding objectives
          Q3) Hybridization in agriculture
          Q4) Genetic variation and improvement
          Q5) Breeding methods and advantages
          Q6) Plant mutation and selection
          Q7) Classification of plant families
          Q8) Cereal and pulse families
        `
      },
      {
        name: 'Semester 3 - Year 3 (2024)',
        content: `
          Q1) Major plant families
          Q2) Plant breeding and its importance
          Q3) Hybridization process
          Q4) Genetic improvement techniques
          Q5) Breeding methods in agriculture
          Q6) Selection and breeding
          Q7) Plant classification systems
          Q8) Economic crops and families
        `
      },
      {
        name: 'Semester 3 - Year 4 (2025)',
        content: `
          Q1) Plant family classification
          Q2) Importance of plant breeding
          Q3) Hybridization techniques
          Q4) Genetic improvement
          Q5) Plant breeding methods
          Q6) Mutation breeding
          Q7) Major crop families
          Q8) Crop improvement through breeding
        `
      }
    ],
    'Semester 4': [
      {
        name: 'Semester 4 - Year 1 (2022)',
        content: `
          Q1) Explain pest management
          Q2) What are plant diseases?
          Q3) Discuss pest control methods
          Q4) Disease management strategies
          Q5) Integrated pest management
          Q6) Common agricultural pests
          Q7) Plant disease classification
          Q8) Pesticide usage and safety
        `
      },
      {
        name: 'Semester 4 - Year 2 (2023)',
        content: `
          Q1) Pest management importance
          Q2) Plant diseases and their control
          Q3) Pest control measures
          Q4) Disease management approaches
          Q5) Integrated pest management system
          Q6) Agricultural insect pests
          Q7) Disease classification and symptoms
          Q8) Pesticide application methods
        `
      },
      {
        name: 'Semester 4 - Year 3 (2024)',
        content: `
          Q1) Pest management strategies
          Q2) Plant disease control methods
          Q3) Pest control techniques
          Q4) Disease prevention strategies
          Q5) Integrated pest management
          Q6) Common crop pests
          Q7) Plant pathology basics
          Q8) Safe pesticide handling
        `
      },
      {
        name: 'Semester 4 - Year 4 (2025)',
        content: `
          Q1) Agricultural pest management
          Q2) Plant disease management
          Q3) Pest control methods
          Q4) Disease control strategies
          Q5) Pest management integration
          Q6) Field crop pests
          Q7) Disease symptoms and identification
          Q8) Sustainable pest management
        `
      }
    ]
  };

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
    const { generatePerfectQuestionPaper } = require('../utils/questionAnalyzer');
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
