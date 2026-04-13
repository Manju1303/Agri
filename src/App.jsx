import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, useParams } from 'react-router-dom';
import { Leaf, GraduationCap, Calculator, Send, Mail, MapPin, Phone, Menu, X, ChevronRight, FileText, BookOpen, UserCheck, Shield, Book, Plus, Trash2, ExternalLink, Sparkles, Cpu, Layers } from 'lucide-react';
import './App.css';

// Components
const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  React.useEffect(() => {
    setIsOpen(false);
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <nav className="nav-wrapper">
      <div className="container nav-container">
        <Link to="/" className="logo">
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="AgriArchive Logo" style={{ height: '40px', borderRadius: '8px' }} />
          <span>AgriArchive</span>
        </Link>
        
        <div className={`nav-links ${isOpen ? 'active' : ''}`}>
          <Link to="/">Dashboard</Link>
          <Link to="/study-materials">Resources</Link>
          <Link to="/gpa-calculator">GPA Calc</Link>
          <Link to="/about-us">About</Link>
          <a href="https://telegram.me/agrijunctioncrew" target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
            <Send size={18} /> Join Telegram
          </a>
        </div>

        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle navigation">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
    </nav>
  );
};

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-grid">
        <div className="footer-col" style={{ gridColumn: 'span 2' }}>
          <Link to="/" className="logo" style={{ marginBottom: '2.5rem' }}>
            <img src={`${import.meta.env.BASE_URL}logo.png`} alt="AgriArchive Logo" style={{ height: '40px', borderRadius: '8px', marginRight: '10px' }} />
            <span>AgriArchive</span>
          </Link>
          <p style={{ opacity: 0.6, fontSize: '1.1rem', maxWidth: '400px', lineHeight: '1.8' }}>
            Advanced educational portal for agricultural sciences. High-fidelity resources, paper archives, and academic tools for modern learners.
          </p>
        </div>
        <div className="footer-col">
          <h4>Exploration</h4>
          <ul>
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/study-materials">Material Hub</Link></li>
            <li><Link to="/gpa-calculator">GPA Tools</Link></li>
            <li><a href="https://telegram.me/agrijunctioncrew" target="_blank" rel="noopener noreferrer">Community</a></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>Legals</h4>
          <ul>
            <li><Link to="/disclaimer">Legal Disclaimer</Link></li>
            <li><Link to="/terms-and-conditions">Usage Terms</Link></li>
            <li><Link to="/privacy-policy">Privacy Protocol</Link></li>
            <li><Link to="/about-us">Vision & About</Link></li>
          </ul>
        </div>
      </div>
      <div className="copyright">
        <p>&copy; {new Date().getFullYear()} AgriArchive. Accelerated Digital Repository.</p>
        <p style={{ fontSize: '0.8rem', marginTop: '1rem', opacity: 0.5 }}>Sync ID: AJ-2026-X1178</p>
      </div>
    </div>
  </footer>
);

// Pages
const Home = () => (
  <div className="fade-in">
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <div className="badge mb-4" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--primary)', padding: '0.6rem 1.2rem', borderRadius: '30px', fontWeight: 'bold', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}>
            <Sparkles size={16} /> Precision Learning 2026
          </div>
          <h1>The Next-Gen <span style={{ color: 'var(--primary)' }}>Agri-Library</span></h1>
          <p>Access hyper-accurate course modules, high-resolution previous archives, and advanced GPA metrics for the modern agriculture scholar.</p>
          <div className="hero-btns" style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <Link to="/study-materials" className="btn btn-primary">
              <BookOpen size={20} /> Access Modules
            </Link>
            <Link to="/gpa-calculator" className="btn btn-outline">
              <Calculator size={20} /> Calc GPA
            </Link>
          </div>
        </div>
      </div>
    </section>

    <section className="section" style={{ background: '#010413' }}>
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
          <h2 style={{ fontSize: '3rem', marginBottom: '1.5rem', fontWeight: 800 }}>Core Systems</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '650px', margin: '0 auto', fontSize: '1.2rem' }}>State-of-the-art resources designed for academic speed and reliability.</p>
        </div>
        <div className="grid grid-cols-3">
          <div className="card">
            <Cpu className="w-12 h-12 mb-6" style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Module Repository</h3>
            <p style={{ color: 'var(--text-muted)' }}>High-fidelity course materials for ICAR 5th Deans' Committee Syllabus across all departments.</p>
          </div>
          <div className="card">
            <Calculator className="w-12 h-12 mb-6" style={{ color: 'var(--primary)' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Smart Metrics</h3>
            <p style={{ color: 'var(--text-muted)' }}>Advanced GPA algorithms providing instant academic tracking and semester performance history.</p>
          </div>
          <div className="card" style={{ border: '1px solid rgba(251, 191, 36, 0.2)' }}>
            <Layers className="w-12 h-12 mb-6" style={{ color: 'var(--accent)' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Resource Stacks</h3>
            <p style={{ color: 'var(--text-muted)' }}>Thousands of question archives and lecture series available in high-performance digital formats.</p>
          </div>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="container">
        <div className="cta-card glass-dark" style={{ padding: '6rem 4rem', borderRadius: '40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'relative', zIndex: 5 }}>
            <h2 style={{ fontSize: '3.5rem', marginBottom: '2rem', fontWeight: 900 }}>Join the Collective</h2>
            <p style={{ fontSize: '1.4rem', marginBottom: '3.5rem', color: 'var(--text-muted)', maxWidth: '800px', margin: '0 auto 3.5rem' }}>Sync with over 15,000+ agricultural scholars in real-time. Instant updates, direct resource sharing, and global support.</p>
            <a href="https://telegram.me/agrijunctioncrew" target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontSize: '1.25rem', padding: '1.2rem 3rem', borderRadius: '20px' }}>
              <Send size={24} /> Initialize Telegram Sync
            </a>
          </div>
          <div style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.05) 0%, transparent 70%)' }}></div>
        </div>
      </div>
    </section>
  </div>
);

const StudyMaterials = () => (
  <div className="section fade-in">
    <div className="container">
      <h1 className="mb-4" style={{ fontSize: '3.5rem' }}>Resource Hub</h1>
      <p className="mb-12" style={{ color: 'var(--text-muted)', fontSize: '1.25rem', maxWidth: '800px' }}>Select your primary architecture to access course-specific modules and research archives.</p>
      
      <div className="grid grid-cols-3">
        <Link to="/UGM" className="card group">
          <GraduationCap className="mb-6" size={56} color="#10b981" />
          <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Agriculture UG</h3>
          <p style={{ color: 'var(--text-muted)' }}>Full UG modules for ICAR & SAUs. Multiple medium support including Tamil & English.</p>
          <span className="btn-text mt-8" style={{ marginTop: '2.5rem' }}>Explore Semesters <ChevronRight size={20} /></span>
        </Link>
        <Link to="/horticulture" className="card">
          <Leaf className="mb-6" size={56} color="#10b981" />
          <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>Horticulture UG</h3>
          <p style={{ color: 'var(--text-muted)' }}>Advanced modules for horticultural sciences and experimental research papers.</p>
          <span className="btn-text mt-8" style={{ marginTop: '2.5rem' }}>Explore Semesters <ChevronRight size={20} /></span>
        </Link>
        <div className="card" style={{ opacity: 0.8, borderStyle: 'dashed' }}>
          <FileText className="mb-6" size={56} color="#94a3b8" />
          <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem', color: '#94a3b8' }}>PG & PhD Lab</h3>
          <p style={{ color: 'var(--text-muted)' }}>Specialized JRF/SRF preparation modules and thesis methodology guides.</p>
          <span className="btn-text mt-8" style={{ marginTop: '2.5rem', color: '#94a3b8' }}>Finalizing Modules <ChevronRight size={20} /></span>
        </div>
      </div>
    </div>
  </div>
);

const Agriculture = () => (
  <div className="section fade-in">
    <div className="container">
      <Link to="/study-materials" className="btn-text mb-12">
        <ChevronRight style={{ transform: 'rotate(180deg)' }} size={20} /> Back to Nexus Hub
      </Link>
      <h1 className="mb-4" style={{ fontSize: '3rem' }}>Agriculture (UG) Modules</h1>
      <p className="mb-12" style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Index of semester modules following ICAR 5th Deans' Committee specifications.</p>
      
      <div className="semester-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
          <Link key={s} to={`/UGM/${s}S`} className="card" style={{ padding: '2rem 3rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ background: 'var(--primary)', color: 'white', width: '56px', height: '56px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '16px', fontWeight: '900', fontSize: '1.5rem', border: '1px solid rgba(255,255,255,0.2)' }}>{s}</div>
              <h3 style={{ margin: 0, fontSize: '1.4rem' }}>Semester {s}</h3>
            </div>
            <div className="mt-8" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', opacity: 0.6 }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 'bold' }}>ACCESS GRANTED</span>
              <ChevronRight size={24} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  </div>
);

const SemesterView = ({ s }) => {
  const courses = [
    { id: 'AEX-101', name: 'Fundamentals of Agri Extension' },
    { id: 'AGR-101', name: 'Fundamentals of Agronomy' },
    { id: 'BIC-101', name: 'Plant Biochemistry Analysis' },
    { id: 'ENG-101', name: 'Advanced Communication Skills' },
    { id: 'HOR-111', name: 'Horticulture Fundamentals' },
    { id: 'MAT-111', name: 'Elementary Calculus' },
    { id: 'SAC-101', name: 'Applied Soil Science' },
    { id: 'TAM-101', name: 'Agricultural Literature' },
  ];

  return (
    <div className="section fade-in">
      <div className="container">
        <Link to="/UGM" className="btn-text mb-12">
          <ChevronRight style={{ transform: 'rotate(180deg)' }} size={20} /> Back to Semesters
        </Link>
        <div style={{ borderLeft: '6px solid var(--primary)', paddingLeft: '2rem', marginBottom: '5rem' }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>Semester {s} Stack</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Detailed course modules and digital archives for Semester {s}.</p>
        </div>
        <div className="grid grid-cols-2" style={{ display: 'grid', gap: '1.5rem' }}>
          {courses.map(course => (
            <Link key={course.id} to={`/UGM/course/${course.id}`} className="card" style={{ padding: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.85rem', fontWeight: '900', color: 'var(--primary)', letterSpacing: '2px', textTransform: 'uppercase' }}>MODULE {course.id}</span>
                <h3 style={{ margin: '0.5rem 0 0', fontSize: '1.4rem', color: 'white' }}>{course.name}</h3>
              </div>
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '0.75rem', borderRadius: '12px', color: 'var(--primary)' }}>
                <ChevronRight size={24} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

const CourseDetails = ({ name, id }) => (
  <div className="section fade-in">
    <div className="container" style={{ maxWidth: '1100px' }}>
      <Link to="/UGM/1S" className="btn-text mb-12">
        <ChevronRight style={{ transform: 'rotate(180deg)' }} size={20} /> Back to Module Stack
      </Link>
      <div className="course-header" style={{ marginBottom: '5rem' }}>
        <h1 className="mb-6" style={{ fontSize: '4.5rem', lineHeight: 1 }}>{id} - {name}</h1>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <span className="badge" style={{ background: 'var(--primary)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '15px', fontSize: '0.9rem', fontWeight: '900' }}>LOCAL REPOSITORY</span>
          <span className="badge" style={{ background: '#334155', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '15px', fontSize: '0.9rem', fontWeight: '900' }}>OFFLINE ACCESS</span>
        </div>
      </div>
      <div className="grid grid-cols-2">
        {[
          { title: 'Data Bank', type: 'question-bank', icon: <FileText size={48} />, count: 'Local Archive', color: '#10b981' },
          { title: 'Theory Core', type: 'theory', icon: <Book size={48} />, count: 'Full Text', color: '#3182ce' },
          { title: 'Slide Stacks', type: 'slides', icon: <Send size={48} />, count: 'Visual Deck', color: '#e67e22' },
          { title: 'Lab Protocols', type: 'manual', icon: <UserCheck size={48} />, count: 'Practical Guide', color: '#9f7aea' },
        ].map((item, i) => (
          <Link key={i} to={`/viewer/${id}/${item.type}`} className="card" style={{ display: 'flex', alignItems: 'center', gap: '3rem', padding: '3.5rem' }}>
            <div style={{ background: `${item.color}15`, color: item.color, width: '110px', height: '110px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '24px', border: `1px solid ${item.color}30` }}>
              {item.icon}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1.85rem', marginBottom: '0.5rem', color: 'white' }}>{item.title}</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '1rem', fontWeight: 'bold' }}>{item.count}</p>
              <div className="btn btn-primary btn-sm" style={{ background: item.color, borderColor: item.color }}>
                 <BookOpen size={20} /> Open Locally
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  </div>
);

const DocumentViewer = () => {
  const { courseId, docType } = useParams();
  const [error, setError] = useState(false);
  const docUrl = `${import.meta.env.BASE_URL}docs/${courseId}/${docType}.pdf`;

  return (
    <div className="section fade-in" style={{ padding: '2rem 0' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <Link to={-1} className="btn-text">
            <ChevronRight style={{ transform: 'rotate(180deg)' }} /> Back to Module
          </Link>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <a href={docUrl} download className="btn btn-primary btn-sm" style={{ padding: '0.5rem 1rem' }}>
              <Plus style={{ transform: 'rotate(0deg)' }} /> Download PDF
            </a>
            <div style={{ textAlign: 'right' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--primary)' }}>{courseId}</h2>
              <p style={{ textTransform: 'uppercase', fontSize: '0.8rem', opacity: 0.6 }}>{docType.replace('-', ' ')}</p>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 0, height: '85vh', overflow: 'hidden', background: '#000', position: 'relative' }}>
          {error ? (
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
              <Shield size={64} color="#ef4444" className="mb-4" />
              <h3>Document Not Found Locally</h3>
              <p style={{ color: 'var(--text-muted)', maxWidth: '400px', marginTop: '1rem' }}>
                The file <code>{docUrl}</code> is missing from the local repository. 
                Please ensure you have downloaded the documents to the <code>/public/docs</code> directory.
              </p>
              <a href="https://telegram.me/agrijunctioncrew" target="_blank" rel="noopener noreferrer" className="btn btn-outline mt-8">
                <Send size={18} /> Get from Telegram
              </a>
            </div>
          ) : (
            <iframe 
              src={`${docUrl}#toolbar=0`} 
              width="100%" 
              height="100%" 
              style={{ border: 'none' }}
              onError={() => setError(true)}
              title="Document Viewer"
            ></iframe>
          )}
        </div>
      </div>
    </div>
  );
};

const GPACalculator = () => {
  const [courses, setCourses] = useState([{ id: 1, credit: '', grade: '' }]);
  const [result, setResult] = useState(null);

  const addCourse = () => {
    setCourses([...courses, { id: Date.now(), credit: '', grade: '' }]);
  };

  const removeCourse = (id) => {
    if (courses.length > 1) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const handleChange = (id, field, value) => {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const calculateGPA = () => {
    let totalCredits = 0;
    let weightedSum = 0;
    courses.forEach(c => {
      const credit = parseFloat(c.credit);
      const grade = parseFloat(c.grade);
      if (!isNaN(credit) && !isNaN(grade)) {
        totalCredits += credit;
        weightedSum += (credit * grade);
      }
    });
    if (totalCredits > 0) {
      setResult((weightedSum / totalCredits).toFixed(3));
    } else {
      setResult(null);
    }
  };

  return (
    <div className="section fade-in">
      <div className="container" style={{ maxWidth: '900px' }}>
        <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
          <h1 className="mb-4" style={{ fontSize: '4.5rem', fontWeight: 900 }}>GPA Metric</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.35rem' }}>Advanced GPA computation engine for semester performance tracking.</p>
        </div>
        
        <div className="card" style={{ padding: '4rem', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 60px', gap: '3rem', marginBottom: '3rem', paddingBottom: '1.5rem', borderBottom: '2px solid rgba(255,255,255,0.05)' }}>
            <span style={{ fontWeight: '900', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '2px' }}>Input Credits</span>
            <span style={{ fontWeight: '900', color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '2px' }}>Metric Points (0-10)</span>
            <span></span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {courses.map((course) => (
              <div key={course.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 60px', gap: '3rem', alignItems: 'center' }}>
                <input 
                  type="number" 
                  step="0.5"
                  placeholder="e.g. 3.0" 
                  value={course.credit}
                  onChange={(e) => handleChange(course.id, 'credit', e.target.value)}
                />
                <input 
                  type="number" 
                  step="0.1"
                  placeholder="e.g. 8.5" 
                  value={course.grade}
                  onChange={(e) => handleChange(course.id, 'grade', e.target.value)}
                />
                <button 
                  onClick={() => removeCourse(course.id)} 
                  style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#ef4444', width: '60px', height: '60px', borderRadius: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'var(--transition)' }}
                >
                  <Trash2 size={24} />
                </button>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '2rem', marginTop: '5rem' }}>
            <button onClick={addCourse} className="btn btn-outline" style={{ flex: 1, padding: '1.25rem' }}>
              <Plus size={24} /> New Subject
            </button>
            <button onClick={calculateGPA} className="btn btn-primary" style={{ flex: 2, padding: '1.25rem', fontSize: '1.25rem' }}>
              Initialize Calculation
            </button>
          </div>

          {result && (
            <div style={{ marginTop: '5rem', padding: '4.5rem', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderRadius: '32px', textAlign: 'center', color: 'white', boxShadow: '0 40px 100px -20px rgba(16, 185, 129, 0.4)' }}>
              <p style={{ textTransform: 'uppercase', letterSpacing: '4px', fontWeight: '900', fontSize: '1rem', opacity: 0.8, marginBottom: '1.5rem' }}>Semester Performance Index</p>
              <h2 style={{ fontSize: '7rem', color: 'white', lineHeight: 1, fontWeight: 900 }}>{result}</h2>
              <div style={{ height: '4px', width: '80px', background: 'rgba(255,255,255,0.4)', margin: '2.5rem auto' }}></div>
              <p style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>Target Met. Academic Synchronization Complete.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const StaticPage = ({ title, content }) => (
  <div className="section fade-in">
    <div className="container" style={{ maxWidth: '900px' }}>
      <h1 className="mb-12" style={{ fontSize: '4rem', fontWeight: 900 }}>{title}</h1>
      <div className="card" style={{ padding: '4rem', fontSize: '1.25rem', lineHeight: '1.8', color: 'var(--text-muted)' }}>
        {content.split('\n').map((line, i) => <p key={i} className="mb-6">{line}</p>)}
      </div>
    </div>
  </div>
);

const App = () => {
  return (
    <Router>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 400px)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/study-materials" element={<StudyMaterials />} />
          <Route path="/gpa-calculator" element={<GPACalculator />} />
          <Route path="/UGM" element={<Agriculture />} />
          <Route path="/UGM/1S" element={<SemesterView s="1st" />} />
          <Route path="/UGM/2S" element={<SemesterView s="2nd" />} />
          <Route path="/UGM/course/:id" element={<CourseDetails name="Fundamentals of Agri Extension" id="AEX-101" />} />
          <Route path="/viewer/:courseId/:docType" element={<DocumentViewer />} />
          
          <Route path="/about-us" element={<StaticPage title="About The Nexus" content="Agri Junction is a state-of-the-art educational repository for agricultural sciences. Our mission is to provide precision resources, modular study plans, and historical archives to a global collective of learners.\nIntegrated at the intersection of technology and agriculture, we deploy verified ICAR modules and automated performance metrics to ensure academic excellence across all semester levels." />} />
          <Route path="/disclaimer" element={<StaticPage title="Legal Disclaimer" content="Information deployed via Agri Junction is provided with no warranties regarding precision or absolute accuracy for legislative purposes.\nResources are served for non-commercial pedagogical advancement, adhering to Section 107 of the Intellectual Property & Fair Use Guidelines." />} />
          <Route path="/privacy-policy" element={<StaticPage title="Privacy Protocol" content="We deploy standard cryptographic anonymization for all network traffic. No user-specific heuristics are stored without explicit authorization.\nSession cookies are utilized exclusively for performance optimization and UI persistence." />} />
          <Route path="/terms-and-conditions" element={<StaticPage title="Terms of Usage" content="Accessing the Agri Junction repository implies agreement with modular educational usage only.\nRedistribution for commercial extraction or unauthorized mirroring is strictly regulated under the Collective Learning Protocol." />} />
          
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
