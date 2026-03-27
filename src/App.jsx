import { useState } from 'react';
import './index.css';
import data from './data/content.json';

function App() {
  const [mode, setMode] = useState('flashcards');

  return (
    <div className="app-container">
      <h1 className="title">Rating Study Material</h1>

      <div className="mode-selector">
        <button
          className={`btn-mode ${mode === 'flashcards' ? 'active' : ''}`}
          onClick={() => setMode('flashcards')}
        >
          Flashcards
        </button>
        <button
          className={`btn-mode ${mode === 'cloze' ? 'active' : ''}`}
          onClick={() => setMode('cloze')}
        >
          Fill in the Blanks
        </button>
        <button
          className={`btn-mode ${mode === 'diagrams' ? 'active' : ''}`}
          onClick={() => setMode('diagrams')}
        >
          Diagram Library
        </button>
      </div>

      <div className="glass-panel" style={mode === 'diagrams' ? { minHeight: '700px', padding: '1rem' } : {}}>
        {mode === 'flashcards' && <Flashcards />}
        {mode === 'cloze' && <ClozeTests />}
        {mode === 'diagrams' && <DiagramLibrary />}
      </div>
    </div>
  );
}

function Flashcards() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const cards = data.flashcards;

  const nextCard = () => {
    setFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % cards.length);
    }, 150);
  };

  const prevCard = () => {
    setFlipped(false);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
    }, 150);
  };

  const current = cards[currentIndex];

  return (
    <div style={{ width: '100%' }}>
      <div
        className={`flashcard ${flipped ? 'flipped' : ''}`}
        onClick={() => setFlipped(!flipped)}
      >
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

      <div className="controls">
        <button className="btn-control" onClick={prevCard}>Previous</button>
        <span style={{ alignSelf: 'center', opacity: 0.6 }}>{currentIndex + 1} / {cards.length}</span>
        <button className="btn-control btn-primary" onClick={nextCard}>Next</button>
      </div>
    </div>
  );
}

function ClozeTests() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [status, setStatus] = useState('idle');

  const tests = data.fillInTheBlanks;
  const current = tests[currentIndex];

  const parts = current.text.split('[?]');

  const checkAnswer = (e) => {
    if (e) e.preventDefault();
    if (inputVal.toLowerCase().trim() === current.answer.toLowerCase().trim()) {
      setStatus('correct');
    } else {
      setStatus('incorrect');
    }
  };

  const nextTest = () => {
    setStatus('idle');
    setInputVal('');
    setCurrentIndex((prev) => (prev + 1) % tests.length);
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <span className="category-tag" style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
        Memorization Check
      </span>

      <form onSubmit={checkAnswer} className="cloze-sentence">
        {parts[0]}
        <input
          type="text"
          className={`cloze-input ${status === 'correct' ? 'correct' : status === 'incorrect' ? 'incorrect' : ''}`}
          value={inputVal}
          onChange={(e) => {
            setInputVal(e.target.value);
            setStatus('idle');
          }}
          disabled={status === 'correct'}
          autoFocus
        />
        {parts[1]}
      </form>

      {status === 'idle' && (
        <button className="btn-control btn-primary" onClick={checkAnswer}>Check Answer</button>
      )}

      {status === 'correct' && (
        <>
          <div className="feedback success">Excellent! Memory retained.</div>
          <button className="btn-control btn-primary" style={{ marginTop: '1rem' }} onClick={nextTest}>Next Challenge</button>
        </>
      )}

      {status === 'incorrect' && (
        <div className="feedback error">Incorrect. Think back to the rules...</div>
      )}
    </div>
  );
}

function DiagramLibrary() {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const diagrams = data.diagrams;

  if (!diagrams || diagrams.length === 0) return <div>No diagrams available.</div>;

  const current = diagrams[selectedIdx];

  return (
    <div style={{ width: '100%', height: '650px', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
        {diagrams.map((d, i) => (
          <button
            key={d.id}
            className={`btn-control ${selectedIdx === i ? 'btn-primary' : ''}`}
            onClick={() => setSelectedIdx(i)}
            style={{ whiteSpace: 'nowrap', padding: '0.5rem 1rem' }}
          >
            {d.title}
          </button>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{current.title}</h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{current.description}</p>
      </div>

      <div style={{ flex: 1, backgroundColor: '#fff', borderRadius: '8px', overflow: 'hidden' }}>
        <iframe
          src={`/diagrams/${current.filename}#toolbar=0`}
          width="100%"
          height="100%"
          style={{ border: 'none' }}
          title={current.title}
        />
      </div>
    </div>
  );
}

export default App;
