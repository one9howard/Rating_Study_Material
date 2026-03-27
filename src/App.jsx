import { useState, useMemo } from 'react';
import './index.css';
import db from './data/content.json';

export default function App() {
  const [tab, setTab] = useState('flashcards');
  const [search, setSearch] = useState('');

  // Extract unique categories
  const categories = useMemo(() => ["All", ...new Set(db.flashcards.map(c => c.category))], []);

  const handleNav = (targetTab) => {
    setTab(targetTab);
    setSearch('');
  };

  return (
    <>
      <div className="sidebar">
        <div className="logo">Rating<br/>Study<br/>Guide</div>
        <button className={`nav-link ${tab==='flashcards'&&!search?'active':''}`} onClick={()=>handleNav('flashcards')}>Flashcards</button>
        <button className={`nav-link ${tab==='cloze'&&!search?'active':''}`} onClick={()=>handleNav('cloze')}>Knowledge Checks</button>
        <button className={`nav-link ${tab==='rhythm'&&!search?'active':''}`} onClick={()=>handleNav('rhythm')}>Rhythm Match</button>
        <button className={`nav-link ${tab==='diagrams'&&!search?'active':''}`} onClick={()=>handleNav('diagrams')}>Blueprint Library</button>
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

function FlashcardsView({ categories }) {
  const [cat, setCat] = useState('All');
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const activeCards = useMemo(() => {
    return cat === 'All' ? db.flashcards : db.flashcards.filter(c => c.category === cat);
  }, [cat]);

  const current = activeCards[idx];

  const nextCard = () => {
    setFlipped(false);
    setTimeout(() => {
      setIdx((prev) => (prev + 1) % activeCards.length);
    }, 150);
  };

  const prevCard = () => {
    setFlipped(false);
    setTimeout(() => {
      setIdx((prev) => (prev === 0 ? activeCards.length - 1 : prev - 1));
    }, 150);
  };

  if(!current) return <div>No cards available in this deck.</div>;

  return (
    <div>
      <div className="deck-controls">
        <h2 style={{margin: 0}}>Study Mode</h2>
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

      <div className="srs-controls">
        <button className="btn-control" onClick={(e) => {e.stopPropagation(); prevCard();}}>Previous</button>
        <span style={{ alignSelf: 'center', opacity: 0.6, padding: '0 1rem' }}>{idx + 1} / {activeCards.length}</span>
        <button className="btn-control btn-primary" onClick={(e) => {e.stopPropagation(); nextCard();}}>Next</button>
      </div>
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
