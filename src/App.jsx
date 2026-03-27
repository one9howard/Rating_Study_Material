import { useState, useEffect, useMemo } from 'react';
import './index.css';
import db from './data/content.json';

// Utility for SRS dates
const getTomorrow = () => new Date(Date.now() + 86400000).toISOString();

export default function App() {
  const [tab, setTab] = useState('dashboard');
  const [search, setSearch] = useState('');

  // Extract unique categories
  const categories = useMemo(() => ["All", ...new Set(db.flashcards.map(c => c.category))], []);

  return (
    <>
      <div className="sidebar">
        <div className="logo">Safety<br/>Mastery<br/>Platform</div>
        <button className={`nav-link ${tab==='dashboard'?'active':''}`} onClick={()=>setTab('dashboard')}>Dashboard</button>
        <button className={`nav-link ${tab==='flashcards'?'active':''}`} onClick={()=>setTab('flashcards')}>SRS Flashcards</button>
        <button className={`nav-link ${tab==='cloze'?'active':''}`} onClick={()=>setTab('cloze')}>Knowledge Checks</button>
        <button className={`nav-link ${tab==='rhythm'?'active':''}`} onClick={()=>setTab('rhythm')}>Rhythm Match</button>
        <button className={`nav-link ${tab==='diagrams'?'active':''}`} onClick={()=>setTab('diagrams')}>Blueprint Library</button>
      </div>

      <div className="main-content">
        <div className="topbar">
          <input 
            type="text" 
            className="search-bar" 
            placeholder="Search Glossary..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="glass-panel" style={(tab === 'diagrams' || search) ? {maxWidth: '1200px', padding: '1.5rem'} : {}}>
          {search ? (
            <Glossary search={search} />
          ) : (
            <>
              {tab === 'dashboard' && <Dashboard />}
              {tab === 'flashcards' && <FlashcardsView categories={categories} />}
              {tab === 'cloze' && <ClozeView />}
              {tab === 'rhythm' && <RhythmGame />}
              {tab === 'diagrams' && <DiagramLibrary />}
            </>
          )}
        </div>
      </div>
    </>
  );
}

function Glossary({ search }) {
  const cards = db.flashcards.filter(c => 
    c.front.toLowerCase().includes(search.toLowerCase()) || 
    c.back.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div>
      <h2 style={{marginBottom: '1.5rem'}}>Glossary Results</h2>
      {cards.length === 0 ? <p>No rules found.</p> : (
        <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          {cards.map(c => (
            <div key={c.id} style={{padding: '1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px'}}>
              <h4 style={{color: 'var(--accent-color)'}}>{c.front}</h4>
              <p style={{marginTop: '0.5rem', color: 'var(--text-secondary)'}}>{c.back}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Dashboard() {
  const [stats, setStats] = useState({ cardsLearned: 0, streak: 1 });
  useEffect(() => {
    const srs = JSON.parse(localStorage.getItem('srs_data') || '{}');
    setStats({ cardsLearned: Object.keys(srs).length, streak: 1 });
  }, []);

  return (
    <div>
      <h2 style={{marginBottom: '2rem'}}>Overview</h2>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.cardsLearned}</div>
          <div className="stat-label">Cards Memorized</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{db.flashcards.length}</div>
          <div className="stat-label">Total In Database</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.streak}</div>
          <div className="stat-label">Day Streak</div>
        </div>
      </div>
    </div>
  );
}

function FlashcardsView({ categories }) {
  const [cat, setCat] = useState('All');
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [srsHistory, setSrsHistory] = useState(() => JSON.parse(localStorage.getItem('srs_data') || '{}'));

  // Logic to only show cards that are due or in the selected category
  const activeCards = useMemo(() => {
    let pool = cat === 'All' ? db.flashcards : db.flashcards.filter(c => c.category === cat);
    // Sort so cards NOT in srsHistory come first, followed by due cards
    return pool.sort((a,b) => {
      let dA = srsHistory[a.id] ? new Date(srsHistory[a.id]).getTime() : 0;
      let dB = srsHistory[b.id] ? new Date(srsHistory[b.id]).getTime() : 0;
      return dA - dB;
    });
  }, [cat, srsHistory]);

  const current = activeCards[idx];

  const handleSRS = (quality) => {
    const newHistory = { ...srsHistory };
    if (quality === 'hard') newHistory[current.id] = new Date().toISOString(); // review immediately
    if (quality === 'good') newHistory[current.id] = getTomorrow();
    if (quality === 'easy') newHistory[current.id] = new Date(Date.now() + 86400000*3).toISOString(); // 3 days
    
    setSrsHistory(newHistory);
    localStorage.setItem('srs_data', JSON.stringify(newHistory));
    
    setFlipped(false);
    setTimeout(() => setIdx((prev) => (prev + 1) % activeCards.length), 200);
  };

  if(!current) return <div>No cards available in this deck.</div>;

  return (
    <div>
      <div className="deck-controls">
        <h2 style={{margin: 0}}>SRS Study Mode</h2>
        <select className="select-clean" value={cat} onChange={e => {setCat(e.target.value); setIdx(0); setFlipped(false);}}>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={() => setFlipped(!flipped)}>
        <div className="flashcard-inner">
          <div className="flashcard-front">
            <span className="category-tag">{current.category}</span>
            <p>{current.front}</p>
          </div>
          <div className="flashcard-back">
            <span className="category-tag">{current.category}</span>
            <p>{current.back}</p>
          </div>
        </div>
      </div>

      {flipped && (
        <div className="srs-controls">
          <button className="btn-control btn-danger" onClick={(e) => {e.stopPropagation(); handleSRS('hard');}}>Hard (Again)</button>
          <button className="btn-control btn-warning" onClick={(e) => {e.stopPropagation(); handleSRS('good');}}>Good (1d)</button>
          <button className="btn-control btn-success" onClick={(e) => {e.stopPropagation(); handleSRS('easy');}}>Easy (3d)</button>
        </div>
      )}
    </div>
  );
}

function ClozeView() {
  const [idx, setIdx] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [status, setStatus] = useState('idle');
  const current = db.fillInTheBlanks[idx];
  const parts = current.text.split('[?]');

  const check = (e) => {
    if(e) e.preventDefault();
    if(inputVal.toLowerCase().trim() === current.answer.toLowerCase().trim()) setStatus('correct');
    else setStatus('incorrect');
  };

  const next = () => { setStatus('idle'); setInputVal(''); setIdx((p) => (p+1)%db.fillInTheBlanks.length); };

  return (
    <div style={{display:'flex', flexDirection:'column', alignItems:'center', padding:'2rem 0'}}>
      <h2 style={{marginBottom:'2rem'}}>Knowledge Check</h2>
      <form onSubmit={check} className="cloze-sentence">
        {parts[0]}
        <input type="text" className={`cloze-input ${status==='correct'?'correct':status==='incorrect'?'incorrect':''}`} 
          value={inputVal} onChange={e=>{setInputVal(e.target.value); setStatus('idle')}} disabled={status==='correct'} autoFocus/>
        {parts[1]}
      </form>

      {status === 'idle' && (
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button className="btn-control btn-primary" onClick={check}>Check</button>
          <button className="btn-control" onClick={() => setStatus('revealed')}>Show Answer</button>
          <button className="btn-control" onClick={next}>Skip</button>
        </div>
      )}
      
      {status === 'correct' && (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <div style={{color:'var(--success-color)', fontSize:'1.2rem', fontWeight:600}}>Correct!</div>
          <button className="btn-control btn-primary" style={{marginTop:'1rem'}} onClick={next}>Next</button>
        </div>
      )}

      {status === 'incorrect' && (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <div style={{color:'var(--danger-color)', fontSize:'1.2rem', fontWeight:600}}>Incorrect! Try again.</div>
          <div style={{ display:'flex', gap:'1rem', justifyContent:'center', marginTop:'1rem'}}>
             <button className="btn-control" onClick={() => setStatus('idle')}>Retry</button>
             <button className="btn-control" onClick={() => setStatus('revealed')}>Show Answer</button>
          </div>
        </div>
      )}

      {status === 'revealed' && (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
           <div style={{color:'var(--accent-color)', fontSize:'1.2rem'}}>Answer: <strong>{current.answer}</strong></div>
           <button className="btn-control btn-primary" style={{marginTop:'1rem'}} onClick={next}>Next Challenge</button>
        </div>
      )}
    </div>
  );
}

function RhythmGame() {
  const acronyms = db.acronyms;
  const [gameIdx, setGameIdx] = useState(0);
  const [matchedCount, setMatchedCount] = useState(0);
  const [revealed, setRevealed] = useState(false);
  
  const current = acronyms[gameIdx];
  // Shuffle words for presentation
  const shuffledWords = useMemo(() => [...current.words].sort(() => Math.random() - 0.5), [current]);
  
  const handleWordClick = (word) => {
    if(revealed) return;
    if(word === current.words[matchedCount]) {
      setMatchedCount(prev => prev + 1);
    }
  };

  const isWin = matchedCount === current.words.length;

  return (
    <div style={{textAlign:'center', padding:'2rem 0'}}>
       <h2 style={{color:'var(--accent-color)', marginBottom:'0.5rem'}}>Rhythm Match</h2>
       
       {!revealed ? (
         <p style={{marginBottom:'2rem', color:'var(--text-secondary)'}}>Click the terms in exact sequential order for: <strong>{current.title}</strong></p>
       ) : (
         <p style={{marginBottom:'2rem', color:'var(--danger-color)', fontWeight:'bold'}}>The exact sequence layout for {current.title}:</p>
       )}
       
       <div style={{display:'flex', gap:'1rem', flexWrap:'wrap', justifyContent:'center', marginBottom:'3rem'}}>
         {!revealed ? shuffledWords.map((w, i) => {
           const isMatched = current.words.indexOf(w) < matchedCount;
           return (
             <div key={i} className={`rhythm-word ${isMatched ? 'matched' : ''}`} onClick={() => handleWordClick(w)}>
               {w}
             </div>
           );
         }) : current.words.map((w, i) => (
           <div key={i} className="rhythm-word matched" style={{opacity: 1, backgroundColor: 'var(--accent-color)', borderColor: 'var(--accent-color)'}}>
             {i + 1}. {w}
           </div>
         ))}
       </div>

       {isWin && !revealed && (
         <div>
           <h3 style={{color:'var(--success-color)'}}>Acronym Mastered!</h3>
           <button className="btn-control btn-primary" style={{marginTop:'1rem'}} onClick={() => {
              setGameIdx((p)=> (p+1)%acronyms.length);
              setMatchedCount(0);
              setRevealed(false);
           }}>Next Sequence</button>
         </div>
       )}

       {!isWin && !revealed && (
         <button className="btn-control" onClick={() => setRevealed(true)}>Show Answer Sequence</button>
       )}

       {revealed && (
          <div>
            <button className="btn-control btn-primary" onClick={() => {
              setGameIdx((p)=> (p+1)%acronyms.length);
              setMatchedCount(0);
              setRevealed(false);
            }}>Next Challenge</button>
          </div>
       )}
    </div>
  );
}

function DiagramLibrary() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const diagrams = db.diagrams;
  if(!diagrams) return null;
  const current = diagrams[selectedIdx];

  return (
    <div style={{width: '100%', height: '800px', display: 'flex', flexDirection: 'column'}}>
      <div style={{display: 'flex', gap: '0.5rem', marginBottom: '1rem', overflowX: 'auto', paddingBottom: '0.5rem'}}>
        {diagrams.map((d, i) => (
          <button key={d.id} className={`btn-control ${selectedIdx === i ? 'btn-primary' : ''}`}
            onClick={() => setSelectedIdx(i)} style={{whiteSpace: 'nowrap', padding: '0.5rem 1rem'}}>
            {d.title}
          </button>
        ))}
      </div>
      <div style={{flex: 1, backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden'}}>
        <iframe src={`/diagrams/${current.filename}#toolbar=0`} width="100%" height="100%" style={{border: 'none'}} title={current.title} />
      </div>
    </div>
  );
}
