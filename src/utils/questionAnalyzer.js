/**
 * Question Paper Analysis Utility
 * Analyzes question papers to find repeated questions across years
 * Generates predicted question papers based on patterns
 */

/**
 * Parse question paper text to extract questions
 * This is a simple pattern-based parser
 */
export const parseQuestions = (text) => {
  if (!text) return [];

  const questions = [];
  
  // Common patterns for question numbering
  // Matches: Q1), Q.1), 1.), 1), 1., etc.
  const patterns = [
    /^[Qq](?:uestion)?\s*\.?\)?(\d+)\s*[.):-]\s*(.+?)(?=(?:^[Qq]|^\d+[.):-])|$)/gm,
    /^\d+[.):-]\s*(.+?)(?=(?:^\d+[.):-])|$)/gm,
  ];

  let questionTexts = [];
  
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(text)) !== null) {
      const questionText = match[match.length - 1]?.trim() || match[1]?.trim();
      if (questionText && questionText.length > 5) {
        questionTexts.push(questionText);
      }
    }
  }

  // Remove duplicates and normalize
  questionTexts = [...new Set(questionTexts)];

  return questionTexts.map((q, idx) => ({
    id: `q_${idx}`,
    text: q.substring(0, 200), // First 200 chars
    fullText: q,
    frequency: 1
  }));
};

/**
 * Calculate similarity between two questions (0-1 scale)
 * Uses a simple word-overlap algorithm
 */
export const calculateSimilarity = (q1, q2) => {
  if (!q1 || !q2) return 0;

  const text1 = q1.toLowerCase();
  const text2 = q2.toLowerCase();

  // If texts are identical
  if (text1 === text2) return 1;

  // Split into words and remove common words
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'as', 'is', 'are', 'was', 'were', 'be',
    'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
    'could', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those',
    'what', 'which', 'who', 'why', 'how', 'when', 'where', 'define', 'explain',
    'write', 'state', 'give', 'describe', 'answer', 'list'
  ]);

  const words1 = text1
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w));
  
  const words2 = text2
    .split(/\s+/)
    .filter(w => w.length > 2 && !stopWords.has(w));

  if (words1.length === 0 || words2.length === 0) return 0;

  // Count matching words
  const set2 = new Set(words2);
  const matches = words1.filter(w => set2.has(w)).length;

  // Jaccard similarity
  const union = new Set([...words1, ...words2]).size;
  return matches / union;
};

/**
 * Find repeated questions across papers
 */
export const findRepeatedQuestions = (paperArray, similarityThreshold = 0.6) => {
  const repeatedGroups = [];
  const processed = new Set();

  for (let i = 0; i < paperArray.length; i++) {
    if (processed.has(i)) continue;

    const group = {
      questions: [{ ...paperArray[i], paperIndex: i }],
      frequency: 1,
      similarity: 1
    };

    for (let j = i + 1; j < paperArray.length; j++) {
      if (processed.has(j)) continue;

      const similarity = calculateSimilarity(paperArray[i].text, paperArray[j].text);
      
      if (similarity >= similarityThreshold) {
        group.questions.push({ ...paperArray[j], paperIndex: j, similarity });
        group.frequency++;
        processed.add(j);
      }
    }

    if (group.frequency > 1) {
      repeatedGroups.push(group);
    }
    processed.add(i);
  }

  return repeatedGroups.sort((a, b) => b.frequency - a.frequency);
};

/**
 * Analyze multiple question papers from a semester
 */
export const analyzeQuestionPapers = (papers) => {
  if (!papers || papers.length === 0) {
    return {
      totalPapers: 0,
      totalQuestions: 0,
      repeatedQuestions: [],
      analysis: null
    };
  }

  // Parse all papers
  const allQuestions = papers.map(paper => ({
    ...paper,
    questions: parseQuestions(paper.content || paper.text)
  }));

  // Flatten all questions from all papers
  let flatQuestions = [];
  allQuestions.forEach(paper => {
    if (paper.questions) {
      flatQuestions = flatQuestions.concat(
        paper.questions.map(q => ({ ...q, source: paper.name }))
      );
    }
  });

  // Find repeated questions
  const repeatedQuestions = findRepeatedQuestions(
    flatQuestions.map(q => q.fullText || q.text),
    0.65
  );

  // Group by frequency
  const frequencyDistribution = {};
  repeatedQuestions.forEach(group => {
    frequencyDistribution[group.frequency] = (frequencyDistribution[group.frequency] || 0) + 1;
  });

  return {
    totalPapers: papers.length,
    totalQuestions: flatQuestions.length,
    repeatedQuestions: repeatedQuestions.slice(0, 50), // Top 50
    frequencyDistribution,
    analysis: {
      mostRepeatedCount: repeatedQuestions.length > 0 ? repeatedQuestions[0].frequency : 0,
      averageFrequency: repeatedQuestions.length > 0 
        ? (repeatedQuestions.reduce((sum, g) => sum + g.frequency, 0) / repeatedQuestions.length).toFixed(2)
        : 0,
      totalRepeatedQuestions: repeatedQuestions.reduce((sum, g) => sum + g.frequency, 0)
    }
  };
};

/**
 * Generate perfect question paper format
 * Only includes questions that repeated in past years
 */
export const generatePerfectQuestionPaper = (analysis, semester, timeMinutes = 120) => {
  // Filter to only questions repeated 2+ times
  const repeatedOnlyQuestions = analysis.repeatedQuestions.filter(q => q.frequency >= 2);

  if (repeatedOnlyQuestions.length === 0) {
    return "No repeated questions found. Try a different semester.";
  }

  const totalMarks = repeatedOnlyQuestions.length * 5; // 5 marks per question
  const currentDate = new Date();
  const dateStr = currentDate.toLocaleDateString('en-IN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  let paper = `
═══════════════════════════════════════════════════════════════════════════
                            EXAMINATION PAPER
═══════════════════════════════════════════════════════════════════════════

Course: Agricultural Science (${semester})
Time Duration: ${timeMinutes} Minutes                                Total Marks: ${totalMarks}
Date: ${dateStr}

═══════════════════════════════════════════════════════════════════════════
INSTRUCTIONS:
═══════════════════════════════════════════════════════════════════════════

1. Answer ALL questions.
2. Each question carries 5 marks.
3. Write your answers in your own words.
4. Draw diagrams wherever necessary.
5. Marks will be awarded for clarity, explanation, and conceptual understanding.
6. This question paper is based on repeated questions from past ${analysis.totalPapers} years.

═══════════════════════════════════════════════════════════════════════════
QUESTIONS (Based on Past Year Repetition Analysis)
═══════════════════════════════════════════════════════════════════════════
`;

  let questionNum = 1;
  repeatedOnlyQuestions.forEach((group) => {
    const frequencyStr = group.frequency === analysis.analysis.mostRepeatedCount 
      ? '⭐ HIGHLY REPEATED' 
      : 'Repeated in past years';
    
    paper += `

${questionNum}. ${group.questions[0]}
    [${frequencyStr} - Appeared ${group.frequency} times] (5 marks)
`;
    questionNum++;
  });

  paper += `

═══════════════════════════════════════════════════════════════════════════
ANALYSIS REPORT
═══════════════════════════════════════════════════════════════════════════

Total Papers Analyzed: ${analysis.totalPapers} years
Total Questions Processed: ${analysis.totalQuestions}
Repeated Questions (2+ times): ${repeatedOnlyQuestions.length}
Most Repeated Frequency: ${analysis.analysis.mostRepeatedCount} times
Average Repetition: ${analysis.analysis.averageFrequency}x

⭐ NOTE: All questions in this paper have appeared in past ${analysis.totalPapers} years 
(minimum 2 times). These are the most probable topics that will appear in 
the upcoming examination.

═══════════════════════════════════════════════════════════════════════════
Generated: ${dateStr}
═══════════════════════════════════════════════════════════════════════════
`;

  return paper;
};

/**
 * Generate predicted question paper (legacy)
 */
export const generatePredictedPaper = (analysis, title = "Predicted Question Paper") => {
  return generatePerfectQuestionPaper(analysis, title);
};

/**
 * Create a structured predicted paper object
 */
export const createPredictedPaperObject = (analysis, semester) => {
  return {
    id: `predicted_${semester}_${Date.now()}`,
    title: `Predicted Question Paper - ${semester}`,
    semester,
    generatedDate: new Date().toISOString(),
    analysis: {
      totalPapersAnalyzed: analysis.totalPapers,
      totalQuestionsAnalyzed: analysis.totalQuestions,
      mostRepeatedFrequency: analysis.analysis.mostRepeatedCount,
      averageFrequency: analysis.analysis.averageFrequency
    },
    predictedQuestions: analysis.repeatedQuestions.map((group, idx) => ({
      questionNumber: idx + 1,
      content: group.questions[0],
      frequency: group.frequency,
      confidence: Math.round((group.frequency / analysis.totalPapers) * 100),
      appearedIn: `${group.frequency} past papers`
    }))
  };
};

/**
 * Export predicted paper as downloadable content
 */
export const exportPredictedPaper = (predictedPaper) => {
  let content = `PREDICTED QUESTION PAPER\n`;
  content += `Semester: ${predictedPaper.semester}\n`;
  content += `Generated: ${new Date(predictedPaper.generatedDate).toLocaleDateString()}\n`;
  content += `\n${'='.repeat(70)}\n\n`;

  content += `ANALYSIS RESULTS:\n`;
  content += `- Papers Analyzed: ${predictedPaper.analysis.totalPapersAnalyzed}\n`;
  content += `- Questions Analyzed: ${predictedPaper.analysis.totalQuestionsAnalyzed}\n`;
  content += `- Most Repeated: ${predictedPaper.analysis.mostRepeatedFrequency} times\n`;
  content += `- Average Frequency: ${predictedPaper.analysis.averageFrequency}\n\n`;

  content += `${'='.repeat(70)}\n`;
  content += `PREDICTED QUESTIONS:\n`;
  content += `${'='.repeat(70)}\n\n`;

  predictedPaper.predictedQuestions.forEach(q => {
    content += `Q${q.questionNumber}. ${q.content}\n`;
    content += `    Frequency: ${q.frequency} times\n`;
    content += `    Confidence: ${q.confidence}%\n\n`;
  });

  return content;
};
