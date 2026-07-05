import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, UploadCloud, CheckCircle, AlertTriangle, TrendingUp, 
  Award, Sparkles, BookOpen, Cpu, Moon, Sun, ArrowRight, 
  RefreshCw, Check, ChevronDown, ChevronUp, Info, Plus, Trash2, Github
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  Radar, BarChart, Bar, Cell, PieChart, Pie
} from 'recharts';

// Default Sample Data
const DEFAULT_RESUME = `John Doe
Senior Software Engineer
john.doe@example.com | (555) 019-2834 | San Francisco, CA

PROFESSIONAL SUMMARY
Dynamic and results-driven Software Engineer with 6+ years of experience building modern web applications. Specialized in front-end architectures, team mentorship, and building responsive, high-performance interfaces.

SKILLS
Programming Languages: JavaScript (ES6+), HTML5, CSS3, SQL
Frameworks & Libraries: React, Node.js, Express, Redux, jQuery
Tools & Technologies: Git, Webpack, Agile, Scrum, RESTful APIs

EXPERIENCE
Senior Developer | Tech Corp | 2022 - Present
- Designed and built responsive web applications using React and Redux, improving user engagement by 25%.
- Mentored a team of 4 junior developers and established coding standards and code review practices.
- Managed integration with RESTful backend APIs, reducing page loading latency by 15%.
- Led Agile scrum ceremonies and sprint planning sessions as Scrum Master.

Software Engineer | Dev Studio | 2020 - 2022
- Maintained legacy front-end applications and migrated core pages to React, resulting in 40% faster rendering.
- Collaborated with UX designer to implement accessible UI components according to WCAG guidelines.
- Created unit tests with Jest, achieving 80% code coverage.`;

const DEFAULT_JOB_DESC = `We are looking for a Senior Front-End Engineer with experience in Framer Motion, TypeScript, Next.js, and cloud deployments (AWS or Firebase). Candidates should have strong leadership skills, experience with RESTful APIs, and a proven track record of optimizing page speed and Largest Contentful Paint (LCP).

Key Requirements:
- Deep knowledge of React and modern front-end frameworks (Next.js is a plus).
- Strong proficiency in TypeScript and JavaScript.
- Direct experience with animation tools like Framer Motion.
- Understanding of web performance metrics, specifically LCP and SEO optimization.
- Familiarity with cloud platforms (AWS, Firebase) and deployment pipelines (CI/CD).
- Excellent collaboration and Agile software development experience.`;

// Key tech vocabulary database for matching
const KEYWORDS_DB = [
  'react', 'vue', 'angular', 'svelte', 'typescript', 'javascript', 'node.js', 'node',
  'python', 'java', 'c++', 'ruby', 'git', 'agile', 'scrum', 'aws', 'docker',
  'kubernetes', 'firebase', 'sql', 'nosql', 'mongodb', 'postgresql', 'graphql',
  'restful apis', 'rest api', 'apis', 'framer motion', 'next.js', 'tailwind', 'sass',
  'testing', 'jest', 'cypress', 'lcp', 'seo', 'optimization', 'performance', 'cloud',
  'ci/cd', 'webpack', 'vite', 'redux', 'page speed', 'typescript', 'accessibility'
];

export default function App() {
  const [theme, setTheme] = useState('dark');
  const [page, setPage] = useState('landing'); // landing, upload, loading, dashboard
  const [resumeText, setResumeText] = useState(DEFAULT_RESUME);
  const [jobDesc, setJobDesc] = useState(DEFAULT_JOB_DESC);
  const [resumeFileName, setResumeFileName] = useState('john_doe_resume.pdf');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('overview'); // overview, keywords, suggestions, tuning
  const [expandedSuggestion, setExpandedSuggestion] = useState(null);
  const [scoreHistory, setScoreHistory] = useState([
    { attempt: 'Initial V1', score: 54 },
    { attempt: 'Added Skills', score: 68 },
    { attempt: 'Updated Summary', score: 75 },
  ]);

  // Apply dark mode class to html element
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  // Dynamic ATS matching logic
  const analysisResult = useMemo(() => {
    const rText = resumeText.toLowerCase();
    const jText = jobDesc.toLowerCase();

    // Check formatting elements
    const sections = {
      summary: rText.includes('summary') || rText.includes('objective') || rText.includes('profile'),
      experience: rText.includes('experience') || rText.includes('history') || rText.includes('employment'),
      skills: rText.includes('skills') || rText.includes('technologies') || rText.includes('competencies'),
      education: rText.includes('education') || rText.includes('academic') || rText.includes('degrees'),
      contact: rText.includes('@') || rText.includes('phone') || rText.includes('email')
    };

    const sectionCount = Object.values(sections).filter(Boolean).length;
    
    // Find keywords in job description
    const jobKeywords = KEYWORDS_DB.filter(kw => jText.includes(kw));
    // Find matches in resume
    const matchedKeywords = jobKeywords.filter(kw => rText.includes(kw));
    // Missing keywords
    const missingKeywords = jobKeywords.filter(kw => !rText.includes(kw));
    // Recommended additions (words that are in DB, related to matches, but not in resume/job description)
    const recommendedKeywords = KEYWORDS_DB.filter(kw => 
      !jobKeywords.includes(kw) && 
      !rText.includes(kw) && 
      (matchedKeywords.includes('react') && ['next.js', 'framer motion', 'tailwind'].includes(kw) ||
       matchedKeywords.includes('node.js') && ['graphql', 'postgresql', 'docker'].includes(kw))
    ).slice(0, 5);

    // Calculate score
    // 40% sections, 50% keyword match density, 10% formatting/length
    const sectionScore = (sectionCount / 5) * 40;
    const keywordScore = jobKeywords.length > 0 ? (matchedKeywords.length / jobKeywords.length) * 50 : 35;
    
    const wordCount = rText.split(/\s+/).length;
    const lengthScore = (wordCount >= 200 && wordCount <= 700) ? 10 : 5;

    const totalScore = Math.min(Math.round(sectionScore + keywordScore + lengthScore), 100);

    // Generate suggestions dynamically
    const suggestions = [];
    if (!sections.experience) {
      suggestions.push({
        id: 'experience-section',
        title: 'Add a clear "Experience" or "Work History" section',
        description: 'Recruiters and ATS parsers scan for chronological work histories. Use a bold title like "Work Experience" or "Professional History" to ensure readability.',
        severity: 'high',
        category: 'formatting'
      });
    }
    if (!sections.skills) {
      suggestions.push({
        id: 'skills-section',
        title: 'Create a dedicated "Skills" layout',
        description: 'Summarize your technology stack in a single clean section. This makes it easier for search algorithms to categorize your technical proficiencies.',
        severity: 'high',
        category: 'formatting'
      });
    }
    if (wordCount < 200) {
      suggestions.push({
        id: 'length-short',
        title: 'Resume word count is low',
        description: `Your resume has only ${wordCount} words. Expand on your project accomplishments, specifying tools used and key deliverables to boost keyword matches.`,
        severity: 'medium',
        category: 'structure'
      });
    } else if (wordCount > 1000) {
      suggestions.push({
        id: 'length-long',
        title: 'Resume is too verbose',
        description: `Your resume exceeds 1000 words (${wordCount} words). Try to condense descriptions, focusing on bullet points that measure results, and keep it under 2 pages.`,
        severity: 'medium',
        category: 'structure'
      });
    }

    // Dynamic suggestions based on missing keywords
    missingKeywords.forEach((kw, index) => {
      if (index < 4) { // Cap suggestions to keep layout elegant
        suggestions.push({
          id: `missing-${kw}`,
          title: `Integrate the core skill "${kw.toUpperCase()}"`,
          description: `The job description emphasizes "${kw}". Incorporate details of how or where you utilized ${kw} in your previous projects or summary section.`,
          severity: index === 0 ? 'high' : 'medium',
          category: 'keywords'
        });
      }
    });

    if (missingKeywords.length === 0) {
      suggestions.push({
        id: 'perfect-keywords',
        title: 'Excellent Keyword Coverage!',
        description: 'You have matching skills for all core criteria outlined in the Job Description. Excellent job aligning your experiences.',
        severity: 'low',
        category: 'keywords'
      });
    }

    // Dynamic score rating
    let rating = 'Needs Improvement 📈';
    let ratingColor = 'text-red-500';
    if (totalScore >= 80) {
      rating = 'Excellent Resume 🚀';
      ratingColor = 'var(--success)';
    } else if (totalScore >= 60) {
      rating = 'Good Match ⭐';
      ratingColor = 'var(--warning)';
    }

    // Skill category distributions for charts
    const skillData = [
      { subject: 'Technical Skills', A: Math.round(sections.skills ? 90 : 30), fullMark: 100 },
      { subject: 'Core Keywords', A: Math.round(jobKeywords.length > 0 ? (matchedKeywords.length / jobKeywords.length) * 100 : 50), fullMark: 100 },
      { subject: 'Experience Match', A: Math.round(sections.experience ? 85 : 20), fullMark: 100 },
      { subject: 'Structure & Flow', A: Math.round((sectionCount / 5) * 100), fullMark: 100 },
      { subject: 'Readability', A: wordCount >= 200 && wordCount <= 700 ? 95 : 60, fullMark: 100 },
    ];

    const matchRatioData = [
      { name: 'Matched', value: matchedKeywords.length, color: 'var(--success)' },
      { name: 'Missing', value: missingKeywords.length, color: 'var(--error)' },
    ];

    return {
      score: totalScore,
      rating,
      ratingColor,
      matchedKeywords,
      missingKeywords,
      recommendedKeywords,
      suggestions,
      skillData,
      matchRatioData,
      stats: {
        sectionsFound: sectionCount,
        wordCount,
        matchCount: matchedKeywords.length,
        missingCount: missingKeywords.length
      }
    };
  }, [resumeText, jobDesc]);

  // Handle sample load
  const loadSample = () => {
    setResumeText(DEFAULT_RESUME);
    setJobDesc(DEFAULT_JOB_DESC);
    setResumeFileName('john_doe_resume.pdf');
    startAnalysis();
  };

  // Start analysis trigger
  const startAnalysis = () => {
    setPage('loading');
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            // Append current score to history for trend visualization
            setScoreHistory(prevHistory => {
              const last = prevHistory[prevHistory.length - 1];
              if (last && last.score === analysisResult.score) {
                return prevHistory;
              }
              const newAttempt = `Attempt ${prevHistory.length + 1}`;
              return [...prevHistory, { attempt: newAttempt, score: analysisResult.score }];
            });
            setPage('dashboard');
          }, 600);
          return 100;
        }
        return prev + 8;
      });
    }, 100);
  };

  // Drag and drop setup
  const [dragActive, setDragActive] = useState(false);
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setResumeFileName(file.name);
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target.result) {
          // If txt file, parse, otherwise simulate reading
          if (file.type === 'text/plain') {
            setResumeText(event.target.result);
          } else {
            setResumeText(DEFAULT_RESUME + `\n\n[Parsed details from ${file.name}]`);
          }
          startAnalysis();
        }
      };
      if (file.type === 'text/plain') {
        reader.readAsText(file);
      } else {
        // Just simulate the upload with default data
        setTimeout(() => {
          startAnalysis();
        }, 300);
      }
    }
  };

  return (
    <div className={`min-h-screen relative overflow-hidden flex flex-col ${theme === 'dark' ? 'dark text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Background Orbs */}
      <div className="orb-glow orb-primary" />
      <div className="orb-glow orb-secondary" />
      <div className="orb-glow orb-accent" />

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/50 dark:border-slate-800/50 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setPage('landing')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-5.5 h-5.5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-cyan-400">
              ResuMatch AI
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/50 text-slate-600 dark:text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 hover:scale-105 transition-all"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {page === 'dashboard' && (
              <button 
                onClick={() => setPage('upload')}
                className="btn-primary py-2 px-4 text-sm"
              >
                Upload New
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10 flex flex-col justify-center">
        
        {/* LANDING PAGE */}
        {page === 'landing' && (
          <div className="landing-wrapper">
            <div className="landing-grid">
              
              {/* Left Column: Content & Statistics */}
              <div className="landing-left">
                <div className="badge-promo">
                  <Award className="w-4 h-4" />
                  Voted #1 Resume Analyzer SaaS
                </div>
                
                <h1 className="hero-title">
                  Optimize Your <br className="hidden sm:inline" />
                  Resume For <span className="gradient-text">ATS Screeners</span>
                </h1>
                
                <p className="hero-subtitle">
                  Scan your resume against job postings dynamically. Uncover critical missing keywords, calculate instant alignment ratings, and get precise formatting advice to land interviews.
                </p>
                
                <div className="cta-button-group">
                  <button 
                    onClick={() => setPage('upload')}
                    className="btn-primary hero-cta-btn"
                  >
                    Get Started <ArrowRight className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={loadSample}
                    className="btn-secondary hero-cta-btn"
                  >
                    Try Sample Resume
                  </button>
                </div>

                {/* Statistics Row (Aligned Horizontally) */}
                <div className="stats-row">
                  <div className="stat-card">
                    <div className="stat-value text-indigo-500 dark:text-indigo-400">98%</div>
                    <div className="stat-label">Accuracy Rating</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value text-purple-500 dark:text-purple-400">10s</div>
                    <div className="stat-label">Scan Speed</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value text-cyan-500 dark:text-cyan-400">250K+</div>
                    <div className="stat-label">Resumes Scanned</div>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Illustration */}
              <div className="landing-right">
                <div className="w-full max-w-md aspect-square glass-panel p-8 relative flex items-center justify-center shadow-2xl border-white/20">
                  
                  {/* Floating Geometric shapes */}
                  <div className="absolute top-8 left-8 w-6 h-6 border-2 border-indigo-400 rounded-lg floating-shape" style={{ animationDelay: '0s' }} />
                  <div className="absolute bottom-10 right-10 w-8 h-8 rounded-full border-2 border-purple-400 floating-shape" style={{ animationDelay: '2s' }} />
                  <div className="absolute top-1/4 right-8 w-5 h-5 bg-cyan-400/20 rounded-md rotate-45 floating-shape" style={{ animationDelay: '4s' }} />

                  <div className="w-64 h-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg relative overflow-hidden flex flex-col p-5 space-y-4">
                    {/* Top Header Card */}
                    <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div className="space-y-1">
                        <div className="h-3.5 w-24 bg-slate-200 dark:bg-slate-800 rounded-md" />
                        <div className="h-2 w-16 bg-slate-100 dark:bg-slate-800/60 rounded-md" />
                      </div>
                    </div>

                    {/* Body Mock Lines */}
                    <div className="space-y-3.5 flex-1 pt-1">
                      <div className="h-2.5 w-full bg-slate-200 dark:bg-slate-800 rounded-md" />
                      <div className="h-2.5 w-5/6 bg-slate-200 dark:bg-slate-800 rounded-md" />
                      <div className="h-2.5 w-4/6 bg-slate-200 dark:bg-slate-800 rounded-md" />
                      
                      <div className="pt-3 space-y-2">
                        <div className="h-2 w-12 bg-indigo-200 dark:bg-indigo-950/60 rounded-md" />
                        <div className="flex gap-2">
                          <div className="h-5 w-14 bg-emerald-500/25 border border-emerald-500/30 rounded-full" />
                          <div className="h-5 w-16 bg-rose-500/25 border border-rose-500/30 rounded-full" />
                          <div className="h-5 w-12 bg-amber-500/25 border border-amber-500/30 rounded-full" />
                        </div>
                      </div>

                      <div className="pt-3 space-y-2">
                        <div className="h-2 w-16 bg-slate-200 dark:bg-slate-800 rounded-md" />
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800/60 rounded-md" />
                        <div className="h-2 w-full bg-slate-100 dark:bg-slate-800/60 rounded-md" />
                      </div>
                    </div>

                    {/* Scanning Neon Grid Overlay */}
                    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between">
                      <motion.div 
                        initial={{ y: 0 }}
                        animate={{ y: 320 }}
                        transition={{ 
                          repeat: Infinity, 
                          repeatType: "reverse", 
                          duration: 3, 
                          ease: "easeInOut" 
                        }}
                        className="w-full h-1 bg-gradient-to-r from-indigo-500 via-cyan-400 to-purple-500 shadow-[0_0_15px_rgba(99,102,241,1)] relative z-10"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent h-1/2 opacity-30 mix-blend-screen" />
                    </div>
                  </div>

                  {/* Score Tag Card */}
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, type: 'spring' }}
                    className="absolute -bottom-4 -left-4 glass-panel p-4 flex items-center gap-3 shadow-xl border-white/20"
                  >
                    <div className="w-12 h-12 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 flex items-center justify-center font-bold text-sm bg-white/80 dark:bg-slate-900/80">
                      84%
                    </div>
                    <div>
                      <div className="text-xs text-slate-400">Match Rating</div>
                      <div className="text-sm font-semibold text-emerald-500">Good Match ⭐</div>
                    </div>
                  </motion.div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* UPLOAD RESUME PAGE */}
        {page === 'upload' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto w-full glass-panel p-8 shadow-2xl relative border-white/10"
          >
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Analyze Your Resume</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Upload a PDF, TXT or paste your resume content below to scan alignment scores.</p>
            </div>

            {/* Drag & Drop Area */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center transition-all cursor-pointer ${
                dragActive 
                  ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_15px_var(--primary-glow)]' 
                  : 'border-slate-300 dark:border-slate-800 bg-slate-500/5 hover:border-indigo-400 hover:bg-indigo-500/5'
              }`}
              onClick={() => document.getElementById('file-upload-input').click()}
            >
              <input
                id="file-upload-input"
                type="file"
                className="hidden"
                accept=".txt,.pdf"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setResumeFileName(e.target.files[0].name);
                    const file = e.target.files[0];
                    if (file.type === 'text/plain') {
                      const reader = new FileReader();
                      reader.onload = (el) => setResumeText(el.target.result);
                      reader.readAsText(file);
                    } else {
                      setResumeText(DEFAULT_RESUME + `\n\n[Simulated parsed details from ${file.name}]`);
                    }
                    startAnalysis();
                  }
                }}
              />
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 dark:text-indigo-400 mb-4"
              >
                <UploadCloud className="w-9 h-9" />
              </motion.div>
              <p className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Drag & drop your resume file here
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500 mb-3">
                Supports PDF and TXT formats (Max 5MB)
              </p>
              <span className="text-xs font-semibold px-3 py-1 bg-slate-200/60 dark:bg-slate-800/60 rounded-lg text-slate-600 dark:text-slate-400">
                Browse Files
              </span>
            </div>

            {/* Separator */}
            <div className="flex items-center gap-4 my-6">
              <div className="h-[1px] bg-slate-200 dark:bg-slate-800 flex-1" />
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">or paste content</span>
              <div className="h-[1px] bg-slate-200 dark:bg-slate-800 flex-1" />
            </div>

            {/* Paste inputs */}
            <div className="space-y-4 text-left">
              <div>
                <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Resume Text Content</label>
                <textarea
                  className="text-input min-h-[140px] resize-y font-mono text-xs"
                  placeholder="Paste details of your background, work history, skills here..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1.5">Target Job Description</label>
                <textarea
                  className="text-input min-h-[100px] resize-y text-sm"
                  placeholder="Paste the job posting description you are targeting..."
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  onClick={startAnalysis}
                  disabled={!resumeText.trim()}
                  className="btn-primary flex-1 py-3.5 justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Analyze Optimization <Sparkles className="w-5 h-5" />
                </button>
                <button
                  onClick={loadSample}
                  className="btn-secondary py-3.5 justify-center"
                >
                  Load Sample
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* LOADING / SCANNING ANIMATION */}
        {page === 'loading' && (
          <div className="max-w-md mx-auto w-full glass-panel p-8 text-center space-y-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Extracting Resume Tokens</h3>
            <p className="text-slate-400 text-sm">Simulating semantic analysis model nodes...</p>

            <div className="relative py-8 flex justify-center">
              <div className="w-32 h-32 rounded-full border-4 border-slate-800 flex items-center justify-center relative overflow-hidden">
                {/* Circular indicator */}
                <svg className="w-full h-full absolute transform -rotate-90">
                  <circle
                    className="text-slate-800"
                    strokeWidth="4"
                    stroke="currentColor"
                    fill="transparent"
                    r="58"
                    cx="64"
                    cy="64"
                  />
                  <motion.circle
                    className="text-indigo-500"
                    strokeWidth="4"
                    strokeDasharray={2 * Math.PI * 58}
                    strokeDashoffset={2 * Math.PI * 58 * (1 - uploadProgress / 100)}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="58"
                    cx="64"
                    cy="64"
                  />
                </svg>
                <div className="text-2xl font-bold text-slate-100">{uploadProgress}%</div>
              </div>
            </div>

            {/* Parsing status lines */}
            <div className="h-10 text-xs font-mono text-slate-500 space-y-1">
              {uploadProgress < 30 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>[INFO] Opening resume file streams...</motion.div>}
              {uploadProgress >= 30 && uploadProgress < 60 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>[PROCESS] Matching experience timeline maps...</motion.div>}
              {uploadProgress >= 60 && uploadProgress < 90 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>[PROCESS] Scanning job description vocabulary nodes...</motion.div>}
              {uploadProgress >= 90 && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>[SUCCESS] Recalculating ATS Score Matrices...</motion.div>}
            </div>

            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-400" 
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* DASHBOARD REPORT */}
        {page === 'dashboard' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8 text-left"
          >
            {/* Top Info Banner (Resume Info Card) */}
            <div className="glass-card resume-info-card">
              <div className="resume-info-main">
                <div className="resume-info-icon-wrapper">
                  <FileText className="w-6 h-6 text-indigo-500" />
                </div>
                <div className="resume-info-details">
                  <div className="resume-info-title-row">
                    <h2 className="resume-info-filename">{resumeFileName}</h2>
                    <span className="status-badge success">
                      <span className="status-dot"></span> Parsed Successfully
                    </span>
                  </div>
                  <div className="resume-info-meta">
                    <span className="meta-item">
                      <strong>Target Position:</strong> {jobDesc.split('\n')[0].replace('We are looking for a ', '').replace('Candidates should have ', '').replace('We are looking for ', '') || 'Front-End Engineer'}
                    </span>
                    <span className="meta-separator">•</span>
                    <span className="meta-item">
                      <strong>Word Count:</strong> {analysisResult.stats.wordCount} words
                    </span>
                  </div>
                </div>
              </div>

              <div className="resume-info-actions">
                <button
                  onClick={() => setPage('upload')}
                  className="btn-secondary resume-action-btn"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Re-analyze File
                </button>
              </div>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* ATS SCORE CARD */}
              <div className="glass-card metric-card metric-primary">
                <div className="space-y-2">
                  <span className="metric-label">ATS Match Score</span>
                  <div className="metric-value">{analysisResult.score}%</div>
                  <div className="metric-badge" style={{ color: analysisResult.ratingColor, background: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                    {analysisResult.rating}
                  </div>
                </div>
                <div className="circular-progress-container w-16 h-16">
                  <svg className="circular-progress-svg w-16 h-16">
                    <circle className="circular-progress-bg stroke-slate-200 dark:stroke-slate-800" strokeWidth="5" r="26" cx="32" cy="32" />
                    <motion.circle 
                      className="circular-progress-bar"
                      stroke={analysisResult.score >= 80 ? 'var(--success)' : analysisResult.score >= 60 ? 'var(--warning)' : 'var(--error)'}
                      strokeWidth="5" 
                      strokeDasharray={2 * Math.PI * 26}
                      initial={{ strokeDashoffset: 2 * Math.PI * 26 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 26 * (1 - analysisResult.score / 100) }}
                      transition={{ duration: 1.5, ease: 'easeOut' }}
                      r="26" cx="32" cy="32" 
                    />
                  </svg>
                  <div className="absolute text-xs font-bold">{analysisResult.score}%</div>
                </div>
              </div>

              {/* STRENGTH CARD */}
              <div className="glass-card metric-card metric-secondary">
                <div className="space-y-2 w-full">
                  <div className="flex items-center justify-between">
                    <span className="metric-label">Resume Strength</span>
                    <Award className="w-5 h-5 text-purple-500" />
                  </div>
                  <div className="metric-value">
                    {analysisResult.score >= 80 ? 'High' : analysisResult.score >= 60 ? 'Medium' : 'Needs Work'}
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-2">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" 
                      initial={{ width: 0 }}
                      animate={{ width: `${analysisResult.score}%` }}
                      transition={{ duration: 1.2 }}
                    />
                  </div>
                </div>
              </div>

              {/* KEYWORDS MATCHED */}
              <div className="glass-card metric-card metric-accent">
                <div className="space-y-2 w-full">
                  <div className="flex items-center justify-between">
                    <span className="metric-label">Keywords Matched</span>
                    <TrendingUp className="w-5 h-5 text-cyan-500" />
                  </div>
                  <div className="metric-value">
                    {analysisResult.stats.matchCount} <span className="text-sm font-normal text-slate-400">/ {analysisResult.stats.matchCount + analysisResult.stats.missingCount}</span>
                  </div>
                  <p className="metric-desc">
                    {analysisResult.stats.missingCount} missing keywords detected
                  </p>
                </div>
              </div>

              {/* ACTION ITEMS */}
              <div className="glass-card metric-card metric-warning">
                <div className="space-y-2 w-full">
                  <div className="flex items-center justify-between">
                    <span className="metric-label">AI Suggestions</span>
                    <Sparkles className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="metric-value">
                    {analysisResult.suggestions.filter(s => s.severity === 'high').length} <span className="text-sm font-normal text-slate-400">Critical</span>
                  </div>
                  <p className="metric-desc">
                    {analysisResult.suggestions.length} total recommended tweaks
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Tabs (Segmented Control) */}
            <div className="segmented-tabs-container">
              {[
                { id: 'overview', label: 'Match Overview', icon: Cpu },
                { id: 'keywords', label: 'Keyword Analysis', icon: FileText },
                { id: 'suggestions', label: 'AI Optimization', icon: Sparkles },
                { id: 'tuning', label: 'Sandbox Job Tuning', icon: RefreshCw },
              ].map(tab => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`segmented-tab ${active ? 'active' : ''}`}
                  >
                    <Icon className="w-4 h-4 tab-icon" />
                    <span>{tab.label}</span>
                    {tab.id === 'suggestions' && (
                      <span className="tab-badge">
                        {analysisResult.suggestions.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* TAB CONTENTS */}
            <div className="min-h-[400px]" style={{ marginTop: '1.75rem' }}>
              
              {/* OVERVIEW TAB */}
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column: Skill Metrics */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="glass-panel p-6 space-y-4">
                      <h3 className="text-lg font-bold">ATS Alignment Metrics</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-slate-500/5 border border-slate-200/50 dark:border-slate-800/50 space-y-1">
                          <span className="text-xs text-slate-400 font-semibold">Parser Readability</span>
                          <div className="text-xl font-bold">Good</div>
                          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                            <div className="h-full bg-emerald-500 w-[90%]" />
                          </div>
                        </div>

                        <div className="p-4 rounded-xl bg-slate-500/5 border border-slate-200/50 dark:border-slate-800/50 space-y-1">
                          <span className="text-xs text-slate-400 font-semibold">Contact Details found</span>
                          <div className="text-xl font-bold">{analysisResult.stats.sectionsFound >= 4 ? 'Complete' : 'Incomplete'}</div>
                          <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                            <div className="h-full bg-indigo-500" style={{ width: `${(analysisResult.stats.sectionsFound / 5) * 100}%` }} />
                          </div>
                        </div>
                      </div>

                      {/* Radar Chart */}
                      <div className="h-72 w-full pt-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={analysisResult.skillData}>
                            <PolarGrid stroke="var(--border-color)" />
                            <PolarAngleAxis dataKey="subject" stroke="var(--text-secondary)" tick={{ fontSize: 11 }} />
                            <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="var(--text-muted)" tick={{ fontSize: 9 }} />
                            <Radar 
                              name="Resume Profile" 
                              dataKey="A" 
                              stroke="var(--primary)" 
                              fill="var(--primary)" 
                              fillOpacity={0.25} 
                            />
                            <Tooltip />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Score Trends and Modification Timeline */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="glass-panel p-6 space-y-5">
                      <div>
                        <h3 className="text-lg font-bold">Improvement History</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Track how your score changes with each revision attempt.</p>
                      </div>

                      <div className="h-48 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={scoreHistory}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                            <XAxis dataKey="attempt" stroke="var(--text-secondary)" tick={{ fontSize: 9 }} />
                            <YAxis domain={[0, 100]} stroke="var(--text-secondary)" tick={{ fontSize: 9 }} />
                            <Tooltip />
                            <Line 
                              type="monotone" 
                              dataKey="score" 
                              stroke="var(--secondary)" 
                              strokeWidth={2.5} 
                              activeDot={{ r: 5 }} 
                              dot={{ strokeWidth: 2, r: 3 }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Modifications Timeline */}
                      <div className="timeline-container">
                        <span className="timeline-title">Audit Timeline</span>
                        <div className="timeline-items">
                          {scoreHistory.map((item, index) => {
                            const isLatest = index === scoreHistory.length - 1;
                            return (
                              <div key={index} className={`timeline-item ${isLatest ? 'latest' : ''}`}>
                                <div className="timeline-marker-wrapper">
                                  <div className="timeline-marker">
                                    {isLatest ? <Sparkles className="w-3.5 h-3.5 text-white" /> : <Check className="w-3 h-3 text-slate-400 dark:text-slate-500" />}
                                  </div>
                                  {index < scoreHistory.length - 1 && <div className="timeline-connector"></div>}
                                </div>
                                <div className="timeline-content">
                                  <div className="timeline-header">
                                    <span className="timeline-attempt">{item.attempt}</span>
                                    <span className={`timeline-score-badge ${item.score >= 80 ? 'high' : item.score >= 60 ? 'medium' : 'low'}`}>
                                      {item.score}%
                                    </span>
                                  </div>
                                  <p className="timeline-desc">
                                    {index === 0 && "Initial uploaded file parsing diagnostics."}
                                    {index === 1 && "Extracted skill matrices and linked related frameworks."}
                                    {index === 2 && "Optimized candidate keywords aligning with requirements."}
                                    {index >= 3 && "Current workspace alignment matching index."}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="p-4 rounded-xl border border-indigo-500/25 bg-indigo-500/5 flex items-start gap-3">
                        <Info className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-indigo-400">Current Position Status</span>
                          <p className="text-xs text-slate-400 leading-relaxed">
                            {analysisResult.score >= 80 
                              ? 'Your resume shows robust formatting and keyword layout alignment. You are highly competitive for this role.' 
                              : 'To cross the ideal 80% threshold, integrate the missing keywords highlighted in the Keywords tab.'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* KEYWORDS TAB */}
              {activeTab === 'keywords' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column: Pills Grid */}
                  <div className="lg:col-span-8 space-y-6">
                    <div className="glass-panel p-6 space-y-6">
                      <div className="space-y-1">
                        <h3 className="text-lg font-bold">Semantic Vocabulary Audit</h3>
                        <p className="text-xs text-slate-400">We scanned the target job specifications and mapped them against your text.</p>
                      </div>

                      {/* Found Keywords */}
                      <div className="space-y-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          Found Keywords ({analysisResult.matchedKeywords.length})
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.matchedKeywords.map((kw, i) => (
                            <motion.span 
                              key={kw}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.05 }}
                              className="chip chip-success text-xs"
                            >
                              <Check className="w-3.5 h-3.5" />
                              {kw.toUpperCase()}
                            </motion.span>
                          ))}
                          {analysisResult.matchedKeywords.length === 0 && (
                            <span className="text-xs text-slate-400 italic">No matching keywords found in text yet.</span>
                          )}
                        </div>
                      </div>

                      {/* Missing Keywords */}
                      <div className="space-y-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-rose-500" />
                          Missing Keywords ({analysisResult.missingKeywords.length})
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.missingKeywords.map((kw, i) => (
                            <motion.span 
                              key={kw}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.05 }}
                              className="chip chip-error text-xs"
                            >
                              <AlertTriangle className="w-3.5 h-3.5" />
                              {kw.toUpperCase()}
                            </motion.span>
                          ))}
                          {analysisResult.missingKeywords.length === 0 && (
                            <span className="text-xs text-slate-400 italic">Perfect fit! No missing keywords.</span>
                          )}
                        </div>
                      </div>

                      {/* Recommended Additions */}
                      <div className="space-y-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-amber-500" />
                          Recommended Industry Concepts ({analysisResult.recommendedKeywords.length})
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {analysisResult.recommendedKeywords.map((kw, i) => (
                            <motion.span 
                              key={kw}
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: i * 0.05 }}
                              className="chip chip-warning text-xs"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              {kw.toUpperCase()}
                            </motion.span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Keyword density Chart */}
                  <div className="lg:col-span-4 space-y-6">
                    <div className="glass-panel p-6 space-y-4">
                      <h3 className="text-lg font-bold">Keyword Ratio</h3>
                      <p className="text-xs text-slate-400">Breakdown of matched vs. missing target terms.</p>

                      <div className="h-56 w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={[
                            { name: 'Matched', count: analysisResult.stats.matchCount, fill: 'var(--success)' },
                            { name: 'Missing', count: analysisResult.stats.missingCount, fill: 'var(--error)' }
                          ]}>
                            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                            <XAxis dataKey="name" stroke="var(--text-secondary)" tick={{ fontSize: 11 }} />
                            <YAxis stroke="var(--text-secondary)" tick={{ fontSize: 10 }} />
                            <Tooltip />
                            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                              <Cell fill="var(--success)" />
                              <Cell fill="var(--error)" />
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* AI OPTIMIZATION TAB */}
              {activeTab === 'suggestions' && (
                <div className="max-w-4xl mx-auto space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="text-lg font-bold">Tailoring Suggestions</h3>
                      <p className="text-xs text-slate-400">Implement these modifications in your resume file to optimize readability index.</p>
                    </div>
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500">
                      {analysisResult.suggestions.length} items to address
                    </span>
                  </div>

                  {/* Suggestion Accordion Cards */}
                  <div className="space-y-3">
                    {analysisResult.suggestions.map((item, index) => {
                      const isExpanded = expandedSuggestion === item.id;
                      return (
                        <div 
                          key={item.id} 
                          className="glass-card overflow-hidden border-slate-200/50 dark:border-slate-800/50 rounded-xl"
                        >
                          <div 
                            onClick={() => setExpandedSuggestion(isExpanded ? null : item.id)}
                            className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-500/5"
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                item.severity === 'high' 
                                  ? 'bg-rose-500/10 text-rose-500' 
                                  : item.severity === 'medium' 
                                    ? 'bg-amber-500/10 text-amber-500' 
                                    : 'bg-emerald-500/10 text-emerald-500'
                              }`}>
                                <AlertTriangle className="w-5 h-5" />
                              </div>
                              <span className="font-semibold text-sm sm:text-base">{item.title}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                                item.severity === 'high' 
                                  ? 'bg-rose-500/20 text-rose-500' 
                                  : item.severity === 'medium' 
                                    ? 'bg-amber-500/20 text-amber-500' 
                                    : 'bg-emerald-500/20 text-emerald-500'
                              }`}>
                                {item.severity}
                              </span>
                              {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                            </div>
                          </div>

                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div 
                                initial={{ height: 0 }}
                                animate={{ height: 'auto' }}
                                exit={{ height: 0 }}
                                className="border-t border-slate-200/50 dark:border-slate-800/50 bg-slate-500/5"
                              >
                                <div className="p-5 text-sm text-slate-600 dark:text-slate-400 leading-relaxed space-y-3">
                                  <p>{item.description}</p>
                                  <div className="p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/10 text-xs text-indigo-400/90 font-medium">
                                    💡 <strong className="text-indigo-400">ATS TIP:</strong> Keep headers standard. Always use simple, text-based headers without images, logos, or charts to prevent parser parsing failures.
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* SANDBOX JOB TUNING TAB */}
              {activeTab === 'tuning' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Left Column: Inputs */}
                  <div className="lg:col-span-8 space-y-6">
                    <div className="glass-panel p-6 space-y-6">
                      <div className="space-y-1">
                        <h3 className="text-lg font-bold">Interactive Sandbox Analyzer</h3>
                        <p className="text-xs text-slate-400">Edit your resume content or job requirements below to see your ATS Score recalculate in real-time.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Resume Document Text</label>
                          <textarea
                            className="text-input min-h-[300px] font-mono text-xs"
                            value={resumeText}
                            onChange={(e) => setResumeText(e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Target Position Details</label>
                          <textarea
                            className="text-input min-h-[300px] text-xs leading-relaxed"
                            value={jobDesc}
                            onChange={(e) => setJobDesc(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Live Recalculated Score Card */}
                  <div className="lg:col-span-4 space-y-6">
                    <div className="glass-panel p-6 text-center space-y-6 flex flex-col justify-between h-full">
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold">Live Alignment Score</h3>
                        <p className="text-xs text-slate-400">Updated automatically with every keystroke.</p>
                      </div>

                      <div className="flex justify-center py-4">
                        <div className="w-36 h-36 rounded-full border-8 border-slate-500/10 flex flex-col items-center justify-center relative bg-indigo-500/5 shadow-[0_0_20px_var(--primary-glow)]">
                          <div className="text-4xl font-extrabold text-indigo-400">{analysisResult.score}%</div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 mt-1">ATS Score</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-semibold" style={{ color: analysisResult.ratingColor }}>
                          {analysisResult.rating}
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed px-4">
                          Your resume matches {analysisResult.stats.matchCount} keyword tokens from the target job posting.
                        </p>
                      </div>

                      <button
                        onClick={loadSample}
                        className="btn-secondary w-full py-2.5 text-xs justify-center"
                      >
                        Reset to Sample Data
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </motion.div>
        )}

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200/50 dark:border-slate-800/50 bg-white/20 dark:bg-slate-900/20 backdrop-blur-md mt-16 py-6 text-center text-xs text-slate-500 dark:text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4.5 h-4.5 text-indigo-500" />
            <span>ResuMatch AI - Premium Resume Optimizer</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-700 dark:hover:text-slate-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-700 dark:hover:text-slate-300 flex items-center gap-1 transition-colors">
              <Github className="w-4 h-4" /> GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
