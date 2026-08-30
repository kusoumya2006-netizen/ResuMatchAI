import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight, Check, ChevronRight, FileText, Moon, RefreshCw,
  Sparkles, Sun, UploadCloud, Target, ScanLine, Zap
} from 'lucide-react';

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

const KEYWORDS_DB = [
  'react','vue','angular','svelte','typescript','javascript','node.js','node','python','java','c++','ruby',
  'git','agile','scrum','aws','docker','kubernetes','firebase','sql','nosql','mongodb','postgresql','graphql',
  'restful apis','rest api','apis','framer motion','next.js','tailwind','sass','testing','jest','cypress',
  'lcp','seo','optimization','performance','cloud','ci/cd','webpack','vite','redux','page speed',
  'accessibility'
];

function analyse(resumeText, jobDesc) {
  const rText = resumeText.toLowerCase();
  const jText = jobDesc.toLowerCase();
  const sections = {
    summary: rText.includes('summary') || rText.includes('objective') || rText.includes('profile'),
    experience: rText.includes('experience') || rText.includes('history') || rText.includes('employment'),
    skills: rText.includes('skills') || rText.includes('technologies') || rText.includes('competencies'),
    education: rText.includes('education') || rText.includes('academic') || rText.includes('degrees'),
    contact: rText.includes('@') || rText.includes('phone') || rText.includes('email')
  };
  const sectionCount = Object.values(sections).filter(Boolean).length;
  const jobKeywords = KEYWORDS_DB.filter(kw => jText.includes(kw));
  const matchedKeywords = jobKeywords.filter(kw => rText.includes(kw));
  const missingKeywords = jobKeywords.filter(kw => !rText.includes(kw));
  const recommendedKeywords = KEYWORDS_DB.filter(kw =>
    !jobKeywords.includes(kw) && !rText.includes(kw) &&
    ((matchedKeywords.includes('react') && ['next.js','framer motion','tailwind'].includes(kw)) ||
     (matchedKeywords.includes('node.js') && ['graphql','postgresql','docker'].includes(kw)))
  ).slice(0, 5);
  const sectionScore = (sectionCount / 5) * 40;
  const keywordScore = jobKeywords.length ? (matchedKeywords.length / jobKeywords.length) * 50 : 35;
  const wordCount = rText.trim() ? rText.trim().split(/\s+/).length : 0;
  const lengthScore = (wordCount >= 200 && wordCount <= 700) ? 10 : 5;
  const totalScore = Math.min(Math.round(sectionScore + keywordScore + lengthScore), 100);

  const suggestions = [];
  if (!sections.experience) suggestions.push({ id:'experience-section', title:'Add a clear Experience section', description:'ATS parsers scan for chronological work histories. Use a clear heading such as Work Experience.', severity:'high', category:'formatting' });
  if (!sections.skills) suggestions.push({ id:'skills-section', title:'Create a dedicated Skills section', description:'A focused skills section helps systems categorize your technical proficiencies.', severity:'high', category:'formatting' });
  if (wordCount < 200) suggestions.push({ id:'length-short', title:'Resume is too light on evidence', description:`Your resume has only ${wordCount} words. Add concrete outcomes, scope and measurable wins.`, severity:'medium', category:'structure' });
  if (wordCount > 1000) suggestions.push({ id:'length-long', title:'Resume is too verbose', description:`Your resume has ${wordCount} words. Condense descriptions and prioritize outcomes.`, severity:'medium', category:'structure' });
  missingKeywords.forEach((kw, index) => {
    if (index < 4) suggestions.push({
      id:`missing-${kw}`, title:`Strengthen the ${kw.toUpperCase()} signal`,
      description:`The target role emphasizes ${kw}. Add it only where it is truthful and supported by your experience.`,
      severity:index===0?'high':'medium', category:'keywords'
    });
  });
  if (!suggestions.length) suggestions.push({ id:'perfect', title:'Core signals are covered', description:'Your current version covers the main structural and keyword requirements.', severity:'low', category:'keywords' });

  const rating = totalScore >= 80 ? 'Strong match' : totalScore >= 60 ? 'Promising match' : 'Needs work';
  return {
    score: totalScore, rating, matchedKeywords, missingKeywords, recommendedKeywords, suggestions,
    stats: { sectionsFound: sectionCount, wordCount, matchCount: matchedKeywords.length, missingCount: missingKeywords.length }
  };
}

const demoLines = [
  { id:'summary', label:'SUMMARY', text:'Software engineer building responsive web products.' },
  { id:'impact', label:'EXPERIENCE', text:'Improved API response time by 40% through query optimization.' },
  { id:'weak', label:'EXPERIENCE', text:'Worked on web applications and helped the team with development.' },
  { id:'skills', label:'SKILLS', text:'React · JavaScript · Node.js · SQL · AWS · Git' }
];

export default function App(){
  const [theme,setTheme] = useState('light');
  const [page,setPage] = useState('landing');
  const [resumeText,setResumeText] = useState(DEFAULT_RESUME);
  const [jobDesc,setJobDesc] = useState(DEFAULT_JOB_DESC);
  const [resumeFileName,setResumeFileName] = useState('john_doe_resume.pdf');
  const [uploadProgress,setUploadProgress] = useState(0);
  const [selectedSignal,setSelectedSignal] = useState(null);
  const [rewriteDone,setRewriteDone] = useState(false);
  const [selectedJob,setSelectedJob] = useState(0);

  const result = useMemo(()=>analyse(resumeText,jobDesc),[resumeText,jobDesc]);

  useEffect(()=>{
    document.documentElement.classList.toggle('dark',theme==='dark');
  },[theme]);

  const startAnalysis = () => {
    setPage('loading'); setUploadProgress(0); setRewriteDone(false);
    let current=0;
    const timer=setInterval(()=>{
      current=Math.min(current+10,100);
      setUploadProgress(current);
      if(current>=100){
        clearInterval(timer);
        setTimeout(()=>setPage('dashboard'),280);
      }
    },90);
  };

  const handleFile = file => {
    if(!file) return;
    setResumeFileName(file.name);
    if(file.type==='text/plain'){
      const reader=new FileReader();
      reader.onload=e=>{setResumeText(String(e.target?.result||''));startAnalysis();};
      reader.readAsText(file);
    }else{
      setResumeText(DEFAULT_RESUME+`\n\n[Parsed details from ${file.name}]`);
      startAnalysis();
    }
  };

  const jobs=[
    {title:'Frontend Engineer',company:'GROWW',score:94,reason:'React, performance and product-building evidence align strongly. Your measurable impact is the strongest signal.',bars:[96,88,92]},
    {title:'Software Engineer',company:'MICROSOFT',score:89,reason:'Strong engineering foundation. Add more evidence around scale and system design.',bars:[91,86,84]},
    {title:'Full Stack Developer',company:'AMAZON',score:86,reason:'Close stack fit. Backend ownership and deployment evidence are the main gaps.',bars:[88,90,82]}
  ];

  return (
    <div className={`app ${theme==='dark'?'app-dark':''}`}>
      <header className="topbar">
        <button className="brand" onClick={()=>setPage('landing')}>RESUMATCH <span>AI</span></button>
        <nav>
          <button onClick={()=>setPage('landing')}>PRODUCT</button>
          <button onClick={()=>page==='dashboard' && document.getElementById('matches')?.scrollIntoView({behavior:'smooth'})}>MATCHES</button>
          <button onClick={()=>page==='dashboard' && document.getElementById('insights')?.scrollIntoView({behavior:'smooth'})}>INSIGHTS</button>
        </nav>
        <div className="top-actions">
          <button className="icon-btn" onClick={()=>setTheme(theme==='dark'?'light':'dark')} aria-label="Toggle theme">{theme==='dark'?<Sun size={16}/>:<Moon size={16}/>}</button>
          <button className="tiny-cta" onClick={()=>setPage('upload')}>START ↗</button>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {page==='landing' && (
          <motion.main className="landing-screen" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            <section className="hero-v2">
              <div className="hero-copy-v2">
                <div className="eyebrow">RESUMATCH / CAREER INTELLIGENCE</div>
                <h1>THE RESUME<br/><em>IS THE SIGNAL.</em></h1>
                <p>See what the system sees. Strengthen what matters. Match your real experience to the jobs worth applying for.</p>
                <div className="hero-buttons">
                  <button className="black-btn" onClick={()=>setPage('upload')}>ANALYZE MY RESUME <ArrowRight size={17}/></button>
                  <button className="text-btn" onClick={()=>document.getElementById('how')?.scrollIntoView({behavior:'smooth'})}>SEE HOW IT THINKS <ChevronRight size={15}/></button>
                </div>
                <div className="hero-proof"><span>01</span><b>DOCUMENT → SIGNAL</b><small>Built around the resume, not around dashboards.</small></div>
              </div>
              <div className="hero-machine">
                <div className="machine-head"><span>LIVE RESUME / INTERACTIVE</span><b>● SYSTEM READY</b></div>
                <div className="machine-grid" />
                <div className="demo-resume">
                  <div className="doc-name">SOUMYA K</div>
                  <div className="doc-role">SOFTWARE ENGINEER · CSE</div>
                  {demoLines.map(line=>(
                    <button key={line.id} className={`doc-line ${selectedSignal===line.id?'selected':''}`} onClick={()=>setSelectedSignal(line.id)}>
                      <span>{line.label}</span><p>{line.text}</p><i>↗</i>
                    </button>
                  ))}
                </div>
                <motion.div className={`inspector-mini ${selectedSignal?'show':''}`} animate={{opacity:selectedSignal?1:.0,y:selectedSignal?0:12}}>
                  <div className="mini-kicker">AI INSPECTOR</div>
                  <strong>{selectedSignal==='weak'?'LOW SIGNAL':selectedSignal==='impact'?'STRONG SIGNAL':'PROFILE SIGNAL'}</strong>
                  <p>{selectedSignal==='weak'?'Activity is visible. Outcome is not. Click “Analyze” to turn this into evidence.':selectedSignal==='impact'?'Measurable impact is recruiter-readable evidence. Keep this visible.':'This is part of the profile ResuMatch uses to reason about fit.'}</p>
                </motion.div>
                <div className="score-floating"><span>LIVE SIGNAL</span><strong>{selectedSignal==='impact'?84:72}</strong><small>{selectedSignal?'UPDATED FROM YOUR SELECTION':'SELECT A LINE TO INSPECT'}</small></div>
              </div>
            </section>
            <section className="process-band" id="how">
              <div><span>01</span><b>READ</b><small>Parse the document</small></div>
              <div><span>02</span><b>INSPECT</b><small>Expose weak signals</small></div>
              <div><span>03</span><b>STRENGTHEN</b><small>Improve the evidence</small></div>
              <div><span>04</span><b>MATCH</b><small>Find the right role</small></div>
            </section>
            <section className="statement-block">
              <div className="eyebrow">THE DIFFERENCE</div>
              <h2>SAME EXPERIENCE.<br/><span>BETTER TRANSLATION.</span></h2>
              <p>Not another resume builder. ResuMatch makes the invisible decisions visible — then lets you act on them.</p>
            </section>
          </motion.main>
        )}

        {page==='upload' && (
          <motion.main className="upload-screen" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}}>
            <div className="upload-header"><div className="eyebrow">01 / START WITH THE DOCUMENT</div><h2>DROP IT IN.<br/><span>SEE WHAT WE FIND.</span></h2></div>
            <div className="upload-layout">
              <label className={`drop-zone ${resumeFileName?'has-file':''}`}
                onDragEnter={e=>e.preventDefault()} onDragOver={e=>e.preventDefault()}
                onDrop={e=>{e.preventDefault();handleFile(e.dataTransfer.files?.[0]);}}
              >
                <input type="file" accept=".pdf,.txt,.doc,.docx" onChange={e=>handleFile(e.target.files?.[0])}/>
                <UploadCloud size={28}/>
                <strong>{resumeFileName ? resumeFileName : 'Drop your resume here'}</strong>
                <span>PDF or TXT · Max 5MB</span>
                <b>CLICK TO CHOOSE</b>
              </label>
              <div className="input-stack">
                <label>OR PASTE THE DOCUMENT<textarea value={resumeText} onChange={e=>setResumeText(e.target.value)} /></label>
                <label>TARGET JOB<textarea value={jobDesc} onChange={e=>setJobDesc(e.target.value)} /></label>
                <div className="upload-actions"><button className="black-btn" onClick={startAnalysis} disabled={!resumeText.trim()}>RUN THE ANALYSIS <ScanLine size={16}/></button><button className="text-btn" onClick={()=>{setResumeText(DEFAULT_RESUME);setJobDesc(DEFAULT_JOB_DESC);setResumeFileName('john_doe_resume.pdf')}}>LOAD SAMPLE</button></div>
              </div>
            </div>
          </motion.main>
        )}

        {page==='loading' && (
          <motion.main className="loading-screen" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
            <div className="loading-main">
              <div className="eyebrow">RESUMATCH ENGINE / LIVE</div>
              <h2>TURNING WORDS<br/>INTO <span>SIGNALS.</span></h2>
              <div className="loading-doc">{[1,2,3,4,5,6].map(i=><motion.div key={i} animate={{scaleX:[.35,.95,.55],x:[0,6,-3,0]}} transition={{duration:1.2,delay:i*.06,repeat:Infinity}} />)}</div>
              <div className="loading-status"><span>ANALYZING {resumeFileName}</span><b>{uploadProgress}%</b></div>
              <div className="loading-track"><motion.i animate={{width:`${uploadProgress}%`}} /></div>
              <p>{uploadProgress<30?'Opening document streams…':uploadProgress<60?'Mapping experience and skills…':uploadProgress<90?'Comparing target-job vocabulary…':'Calculating profile signal…'}</p>
            </div>
          </motion.main>
        )}

        {page==='dashboard' && (
          <motion.main className="dashboard-screen" initial={{opacity:0}} animate={{opacity:1}}>
            <section className="dash-intro">
              <div><div className="eyebrow">02 / YOUR RESUME, UNDERSTOOD</div><h2>{resumeFileName}</h2><p>{result.stats.wordCount} words · {result.stats.matchCount} matched keywords · {result.stats.missingCount} gaps</p></div>
              <button className="outline-btn" onClick={()=>setPage('upload')}><RefreshCw size={15}/> RE-ANALYZE</button>
            </section>

            <section className="signal-board" id="insights">
              <div className="signal-main">
                <div className="mono-label">CURRENT PROFILE SIGNAL</div>
                <div className="big-score">{result.score}<span>/100</span></div>
                <p>{result.rating}. Your biggest leverage is in the missing signals below.</p>
                <div className="signal-rail"><i style={{width:`${result.score}%`}} /></div>
              </div>
              <div className="signal-stats">
                <div><span>KEYWORDS</span><strong>{result.stats.matchCount}</strong><small>matched</small></div>
                <div><span>GAPS</span><strong>{result.stats.missingCount}</strong><small>to review</small></div>
                <div><span>SECTIONS</span><strong>{result.stats.sectionsFound}/5</strong><small>detected</small></div>
              </div>
              <div className="verdict"><Sparkles size={16}/><span>AI VERDICT</span><strong>{result.score>=80?'You’re closer than you think.':'The experience is there. The evidence needs work.'}</strong></div>
            </section>

            <section className="action-canvas">
              <div className="canvas-head"><div><div className="eyebrow">03 / MAKE ONE CHANGE</div><h2>DON’T ADD MORE.<br/><span>MAKE IT LAND.</span></h2></div><div className="mono-label">SELECT A SUGGESTION →</div></div>
              <div className="action-grid">
                <div className="resume-fragment">
                  <div className="fragment-top"><span>YOUR WORDS</span><span>LIVE DOCUMENT</span></div>
                  <p>Worked on <mark>web applications</mark> and helped the team with development.</p>
                  <button className="rewrite-spot" onClick={()=>setRewriteDone(true)}>REWRITE THIS LINE <ArrowRight size={14}/></button>
                  <AnimatePresence>
                    {rewriteDone && <motion.div className="rewritten" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}}><span>RESUMATCH / AFTER</span><p>Built and deployed 3 production web applications using React and Node.js, improving API performance by 40%.</p><b>+12 MATCH POTENTIAL</b></motion.div>}
                  </AnimatePresence>
                </div>
                <div className="suggestion-stack">
                  {result.suggestions.slice(0,4).map((s,i)=><motion.button key={s.id} className={`suggestion-row ${s.severity}`} whileHover={{x:5}} onClick={()=>setSelectedSignal(`suggestion-${i}`)}>
                    <span>0{i+1}</span><div><b>{s.title}</b><small>{s.description}</small></div><ChevronRight size={15}/>
                  </motion.button>)}
                </div>
              </div>
            </section>

            <section className="matches-section" id="matches">
              <div className="canvas-head"><div><div className="eyebrow">04 / OPPORTUNITY MAP</div><h2>THE JOB<br/><span>ANSWERS BACK.</span></h2></div><div className="mono-label">CLICK A ROLE</div></div>
              <div className="match-grid">
                <div className="job-list">{jobs.map((job,i)=><button key={job.title} className={`job-row ${selectedJob===i?'active':''}`} onClick={()=>setSelectedJob(i)}><strong>{job.score}%</strong><div><b>{job.title}</b><small>{job.company} · FULL-TIME</small></div><ArrowRight size={15}/></button>)}</div>
                <motion.div key={selectedJob} className="job-detail" initial={{opacity:.5,x:15}} animate={{opacity:1,x:0}}>
                  <div className="mono-label">WHY THIS FITS</div><h3>{jobs[selectedJob].title} / {jobs[selectedJob].score}%</h3><p>{jobs[selectedJob].reason}</p>
                  {['SKILLS','EXPERIENCE','KEYWORDS'].map((label,i)=><div className="meter" key={label}><div><span>{label}</span><b>{jobs[selectedJob].bars[i]}</b></div><i><em style={{width:`${jobs[selectedJob].bars[i]}%`}}/></i></div>)}
                </motion.div>
              </div>
            </section>

            <section className="roots"><div className="eyebrow">05 / ROOTS</div><h2>YOU SHOULDN’T<br/>HAVE TO GUESS<br/><span>WHY THEY SAID NO.</span></h2><p>ResuMatch makes the invisible layer between your experience and an opportunity visible — what the system sees, what needs stronger evidence, and where the stronger version can go.</p><p className="signature">BUILT BY <b>SOUMYA K.</b> / RESUMATCH AI</p></section>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}
