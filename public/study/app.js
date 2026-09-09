const views = [...document.querySelectorAll('.view')];
const navButtons = [...document.querySelectorAll('.nav-card')];
const progress = JSON.parse(localStorage.getItem('spliceChallengeProgress') || '{"mastered":0}');
const streak = document.querySelector('#streak');
const rackLayout = ['Power unit','LSU / ASU','LIU / TAU / MXU','TRU','12-channel units'];
const rackRows = ['D','C','B','A'];
const modeTwo = { D:['Power unit','LSU / ASU','TAU','TRU','12-channel units'], C:['SSU','CTU','LIU','TRU','12-channel units'], B:['Power unit','DLU','TAU','TRU','12-channel units'], A:['ACU','LSU / ASU','LIU','TRU','12-channel units'] };
const modeThree = { D:['Power unit','LSU / ASU','MXU','TRU','12-channel units'], C:['SSU','CTU','LIU','TRU','12-channel units'], B:['Power unit','DLU','MXU','TRU','12-channel units'], A:['ACU','LSU / ASU','LIU','TRU','12-channel units'] };
let selectedCard = null, selectedRouteToken = null, mode = '2';
const placedCards = {}, routePlaced = {};

function saveProgress() { localStorage.setItem('spliceChallengeProgress', JSON.stringify(progress)); streak.textContent = `${progress.mastered} challenge${progress.mastered === 1 ? '' : 's'} mastered`; }
function markMastered(key) { if (!progress[key]) { progress[key] = true; progress.mastered += 1; saveProgress(); } }
function showView(id) { views.forEach(view => view.classList.toggle('active', view.id === id)); navButtons.forEach(button => button.classList.toggle('active', button.dataset.view === id)); window.scrollTo({top:0, behavior:'smooth'}); }
navButtons.forEach(button => button.addEventListener('click', () => showView(button.dataset.view)));
document.querySelectorAll('[data-go]').forEach(button => button.addEventListener('click', () => showView(button.dataset.go)));
document.querySelector('#resetProgress').addEventListener('click', () => { localStorage.removeItem('spliceChallengeProgress'); location.reload(); });

function getExpectedRack() { return mode === '2' ? modeTwo : modeThree; }
function renderRack() {
  const expected = getExpectedRack(), rack = document.querySelector('#slcRack');
  const bank = [...new Set(Object.values(expected).flat())];
  document.querySelector('#slcCards').innerHTML = bank.map(card => `<button class="token ${selectedCard === card ? 'selected' : ''} ${Object.values(placedCards).includes(card) ? 'used' : ''}" data-card="${card}">${card}</button>`).join('');
  document.querySelectorAll('[data-card]').forEach(button => button.addEventListener('click', () => { selectedCard = button.dataset.card; renderRack(); }));
  rack.innerHTML = `<div class="header">Shelf</div>${rackLayout.map(item => `<div class="header">${item}</div>`).join('')}`;
  rackRows.forEach(shelf => { rack.insertAdjacentHTML('beforeend', `<div class="shelf">${shelf}</div>`); rackLayout.forEach((_, index) => { const key = `${shelf}-${index}`, value = placedCards[key] || ''; rack.insertAdjacentHTML('beforeend', `<div class="slot ${value ? 'filled' : ''}" data-slot="${key}">${value || '—'}</div>`); }); });
  document.querySelectorAll('[data-slot]').forEach(slot => slot.addEventListener('click', () => { if (!selectedCard) return; const prior = placedCards[slot.dataset.slot]; if (prior === selectedCard) delete placedCards[slot.dataset.slot]; else placedCards[slot.dataset.slot] = selectedCard; document.querySelector('#rackFeedback').textContent = ''; renderRack(); }));
  document.querySelector('#rackNotes').textContent = mode === '2' ? 'Mode 2: TAUs assign call priority and retain a log of blocked calls; 48 dial tones serve 96 customers.' : 'Mode 3: MXUs are used; 48 circuits and a DT payphone line are noted in the source.';
}
document.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => { mode = button.dataset.mode; Object.keys(placedCards).forEach(key => delete placedCards[key]); selectedCard = null; document.querySelectorAll('[data-mode]').forEach(item => item.classList.toggle('active', item.dataset.mode === mode)); renderRack(); }));
document.querySelector('#clearRack').addEventListener('click', () => { Object.keys(placedCards).forEach(key => delete placedCards[key]); selectedCard = null; renderRack(); });
document.querySelector('#checkRack').addEventListener('click', () => { const expected = getExpectedRack(); let correct = 0; document.querySelectorAll('[data-slot]').forEach(slot => { const [shelf,index] = slot.dataset.slot.split('-'); const match = placedCards[slot.dataset.slot] === expected[shelf][Number(index)]; slot.classList.toggle('correct', match); slot.classList.toggle('incorrect', !match && Boolean(placedCards[slot.dataset.slot])); if (match) correct += 1; }); const feedback = document.querySelector('#rackFeedback'); feedback.textContent = `${correct}/20 positions correct.${correct === 20 ? ' Rack mastered.' : ' Use the source diagram to correct the remaining cards.'}`; feedback.className = `feedback ${correct === 20 ? 'good' : 'bad'}`; if (correct === 20) markMastered(`slc-${mode}`); });

const routeExpected = ['T','M','T','M','FT'];
function renderRoute() { document.querySelector('#routeTokens').innerHTML = ['T','M','FT'].map(token => `<button class="token ${selectedRouteToken === token ? 'selected' : ''}" data-route-token="${token}">${token === 'T' ? 'T — transducer' : token === 'M' ? 'M — manifold' : 'FT — flow transducer'}</button>`).join(''); document.querySelectorAll('[data-route-token]').forEach(button => button.addEventListener('click', () => { selectedRouteToken = button.dataset.routeToken; renderRoute(); })); document.querySelector('#routeSlots').innerHTML = routeExpected.map((_, index) => `<button class="route-slot ${routePlaced[index] ? 'filled' : ''}" data-route-slot="${index}">${routePlaced[index] || '?'}</button>`).join(''); document.querySelectorAll('[data-route-slot]').forEach(slot => slot.addEventListener('click', () => { if (!selectedRouteToken) return; routePlaced[slot.dataset.routeSlot] = selectedRouteToken; document.querySelector('#routeFeedback').textContent = ''; renderRoute(); })); }
document.querySelector('#clearRoute').addEventListener('click', () => { Object.keys(routePlaced).forEach(key => delete routePlaced[key]); selectedRouteToken = null; renderRoute(); });
document.querySelector('#checkRoute').addEventListener('click', () => { let correct = 0; document.querySelectorAll('[data-route-slot]').forEach(slot => { const match = routePlaced[slot.dataset.routeSlot] === routeExpected[Number(slot.dataset.routeSlot)]; slot.classList.toggle('correct', match); slot.classList.toggle('incorrect', !match && Boolean(routePlaced[slot.dataset.routeSlot])); if (match) correct += 1; }); const feedback = document.querySelector('#routeFeedback'); feedback.textContent = `${correct}/5 markers correct.${correct === 5 ? ' Route mastered.' : ' Start at 3,000 ft and follow the sequence in your source diagram.'}`; feedback.className = `feedback ${correct === 5 ? 'good' : 'bad'}`; if (correct === 5) markMastered('air'); });

const loadingQuestions = [{ text:'A copper loop is 24,000 ft long. Which plan matches the source notes?', answers:['No coils; only loops beyond 30,000 ft need loading.','First coil 3,000 ft from the C/O, then every 6,000 ft, ensuring the final placement is within 9,000 ft of the subscriber.','Place one coil halfway through every loop, regardless of length.'], correct:1 },{ text:'Which statement about load coils matches your supplied notes?', answers:['They are used on loops over 18,000 ft and block frequencies between 3,400 and 4,200 Hz.','They reduce loop resistance and are only used in fiber.','They are placed every 9,000 ft with no tolerance requirement.'], correct:0 }];
let loadingIndex = 0;
function renderLoadingQuestion() { const question = loadingQuestions[loadingIndex]; document.querySelector('.question-card h3').textContent = question.text; document.querySelector('#loadChoices').innerHTML = question.answers.map((answer,index) => `<button class="choice" data-choice="${index}">${answer}</button>`).join(''); document.querySelector('#loadFeedback').textContent = ''; document.querySelectorAll('[data-choice]').forEach(button => button.addEventListener('click', () => { const chosen = Number(button.dataset.choice), correct = chosen === question.correct; document.querySelectorAll('[data-choice]').forEach(item => { item.disabled = true; item.classList.toggle('correct', Number(item.dataset.choice) === question.correct); item.classList.toggle('incorrect', Number(item.dataset.choice) === chosen && !correct); }); const feedback = document.querySelector('#loadFeedback'); feedback.textContent = correct ? 'Correct. Explain the placement out loud before moving on.' : 'Not quite. Revisit the loading diagram, then retry the next scenario.'; feedback.className = `feedback ${correct ? 'good' : 'bad'}`; if (correct) markMastered('loading'); })); }
document.querySelector('#newLoadingQuestion').addEventListener('click', () => { loadingIndex = (loadingIndex + 1) % loadingQuestions.length; renderLoadingQuestion(); });

const referenceMap = { slc: ['SLC-96 reference diagrams','assets/reference-diagrams/slc_96_mode2.pdf'], air: ['Air-pressure reference diagram','assets/reference-diagrams/air-pressure.pdf'], loading: ['Load-coil reference notes','assets/reference-diagrams/loading.pdf'], current: ['Blank-paper drill reference',null] };
const dialog = document.querySelector('#referenceDialog'); document.querySelectorAll('[data-reference]').forEach(button => button.addEventListener('click', () => { const key = button.dataset.reference, item = referenceMap[key]; const source = key === 'current' ? `assets/reference-diagrams/${document.querySelector('#drawPrompt').value}` : item[1]; document.querySelector('#referenceTitle').textContent = item[0]; document.querySelector('#referenceFrame').src = source; dialog.showModal(); })); document.querySelector('#closeReference').addEventListener('click', () => dialog.close());

const canvas = document.querySelector('#drawingCanvas'), ctx = canvas.getContext('2d'); let strokes = [], activeStroke = null, timerId = null; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.strokeStyle = '#082e48';
function paint() { ctx.clearRect(0,0,canvas.width,canvas.height); strokes.forEach(stroke => { ctx.beginPath(); stroke.forEach((point,index) => index ? ctx.lineTo(point.x,point.y) : ctx.moveTo(point.x,point.y)); ctx.stroke(); }); }
function pointFromEvent(event) { const rect = canvas.getBoundingClientRect(), source = event.touches?.[0] || event; return {x:(source.clientX - rect.left) * canvas.width / rect.width, y:(source.clientY - rect.top) * canvas.height / rect.height}; }
canvas.addEventListener('pointerdown', event => { activeStroke = [pointFromEvent(event)]; canvas.setPointerCapture(event.pointerId); }); canvas.addEventListener('pointermove', event => { if (!activeStroke) return; activeStroke.push(pointFromEvent(event)); strokes.push(activeStroke); paint(); strokes.pop(); }); canvas.addEventListener('pointerup', () => { if (activeStroke?.length) strokes.push(activeStroke); activeStroke = null; paint(); });
document.querySelector('#clearCanvas').addEventListener('click', () => { strokes=[]; paint(); }); document.querySelector('#undoStroke').addEventListener('click', () => { strokes.pop(); paint(); });
function setTimer(seconds) { const mins = String(Math.floor(seconds / 60)).padStart(2,'0'), secs = String(seconds % 60).padStart(2,'0'); document.querySelector('#timer').textContent = `${mins}:${secs}`; }
document.querySelector('#startTimer').addEventListener('click', () => { clearInterval(timerId); let seconds = Number(document.querySelector('#timerMinutes').value) * 60; setTimer(seconds); timerId = setInterval(() => { seconds -= 1; setTimer(Math.max(seconds,0)); if (!seconds) { clearInterval(timerId); alert('Time. Put the pencil down, name the labels you included, then reveal the reference.'); } },1000); });
saveProgress(); renderRack(); renderRoute(); renderLoadingQuestion();

// Full study-pack course library. The records and source files were imported from the supplied archive.
const studyData = window.SPLICE_STUDY_DATA;
const allStudyCards = studyData.flashcards || [];
const sourcePdfs = ['188A.pdf','188A_parts.pdf','188A_tests.pdf','193A_test_set.pdf','193A_test_set(1).pdf','8_steps_of _quality.pdf','air.pdf','basic_electricity.pdf','basic_electricity_terms.pdf','coils.pdf','compounds.pdf','drop_clearance.pdf','drop_wire.pdf','fios_cheat_sheet.pdf','fluke_c9970.pdf','fluke_c9970(1).pdf','fluke_c9970(2).pdf','fluke_c9970(3).pdf','litespan_2000.pdf','loading.pdf','manholes.pdf','manhole_scenario.pdf','protection.pdf','rda_monitoring_system.pdf','rda_monitoring_system(1).pdf','rda_monitoring_system(2).pdf','rda_monitoring_system(3).pdf','rubber_gloves.pdf','rubber_gloves(1).pdf','rubber_gloves(2).pdf','safety_cover.pdf','safety_gear.pdf','slc96_mode1.pdf','slc96_mode2.pdf','slc96_mode3.pdf','slc_96_mode1.pdf','tapes_and_solders.pdf','terminals.pdf','test_sets.pdf','test_sets(1).pdf','vault.pdf','vault(1).pdf','work_area_protection.pdf'];
const sourceGroups = {
  'Safety and PPE': ['rubber','safety','vault','manhole','work_area'],
  'Test equipment': ['188','193','fluke','test_sets','rda'],
  'Plant systems': ['air','loading','coils','slc','litespan','fios'],
  'Cable, terminals, and protection': ['drop','terminal','tapes','compound','protection','electricity','quality']
};
function sourceGroup(filename) { const lower = filename.toLowerCase(); return Object.entries(sourceGroups).find(([,terms]) => terms.some(term => lower.includes(term)))?.[0] || 'Other references'; }
function prettyFilename(filename) { return filename.replace(/\.pdf$/i,'').replaceAll('_',' ').replace(/\(\d+\)/,'').replace(/\b\w/g, letter => letter.toUpperCase()); }
function renderTopicMap() {
  const categoryCounts = allStudyCards.reduce((counts, card) => ({...counts, [card.category]:(counts[card.category] || 0) + 1}), {});
  const primaryTopics = [['Rules',categoryCounts.Rules || 0],['Safety and PPE',(categoryCounts.PPE || 0) + (categoryCounts['Rubber Gloves'] || 0) + (categoryCounts['Vault Safety'] || 0) + (categoryCounts['Manhole Safety'] || 0)],['Equipment and testing',(categoryCounts.Equipment || 0) + (categoryCounts['Test Sets'] || 0) + (categoryCounts['RDA Monitoring'] || 0)],['Plant systems',(categoryCounts['Air Pressure'] || 0) + (categoryCounts['SLC 96'] || 0) + (categoryCounts.Loading || 0) + (categoryCounts.Fiber || 0)]];
  document.querySelector('#topicMap').innerHTML = primaryTopics.map(([topic,count]) => `<button class="topic-chip" data-topic="${topic}"><b>${topic}</b><span>${count} recall cards plus source references</span></button>`).join('');
  document.querySelectorAll('[data-topic]').forEach(button => button.addEventListener('click', () => { showView('flashcards'); if (button.dataset.topic === 'Rules') document.querySelector('#cardCategory').value = 'Rules'; else document.querySelector('#cardCategory').value = 'All'; refreshDeck(); }));
}
function renderSourceLibrary() {
  const query = document.querySelector('#sourceSearch').value.trim().toLowerCase();
  const visible = sourcePdfs.filter(file => !query || prettyFilename(file).toLowerCase().includes(query) || sourceGroup(file).toLowerCase().includes(query));
  document.querySelector('#sourceLibrary').innerHTML = visible.map(file => `<a class="source-document" target="_blank" href="assets/source-pdfs/${encodeURIComponent(file)}"><b>${prettyFilename(file)}</b><span>${sourceGroup(file)} reference PDF</span></a>`).join('') || '<p>No source documents match that search.</p>';
  document.querySelector('#libraryCount').textContent = `${sourcePdfs.length} PDFs + rules video`;
}
document.querySelector('#sourceSearch').addEventListener('input', renderSourceLibrary);
function openLibraryReference(title, source) { document.querySelector('#referenceTitle').textContent = title; document.querySelector('#referenceFrame').src = source; dialog.showModal(); }
document.querySelector('#openRulesTranscript').addEventListener('click', () => openLibraryReference('All 31 company rules', 'assets/rules-transcript.txt'));
document.querySelector('#openKaraoke').addEventListener('click', () => openLibraryReference('Rules karaoke study video', 'assets/rules-karaoke.mp4'));

let activeDeck = [...allStudyCards], deckIndex = 0, cardRevealed = false, clozeIndex = 0;
function renderCategoryOptions() {
  const categories = ['All', ...new Set(allStudyCards.map(card => card.category))];
  document.querySelector('#cardCategory').innerHTML = categories.map(category => `<option value="${category}">${category}</option>`).join('');
}
function refreshDeck() {
  const category = document.querySelector('#cardCategory').value, query = document.querySelector('#cardSearch').value.trim().toLowerCase();
  activeDeck = allStudyCards.filter(card => (category === 'All' || card.category === category) && (!query || `${card.front} ${card.back} ${card.category}`.toLowerCase().includes(query)));
  deckIndex = 0; cardRevealed = false; renderStudyCard();
}
function renderStudyCard() {
  const card = activeDeck[deckIndex], cardElement = document.querySelector('#studyCard');
  if (!card) { document.querySelector('#cardFront').textContent = 'No cards match that search.'; document.querySelector('#cardBack').textContent = ''; document.querySelector('#cardPosition').textContent = '0 / 0'; return; }
  document.querySelector('#cardCategoryLabel').textContent = card.category;
  document.querySelector('#cardFront').textContent = card.front;
  document.querySelector('#cardBack').textContent = card.back;
  document.querySelector('#cardPosition').textContent = `${deckIndex + 1} / ${activeDeck.length}`;
  document.querySelector('#deckCount').textContent = `${activeDeck.length} card${activeDeck.length === 1 ? '' : 's'} in this deck`;
  cardElement.classList.toggle('revealed', cardRevealed);
  document.querySelector('#revealCard').textContent = cardRevealed ? 'Hide answer' : 'Reveal';
}
function toggleCard() { if (!activeDeck.length) return; cardRevealed = !cardRevealed; renderStudyCard(); }
document.querySelector('#studyCard').addEventListener('click', toggleCard);
document.querySelector('#studyCard').addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); toggleCard(); } });
document.querySelector('#revealCard').addEventListener('click', toggleCard);
document.querySelector('#previousCard').addEventListener('click', () => { if (!activeDeck.length) return; deckIndex = (deckIndex - 1 + activeDeck.length) % activeDeck.length; cardRevealed = false; renderStudyCard(); });
document.querySelector('#nextCard').addEventListener('click', () => { if (!activeDeck.length) return; deckIndex = (deckIndex + 1) % activeDeck.length; cardRevealed = false; renderStudyCard(); });
document.querySelector('#masterCard').addEventListener('click', () => { if (!activeDeck.length) return; markMastered(`card-${activeDeck[deckIndex].id}`); deckIndex = (deckIndex + 1) % activeDeck.length; cardRevealed = false; renderStudyCard(); });
document.querySelector('#cardCategory').addEventListener('change', refreshDeck);
document.querySelector('#cardSearch').addEventListener('input', refreshDeck);
document.querySelector('#shuffleCards').addEventListener('click', () => { activeDeck = [...activeDeck].sort(() => Math.random() - 0.5); deckIndex = 0; cardRevealed = false; renderStudyCard(); });
function renderCloze() { const cloze = (studyData.fillInTheBlanks || [])[clozeIndex]; if (!cloze) return; document.querySelector('#clozePrompt').textContent = cloze.text.replace('[?]','________'); document.querySelector('#clozeAnswer').value = ''; document.querySelector('#clozeFeedback').textContent = ''; }
document.querySelector('#checkCloze').addEventListener('click', () => { const cloze = (studyData.fillInTheBlanks || [])[clozeIndex]; const answer = document.querySelector('#clozeAnswer').value.trim().toLowerCase(); const feedback = document.querySelector('#clozeFeedback'); if (answer === cloze.answer.trim().toLowerCase()) { feedback.textContent = 'Correct. Next recall prompt loaded.'; feedback.className = 'feedback good'; clozeIndex = (clozeIndex + 1) % studyData.fillInTheBlanks.length; setTimeout(renderCloze, 700); } else { feedback.textContent = `Try again. Hint: the answer is ${cloze.answer.length} characters.`; feedback.className = 'feedback bad'; } });
renderTopicMap(); renderSourceLibrary(); renderCategoryOptions(); refreshDeck(); renderCloze();
