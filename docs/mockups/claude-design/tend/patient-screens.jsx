// patient-screens.jsx — chat, prescriptions, adherence, profile, shares, settings, notifications

// ─── CHAT ───
function PChat({ go, setPendingShare }) {
  const [messages, setMessages] = React.useState(SEED_MSGS);
  const [input, setInput] = React.useState('');
  const [typing, setTyping] = React.useState(false);
  const scrollerRef = React.useRef(null);

  React.useEffect(() => {
    if (scrollerRef.current) scrollerRef.current.scrollTop = scrollerRef.current.scrollHeight;
  }, [messages, typing]);

  const send = (text) => {
    if (!text.trim()) return;
    setMessages(m => [...m, { who:'chen', text }]);
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMessages(m => {
        const reply = generateReply(text);
        return [...m, ...reply];
      });
    }, 900);
  };

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', minHeight:0, background:P.panel }}>
      {/* Chat header */}
      <div style={{
        display:'flex', alignItems:'center', gap:10, padding:'10px 16px',
        borderBottom:`.5px solid ${P.panelEdge}`, background:P.bg,
      }}>
        <button onClick={() => go('home')} style={iconBtnP}>{PI.back(20)}</button>
        <MayaMark size={32} />
        <div style={{ flex:1 }}>
          <div style={{ fontSize:14, fontWeight:600, fontFamily:P.serif, fontStyle:'italic' }}>Maya</div>
          <div style={{ fontSize:10.5, color:P.faint, display:'flex', alignItems:'center', gap:4 }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:P.sage }} />
            Dr. Levin's companion · here for you
          </div>
        </div>
        <button style={iconBtnP}>{PI.more(20)}</button>
      </div>

      {/* Messages */}
      <div ref={scrollerRef} style={{ flex:1, overflowY:'auto', padding:'14px 16px 4px', position:'relative' }}>
        <Anno n={7} top={10} right={8}>
          <strong>Maya speaks in Dr. Levin's tone</strong> — warm-direct, no corporate-AI hedging. She knows only what Dr. Levin has shared with her, and only operates within Chen's prescription.
        </Anno>
        {messages.map((m, i) => <Bubble key={i} m={m} go={go} setPendingShare={setPendingShare} />)}
        {typing && <TypingDots />}
      </div>

      {/* Composer */}
      <div style={{ padding:'8px 12px 14px', borderTop:`.5px solid ${P.panelEdge}`, background:P.bg }}>
        <div style={{ display:'flex', gap:6, marginBottom:8, overflow:'hidden', flexWrap:'wrap' }}>
          {QUICK_REPLIES.map(q => (
            <button key={q} onClick={() => send(q)} style={{
              padding:'6px 10px', fontSize:11.5, borderRadius:999,
              border:`.5px solid ${P.panelEdge}`, background:P.panel, color:P.muted,
              cursor:'pointer', whiteSpace:'nowrap',
            }}>{q}</button>
          ))}
        </div>
        <div style={{
          display:'flex', alignItems:'flex-end', gap:8,
          background:P.panel, border:`.5px solid ${P.panelEdge}`,
          borderRadius:18, padding:'6px 6px 6px 14px',
        }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }}
            placeholder="Tell Maya what's going on…"
            rows={1}
            style={{
              flex:1, border:0, outline:'none', background:'transparent',
              resize:'none', fontFamily:P.font, fontSize:14, lineHeight:1.4,
              color:P.fg, minHeight:24, maxHeight:80, padding:'6px 0',
            }}
          />
          <button onClick={() => send(input)} disabled={!input.trim()} style={{
            width:34, height:34, borderRadius:'50%',
            background: input.trim() ? P.sage : 'rgba(90,122,94,.3)',
            color:'#fff', border:0, cursor: input.trim()?'pointer':'default',
            display:'flex', alignItems:'center', justifyContent:'center',
            paddingLeft:2,
          }}>{PI.send(16)}</button>
        </div>
        <div style={{ fontSize:10.5, color:P.faint, padding:'6px 6px 0', display:'flex', alignItems:'center', gap:5 }}>
          {PI.lock(10)} On-device · Maya summarizes only what you approve
        </div>
      </div>
    </div>
  );
}

const SEED_MSGS = [
  { who:'maya', text:'Morning, Chen. Saw you were up around 02:00. How are you holding this morning?' },
  { who:'chen', text:'tired. heavy. didn\'t go back to sleep until almost 5' },
  { who:'maya', text:'That tracks. Want to do the 3-2-1 grounding now, before anything else? Five minutes.', cta:'grounding' },
  { who:'chen', text:'yeah ok' },
  { who:'maya', text:'Good. Look around — name three things you can see. Take your time, no rush.' },
  { who:'chen', text:'the kettle. the window. a book on the floor' },
  { who:'maya', text:'Nice. Now two things you can hear.' },
  { who:'chen', text:'cars outside. the fridge' },
  { who:'maya', text:'And one thing you can feel — physical, on your body right now.' },
  { who:'chen', text:'the chair. cold under my feet' },
  { who:'maya', text:'You\'re here. Stay with that for a moment.\n\nWhen you\'re ready — Dr. Levin and I have your café exposure on the plan for late afternoon. We can talk about it now or later. No pressure either way.' },
  { who:'system', kind:'share-prompt', text:'Tend prepared a summary of last night\'s episode for Dr. Levin. Want to review what would be shared?' },
];

const QUICK_REPLIES = ['Walk me through the exposure', 'Not now', 'I need a minute', 'Something\'s off'];

function generateReply(input) {
  const lower = input.toLowerCase();
  if (lower.includes('exposure') || lower.includes('walk me')) {
    return [
      { who:'maya', text:'Okay. Café Albert, late afternoon, 20 minutes. Goal is to stay until your distress drops by half.\n\nBefore we plan it — what number is your distress right now, 0 to 10?', cta:'suds' },
      { who:'system', kind:'note', text:'Maya is following Dr. Levin\'s in-vivo exposure protocol.' },
    ];
  }
  if (lower.includes('off') || lower.includes('something')) {
    return [
      { who:'maya', text:'I\'m listening. Take your time.\n\nIf this feels like more than I should hold, the crisis line is one tap away — Dr. Levin asked me to make sure you know.' },
    ];
  }
  if (lower.includes('not now') || lower.includes('minute')) {
    return [{ who:'maya', text:'Of course. I\'ll be here.' }];
  }
  return [{ who:'maya', text:'Got it. Whenever you want to pick this back up — I\'m here.' }];
}

function Bubble({ m, go, setPendingShare }) {
  if (m.who === 'system' && m.kind === 'share-prompt') {
    return (
      <div style={{
        background:'#fff', border:`.5px solid ${P.panelEdgeStrong}`, borderRadius:12,
        padding:'12px 14px', margin:'10px 0',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6 }}>
          <PPill tone="amber">{PI.share(10)} Share with Maya?</PPill>
        </div>
        <div style={{ fontSize:13, color:P.fg, lineHeight:1.5, marginBottom:10 }}>{m.text}</div>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={() => { setPendingShare(0); go('shareOne'); }} style={{
            flex:1, height:34, borderRadius:8, fontSize:12.5, fontWeight:600,
            background:P.fg, color:P.bg, border:0, cursor:'pointer',
          }}>Review</button>
          <button style={{
            padding:'0 14px', height:34, borderRadius:8, fontSize:12.5,
            background:'transparent', color:P.muted, border:`.5px solid ${P.panelEdge}`, cursor:'pointer',
          }}>Not now</button>
        </div>
      </div>
    );
  }
  if (m.who === 'system' && m.kind === 'note') {
    return (
      <div style={{ fontSize:11, color:P.faint, fontStyle:'italic', textAlign:'center', padding:'4px 12px', margin:'4px 0' }}>
        {m.text}
      </div>
    );
  }
  const isMaya = m.who === 'maya';
  return (
    <div style={{
      display:'flex', justifyContent: isMaya ? 'flex-start' : 'flex-end',
      margin:'4px 0',
    }}>
      <div style={{
        maxWidth:'82%', padding:'9px 13px',
        borderRadius: isMaya ? '14px 14px 14px 4px' : '14px 14px 4px 14px',
        background: isMaya ? '#fff' : P.fg,
        color: isMaya ? P.fg : P.bg,
        fontSize:13.5, lineHeight:1.5,
        whiteSpace:'pre-wrap',
        border: isMaya ? `.5px solid ${P.panelEdge}` : 'none',
        fontFamily: isMaya ? P.serif : P.font,
        fontStyle: isMaya ? 'normal' : 'normal',
      }}>{m.text}</div>
    </div>
  );
}

function TypingDots() {
  return (
    <div style={{ display:'flex', padding:'4px 0', gap:4 }}>
      <div style={{
        background:'#fff', border:`.5px solid ${P.panelEdge}`,
        borderRadius:'14px 14px 14px 4px', padding:'10px 14px',
        display:'flex', gap:4,
      }}>
        {[0,1,2].map(i => (
          <span key={i} style={{
            width:6, height:6, borderRadius:'50%', background:P.faint,
            animation:`tend-bounce 1s ${i*0.15}s infinite`,
          }}/>
        ))}
        <style>{`@keyframes tend-bounce{0%,80%,100%{transform:translateY(0);opacity:.4}40%{transform:translateY(-4px);opacity:1}}`}</style>
      </div>
    </div>
  );
}

const iconBtnP = {
  width:32, height:32, borderRadius:'50%', border:0, background:'transparent',
  color:P.muted, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
};

// ─── PRESCRIPTIONS ───
function PPrescriptions({ go }) {
  const [tab, setTab] = React.useState('plan');
  return (
    <div style={{ flex:1, overflow:'auto', padding:'8px 20px 20px', position:'relative' }}>
      <div style={{ padding:'8px 0 14px' }}>
        <div style={{ fontSize:11.5, color:P.faint, fontWeight:500, letterSpacing:'.04em', textTransform:'uppercase' }}>Your plan from Dr. Levin</div>
        <h1 style={{ margin:'4px 0 6px', fontFamily:P.serif, fontWeight:400, fontSize:24, letterSpacing:'-0.01em' }}>
          Prolonged Exposure & sleep
        </h1>
        <div style={{ fontSize:12, color:P.muted }}>Approved Apr 28 · v3 · gentle pace</div>
      </div>

      <div style={{ display:'flex', gap:6, marginBottom:12 }}>
        {[['plan','This week'],['adh','How you\'re tracking']].map(([k, l]) => (
          <button key={k} onClick={() => k==='adh' ? go('adherence') : setTab(k)} style={{
            flex:1, padding:'8px 10px', fontSize:12.5, fontWeight:600,
            borderRadius:8, border:`.5px solid ${P.panelEdge}`,
            background: tab===k ? P.fg : P.panel, color: tab===k ? P.bg : P.muted,
            cursor:'pointer',
          }}>{l}</button>
        ))}
      </div>

      <Anno n={8} top={140} right={4}>
        <strong>Patient sees the same thing the clinician approved</strong> — but in plain language. No diagnostic codes, no jargon dump.
      </Anno>

      {/* Tasks */}
      <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:18 }}>
        {PRESCRIPTION.tasks.map(t => (
          <div key={t.id} style={{
            background:P.panel, border:`.5px solid ${P.panelEdge}`, borderRadius:12,
            padding:'14px',
          }}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:10 }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14.5, fontWeight:600, marginBottom:3 }}>{t.title}</div>
                <div style={{ fontSize:12, color:P.muted, display:'flex', gap:8, flexWrap:'wrap' }}>
                  <span>{t.cadence}</span>
                  <span>·</span>
                  <span>{t.duration}</span>
                </div>
              </div>
              <PPill tone={t.type==='exposure'?'sage':'neutral'}>{t.type}</PPill>
            </div>
            <div style={{ fontSize:13, color:P.muted, marginTop:8, lineHeight:1.55 }}>{t.detail}</div>
          </div>
        ))}
      </div>

      <SectionLabel>Things to avoid this phase</SectionLabel>
      <div style={{ background:P.panel, border:`.5px solid ${P.panelEdge}`, borderRadius:12, padding:'8px 14px' }}>
        {PRESCRIPTION.constraints.map((c, i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 0', borderBottom: i<PRESCRIPTION.constraints.length-1?`.5px solid ${P.panelEdge}`:0, fontSize:13 }}>
            {PI.lock(13)} {c}
          </div>
        ))}
      </div>

      <div style={{ height:14 }} />
      <SectionLabel>If things get heavy</SectionLabel>
      <div style={{ background:P.panel, border:`.5px solid ${P.panelEdge}`, borderRadius:12, padding:'12px 14px', fontSize:13, color:P.muted, lineHeight:1.55 }}>
        Maya can sit with you and walk through grounding. For crisis — strong urges to harm yourself, or it feels too big — Maya will hand off straight to a human line. Dr. Levin asked her to.
      </div>
    </div>
  );
}

// ─── ADHERENCE ───
function PAdherence({ go, adherenceMode }) {
  const offTrack = adherenceMode === 'off';
  const onTrack = adherenceMode === 'on';
  const score = onTrack ? 92 : offTrack ? 41 : 64;
  return (
    <div style={{ flex:1, overflow:'auto', padding:'8px 20px 20px' }}>
      <div style={{ padding:'8px 0 14px' }}>
        <div style={{ fontSize:11.5, color:P.faint, fontWeight:500, letterSpacing:'.04em', textTransform:'uppercase' }}>How you're tracking</div>
        <h1 style={{ margin:'4px 0', fontFamily:P.serif, fontWeight:400, fontSize:24, letterSpacing:'-0.01em' }}>
          {onTrack ? 'Steady week.' : offTrack ? 'A heavy week.' : 'Mixed week.'}
        </h1>
        <div style={{ fontSize:12.5, color:P.muted, lineHeight:1.5 }}>
          {onTrack
            ? 'You\'ve held the plan more than not. That counts.'
            : offTrack
            ? 'A lot got skipped. Not a verdict — just information for you and Dr. Levin.'
            : 'Some pieces happened, others didn\'t. Worth talking through.'}
        </div>
      </div>

      <div style={{ display:'flex', gap:8, marginBottom:14 }}>
        {[['plan','This week'],['adh','How you\'re tracking']].map(([k, l]) => (
          <button key={k} onClick={() => k==='plan' ? go('prescriptions') : null} style={{
            flex:1, padding:'8px 10px', fontSize:12.5, fontWeight:600,
            borderRadius:8, border:`.5px solid ${P.panelEdge}`,
            background: k==='adh' ? P.fg : P.panel, color: k==='adh' ? P.bg : P.muted,
            cursor:'pointer',
          }}>{l}</button>
        ))}
      </div>

      {/* Big circular score */}
      <div style={{
        background:P.panel, border:`.5px solid ${P.panelEdge}`, borderRadius:14,
        padding:'18px', display:'flex', alignItems:'center', gap:18, marginBottom:14,
      }}>
        <ScoreRing value={score} tone={onTrack?P.sage:offTrack?P.bad:P.amber} />
        <div>
          <div style={{ fontSize:11, color:P.faint, fontWeight:600, letterSpacing:'.04em', textTransform:'uppercase' }}>14-day rhythm</div>
          <div style={{ fontSize:13, color:P.muted, marginTop:6, lineHeight:1.5, maxWidth:160 }}>
            {onTrack ? 'You\'ve done what you set out to do — most days.' : offTrack ? 'Plan went sideways. The pattern is showing up at night.' : 'Mornings landed. Evenings drifted.'}
          </div>
        </div>
      </div>

      {/* Per-task strips */}
      <SectionLabel>Per practice</SectionLabel>
      <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:14 }}>
        {ADHERENCE_14D.rows.map((r, i) => {
          const values = onTrack
            ? r.values.map(v => v == null ? null : Math.max(v, 0.5))
            : offTrack
            ? r.values.map(v => v == null ? null : Math.min(v, 0.5))
            : r.values;
          return (
            <div key={i} style={{
              background:P.panel, border:`.5px solid ${P.panelEdge}`, borderRadius:10,
              padding:'10px 12px',
            }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                <span style={{ fontSize:12.5, fontWeight:500 }}>{r.task}</span>
                <span style={{ fontSize:11, color:P.faint }}>last 14 days</span>
              </div>
              <div style={{ display:'flex', gap:3 }}>
                {values.map((v, j) => (
                  <div key={j} style={{
                    flex:1, height:18, borderRadius:3,
                    background: v==null ? '#efe7d8'
                      : v===1 ? P.sage
                      : v===0.5 ? P.amber
                      : '#dccaca',
                    opacity: v==null ? .5 : 1,
                  }} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ background:P.sageSoft, border:`.5px solid rgba(90,122,94,.18)`, borderRadius:12, padding:'12px 14px', display:'flex', gap:10 }}>
        <MayaMark size={28} />
        <div style={{ fontFamily:P.serif, fontStyle:'italic', fontSize:14, lineHeight:1.5, color:P.fg }}>
          "{offTrack ? 'When the nights get hard, the next morning is the hardest place to start. We\'ll talk Tuesday.'
          : onTrack ? 'You\'re doing the work. Nothing flashy — just steady.'
          : 'The mornings are the strong piece. We\'ll build from there.'}"
        </div>
      </div>
    </div>
  );
}

function ScoreRing({ value, tone }) {
  const r = 36, c = 2 * Math.PI * r;
  const offset = c - (value/100) * c;
  return (
    <div style={{ position:'relative', width:90, height:90 }}>
      <svg width="90" height="90">
        <circle cx="45" cy="45" r={r} fill="none" stroke="#efe7d8" strokeWidth="7"/>
        <circle cx="45" cy="45" r={r} fill="none" stroke={tone} strokeWidth="7"
          strokeDasharray={c} strokeDashoffset={offset}
          strokeLinecap="round" transform="rotate(-90 45 45)"
          style={{ transition:'stroke-dashoffset .5s' }}/>
      </svg>
      <div style={{
        position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center',
        flexDirection:'column',
      }}>
        <div style={{ fontSize:24, fontWeight:600, fontVariantNumeric:'tabular-nums', letterSpacing:'-0.02em' }}>{value}<span style={{fontSize:12, color:P.faint}}>%</span></div>
      </div>
    </div>
  );
}

// ─── PROFILE ───
function PProfile({ go }) {
  return (
    <div style={{ flex:1, overflow:'auto', padding:'8px 20px 20px', position:'relative' }}>
      <div style={{ padding:'8px 0 14px' }}>
        <div style={{ fontSize:11.5, color:P.faint, fontWeight:500, letterSpacing:'.04em', textTransform:'uppercase' }}>Your profile</div>
        <h1 style={{ margin:'4px 0 4px', fontFamily:P.serif, fontWeight:400, fontSize:24, letterSpacing:'-0.01em' }}>
          What Tend knows about you
        </h1>
        <div style={{ fontSize:12.5, color:P.muted, lineHeight:1.5 }}>
          Everything Maya can see, in one place. You can change any of it.
        </div>
      </div>

      <Anno n={9} top={20} right={4}>
        <strong>Profile = transparency surface.</strong> The patient can see exactly what context flowed down from Dr. Levin into the on-device AI.
      </Anno>

      <ProfileCard title="From Dr. Levin" subtitle="Shared down to your device · Apr 28">
        <ProfileRow k="Diagnosis & phase" v="PTSD · Phase 2 (processing)" />
        <ProfileRow k="Trigger themes" v="Crowded indoor places, sudden loud sounds, scent of diesel" />
        <ProfileRow k="Grounding you prefer" v="3-2-1 sensory · cold water" />
        <ProfileRow k="What Maya may guide" v="Grounding, exposure walk-throughs, in-the-moment de-escalation" last />
      </ProfileCard>

      <div style={{ height:12 }} />
      <ProfileCard title="From you" subtitle="On your phone only">
        <ProfileRow k="Sleep average (7d)" v="4.2h" />
        <ProfileRow k="Episodes logged (7d)" v="3 · 2 shared" />
        <ProfileRow k="Mood check-ins (7d)" v="5/7" />
        <ProfileRow k="Things you don't want to talk about" v="The deployment itself · medication side-effects" last />
      </ProfileCard>

      <div style={{ height:12 }} />
      <button onClick={() => go('shares')} style={{
        width:'100%', padding:'12px', borderRadius:12,
        border:`.5px solid ${P.panelEdge}`, background:P.panel,
        display:'flex', alignItems:'center', gap:10, cursor:'pointer',
        textAlign:'left',
      }}>
        {PI.share(16)}
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13.5, fontWeight:600 }}>Everything you've shared up</div>
          <div style={{ fontSize:11.5, color:P.muted, marginTop:1 }}>5 items shared with Dr. Levin · 7 days</div>
        </div>
        {PI.arrow(14)}
      </button>

      <div style={{ height:8 }} />
      <button onClick={() => go('settings')} style={{
        width:'100%', padding:'12px', borderRadius:12,
        border:`.5px solid ${P.panelEdge}`, background:P.panel,
        display:'flex', alignItems:'center', gap:10, cursor:'pointer',
        textAlign:'left',
      }}>
        <div style={{ width:16, height:16, color:P.muted }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontSize:13.5, fontWeight:600 }}>Settings & integrations</div>
          <div style={{ fontSize:11.5, color:P.muted, marginTop:1 }}>Notifications, Apple Health, Fitbit</div>
        </div>
        {PI.arrow(14)}
      </button>
    </div>
  );
}

function ProfileCard({ title, subtitle, children }) {
  return (
    <div style={{ background:P.panel, border:`.5px solid ${P.panelEdge}`, borderRadius:12, padding:'12px 14px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:4 }}>
        <span style={{ fontSize:12.5, fontWeight:600 }}>{title}</span>
        <span style={{ fontSize:10.5, color:P.faint }}>{subtitle}</span>
      </div>
      {children}
    </div>
  );
}

function ProfileRow({ k, v, last }) {
  return (
    <div style={{ padding:'9px 0', borderBottom: last?0:`.5px solid ${P.panelEdge}` }}>
      <div style={{ fontSize:11, color:P.faint, fontWeight:500, letterSpacing:'.02em' }}>{k}</div>
      <div style={{ fontSize:13, color:P.fg, marginTop:2, lineHeight:1.5 }}>{v}</div>
    </div>
  );
}

// ─── SHARES (digest list + audit) ───
function PShares({ go }) {
  return (
    <div style={{ flex:1, overflow:'auto', padding:'8px 20px 20px', position:'relative' }}>
      <button onClick={() => go('home')} style={{
        background:'transparent', border:0, color:P.muted, fontSize:13, padding:'4px 0', cursor:'pointer',
        display:'inline-flex', alignItems:'center', gap:4,
      }}>{PI.back(14)} Today</button>

      <div style={{ padding:'8px 0 14px' }}>
        <div style={{ fontSize:11.5, color:P.faint, fontWeight:500, letterSpacing:'.04em', textTransform:'uppercase' }}>Share with Dr. Levin</div>
        <h1 style={{ margin:'4px 0', fontFamily:P.serif, fontWeight:400, fontSize:24, letterSpacing:'-0.01em' }}>
          Two waiting · five sent
        </h1>
        <div style={{ fontSize:12.5, color:P.muted, lineHeight:1.5 }}>
          Nothing leaves your phone unless you approve it. You can also see everything you've sent so far.
        </div>
      </div>

      <Anno n={10} top={50} right={0}>
        <strong>The digest.</strong> Periodic batched share moments, not just inline ones in chat.
      </Anno>

      <SectionLabel>Waiting on you</SectionLabel>
      <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:18 }}>
        {PENDING_SHARES.map((s, i) => (
          <button key={s.id} onClick={() => { window.__pendingIdx = i; go('shareOne'); }} style={{
            background:'#fff', border:`.5px solid ${P.panelEdgeStrong}`, borderRadius:12,
            padding:'12px 14px', textAlign:'left', cursor:'pointer', width:'100%',
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
              <PPill tone={s.kind==='episode'?'bad':'amber'}>{s.kind}</PPill>
              <span style={{ fontSize:11, color:P.faint, marginLeft:'auto' }}>{s.when}</span>
            </div>
            <div style={{ fontSize:14, fontWeight:600, marginBottom:4 }}>{s.title}</div>
            <div style={{ fontSize:12.5, color:P.muted, lineHeight:1.5 }}>
              {s.bullets.length} items · summary only · no transcript
            </div>
          </button>
        ))}
      </div>

      <SectionLabel>Already shared · 7 days</SectionLabel>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {SHARED_LOG.map(s => (
          <div key={s.id} style={{
            background:P.panel, border:`.5px solid ${P.panelEdge}`, borderRadius:10,
            padding:'10px 12px',
          }}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <span style={{ fontSize:12.5, fontWeight:500 }}>{s.summary}</span>
              <span style={{ fontSize:10.5, color:P.faint, marginLeft:'auto' }}>{s.when}</span>
            </div>
            <div style={{ fontSize:11.5, color:P.muted, marginTop:3, lineHeight:1.5 }}>{s.detail}</div>
          </div>
        ))}
      </div>

      <div style={{ height:14 }} />
      <button onClick={() => go('requestApprove')} style={{
        width:'100%', padding:'12px 14px', borderRadius:12,
        border:`.5px dashed ${P.panelEdgeStrong}`, background:'transparent',
        textAlign:'left', cursor:'pointer',
      }}>
        <div style={{ fontSize:12.5, fontWeight:600, marginBottom:3 }}>Dr. Levin asked for something</div>
        <div style={{ fontSize:11.5, color:P.muted }}>"Can I see the transcript of last night's episode?" — tap to review.</div>
      </button>
    </div>
  );
}

// ─── SHARE REVIEW (single item) ───
function PShareReview({ go, idx = 0 }) {
  const i = window.__pendingIdx != null ? window.__pendingIdx : idx;
  const s = PENDING_SHARES[i] || PENDING_SHARES[0];
  const [includeTranscript, setIncludeTranscript] = React.useState(false);
  const [included, setIncluded] = React.useState(s.bullets.map(() => true));
  const [stage, setStage] = React.useState('review'); // review | sent

  if (stage === 'sent') {
    return (
      <div style={{ flex:1, padding:'40px 24px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', textAlign:'center' }}>
        <div style={{ width:64, height:64, borderRadius:'50%', background:P.sageSoft, color:P.sage, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16 }}>
          {PI.check(28)}
        </div>
        <div style={{ fontFamily:P.serif, fontSize:22, marginBottom:8 }}>Sent to Dr. Levin.</div>
        <div style={{ fontSize:13, color:P.muted, lineHeight:1.5, maxWidth:280, marginBottom:18 }}>
          Stays in your share log. You can revoke any time before her next session.
        </div>
        <button onClick={() => go('home')} style={{
          padding:'10px 18px', borderRadius:8, fontSize:13, fontWeight:600,
          background:P.fg, color:P.bg, border:0, cursor:'pointer',
        }}>Back to today</button>
      </div>
    );
  }

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', minHeight:0, background:P.panel }}>
      <div style={{ padding:'10px 16px', display:'flex', alignItems:'center', gap:10, borderBottom:`.5px solid ${P.panelEdge}`, background:P.bg }}>
        <button onClick={() => go('shares')} style={iconBtnP}>{PI.close(20)}</button>
        <div style={{ flex:1, fontSize:13.5, fontWeight:600 }}>Share with Maya</div>
      </div>

      <div style={{ flex:1, overflow:'auto', padding:'14px 20px 18px', position:'relative' }}>
        <Anno n={11} top={4} right={4}>
          <strong>The consent moment.</strong> Bullet-level granular: Chen toggles each item, decides whether the transcript goes too. Nothing has left the phone yet.
        </Anno>

        <div style={{ fontFamily:P.serif, fontSize:22, lineHeight:1.25, marginBottom:6 }}>{s.title}</div>
        <div style={{ fontSize:12.5, color:P.muted, marginBottom:14 }}>From {s.when}. Maya prepared this. You decide what goes.</div>

        <SectionLabel>Summary · what Dr. Levin will see</SectionLabel>
        <div style={{ background:'#fff', border:`.5px solid ${P.panelEdge}`, borderRadius:12, overflow:'hidden', marginBottom:14 }}>
          {s.bullets.map((b, j) => (
            <label key={j} style={{
              display:'flex', alignItems:'flex-start', gap:10, padding:'12px 14px',
              borderBottom: j<s.bullets.length-1?`.5px solid ${P.panelEdge}`:0,
              cursor:'pointer',
            }}>
              <input
                type="checkbox" checked={included[j]}
                onChange={e => setIncluded(included.map((x, k) => k===j?e.target.checked:x))}
                style={{ marginTop:3 }}
              />
              <div style={{ flex:1, fontSize:13.5, color: included[j] ? P.fg : P.faint, lineHeight:1.5, textDecoration: included[j]?'none':'line-through' }}>
                {b}
              </div>
            </label>
          ))}
        </div>

        <SectionLabel>Also include?</SectionLabel>
        <div style={{ background:'#fff', border:`.5px solid ${P.panelEdge}`, borderRadius:12, padding:'10px 14px', marginBottom:18 }}>
          <label style={{ display:'flex', alignItems:'center', gap:10, cursor:'pointer' }}>
            <input type="checkbox" checked={includeTranscript} onChange={e => setIncludeTranscript(e.target.checked)} />
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:500 }}>Full transcript of conversation with Maya</div>
              <div style={{ fontSize:11.5, color:P.muted, marginTop:1 }}>Recommended <b>off</b> unless Dr. Levin specifically asked.</div>
            </div>
          </label>
        </div>

        <div style={{ background:P.sageSoft, border:`.5px solid rgba(90,122,94,.18)`, borderRadius:12, padding:'10px 14px', display:'flex', gap:10, fontSize:12, color:P.fg, lineHeight:1.5 }}>
          {PI.lock(14)}
          <div>
            Encrypted, sent only to Dr. Levin. You can revoke before Tuesday's session and it disappears from her view.
          </div>
        </div>
      </div>

      <div style={{ padding:'12px 16px 16px', borderTop:`.5px solid ${P.panelEdge}`, background:P.bg, display:'flex', gap:8 }}>
        <button onClick={() => go('shares')} style={{
          flex:1, height:42, borderRadius:10, fontSize:13, fontWeight:600,
          background:'transparent', color:P.muted, border:`.5px solid ${P.panelEdge}`, cursor:'pointer',
        }}>Not now</button>
        <button onClick={() => setStage('sent')} style={{
          flex:2, height:42, borderRadius:10, fontSize:13, fontWeight:600,
          background:P.fg, color:P.bg, border:0, cursor:'pointer',
        }}>Share with Maya</button>
      </div>
    </div>
  );
}

// ─── REQUEST APPROVAL (clinician asked for something) ───
function PRequestApprove({ go }) {
  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', minHeight:0, background:P.panel }}>
      <div style={{ padding:'10px 16px', display:'flex', alignItems:'center', gap:10, borderBottom:`.5px solid ${P.panelEdge}`, background:P.bg }}>
        <button onClick={() => go('shares')} style={iconBtnP}>{PI.close(20)}</button>
        <div style={{ flex:1, fontSize:13.5, fontWeight:600 }}>Dr. Levin's request</div>
      </div>
      <div style={{ flex:1, overflow:'auto', padding:'18px 20px' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
          <div style={{ width:40, height:40, borderRadius:'50%', background:'#d4ecec', color:'#0d6e6e', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:600, fontSize:14 }}>ML</div>
          <div>
            <div style={{ fontSize:13.5, fontWeight:600 }}>Dr. Maya Levin</div>
            <div style={{ fontSize:11, color:P.faint }}>Requested 22 min ago</div>
          </div>
        </div>
        <div style={{ background:'#fff', border:`.5px solid ${P.panelEdge}`, borderRadius:12, padding:'14px', marginBottom:14 }}>
          <div style={{ fontFamily:P.serif, fontSize:17, lineHeight:1.45, fontStyle:'italic' }}>
            "Hey Chen — could I see the full transcript of last night's episode? Helps me prepare for Tuesday. Totally fine to say no."
          </div>
        </div>
        <SectionLabel>What she's asking for</SectionLabel>
        <div style={{ background:'#fff', border:`.5px solid ${P.panelEdge}`, borderRadius:12, padding:'12px 14px', marginBottom:14 }}>
          <ProfileRow k="Item" v="Maya conversation transcript · 02:14–02:36 May 3" />
          <ProfileRow k="Scope" v="One-time view · auto-revokes after Tuesday's session" />
          <ProfileRow k="Why" v='"Helps me prepare"' last />
        </div>
        <div style={{ background:P.sageSoft, border:`.5px solid rgba(90,122,94,.18)`, borderRadius:12, padding:'10px 14px', display:'flex', gap:10, fontSize:12, color:P.fg, lineHeight:1.5 }}>
          {PI.lock(14)}
          <div>Saying no is fine. Dr. Levin will see "declined" — nothing else.</div>
        </div>
      </div>
      <div style={{ padding:'12px 16px 16px', borderTop:`.5px solid ${P.panelEdge}`, background:P.bg, display:'flex', gap:8 }}>
        <button onClick={() => go('shares')} style={{
          flex:1, height:42, borderRadius:10, fontSize:13, fontWeight:600,
          background:'transparent', color:P.muted, border:`.5px solid ${P.panelEdge}`, cursor:'pointer',
        }}>Decline</button>
        <button onClick={() => go('shares')} style={{
          flex:2, height:42, borderRadius:10, fontSize:13, fontWeight:600,
          background:P.fg, color:P.bg, border:0, cursor:'pointer',
        }}>Approve · share once</button>
      </div>
    </div>
  );
}

// ─── NOTIFICATIONS ───
function PNotifications({ go }) {
  const items = [
    { tone:'amber', title:'Two summaries ready to share', sub:'From last night & this morning · waiting on you', when:'30 min ago' },
    { tone:'sage', title:'Café exposure window', sub:'Late afternoon today (you set this with Dr. Levin)', when:'in 6h' },
    { tone:'neutral', title:'Maya updated your plan', sub:'Café scaled to late afternoon · approved Apr 28', when:'4d ago' },
    { tone:'neutral', title:'Morning grounding', sub:'5-min reminder · you said yes to this', when:'tomorrow 8:00' },
  ];
  return (
    <div style={{ flex:1, overflow:'auto', padding:'8px 20px 20px', position:'relative' }}>
      <button onClick={() => go('home')} style={{
        background:'transparent', border:0, color:P.muted, fontSize:13, padding:'4px 0', cursor:'pointer',
        display:'inline-flex', alignItems:'center', gap:4,
      }}>{PI.back(14)} Today</button>
      <div style={{ padding:'8px 0 14px' }}>
        <h1 style={{ margin:'4px 0', fontFamily:P.serif, fontWeight:400, fontSize:24, letterSpacing:'-0.01em' }}>
          Nudges
        </h1>
        <div style={{ fontSize:12.5, color:P.muted, lineHeight:1.5 }}>
          Only the ones you and Dr. Levin set up. Nothing chasing you.
        </div>
      </div>
      <Anno n={12} top={20} right={4}>
        <strong>Pull-first, with directed push.</strong> No "you've been quiet, want to talk?" notifications. Only consented, concrete cues.
      </Anno>
      <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
        {items.map((n, i) => (
          <div key={i} style={{
            background:P.panel, border:`.5px solid ${P.panelEdge}`, borderRadius:12,
            padding:'12px 14px', display:'flex', alignItems:'flex-start', gap:10,
          }}>
            <div style={{
              width:8, height:8, borderRadius:'50%', marginTop:6,
              background: n.tone==='amber'?P.amber:n.tone==='sage'?P.sage:P.faint,
            }}/>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13.5, fontWeight:500 }}>{n.title}</div>
              <div style={{ fontSize:12, color:P.muted, marginTop:2, lineHeight:1.5 }}>{n.sub}</div>
            </div>
            <div style={{ fontSize:10.5, color:P.faint, whiteSpace:'nowrap' }}>{n.when}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SETTINGS ───
function PSettings({ go }) {
  return (
    <div style={{ flex:1, overflow:'auto', padding:'8px 20px 20px' }}>
      <button onClick={() => go('profile')} style={{
        background:'transparent', border:0, color:P.muted, fontSize:13, padding:'4px 0', cursor:'pointer',
        display:'inline-flex', alignItems:'center', gap:4,
      }}>{PI.back(14)} You</button>
      <div style={{ padding:'8px 0 14px' }}>
        <h1 style={{ margin:'4px 0', fontFamily:P.serif, fontWeight:400, fontSize:24, letterSpacing:'-0.01em' }}>
          Settings
        </h1>
      </div>
      <SectionLabel>Integrations</SectionLabel>
      <div style={{ background:P.panel, border:`.5px solid ${P.panelEdge}`, borderRadius:12, overflow:'hidden', marginBottom:14 }}>
        {[
          ['Apple Health', 'Sleep & heart rate · connected', true],
          ['Fitbit', 'Not connected', false],
          ['Calendar', 'Sessions auto-added · connected', true],
          ['HMO pharmacy', 'Pull prescription history · not connected', false],
        ].map(([name, sub, on], i, arr) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', borderBottom: i<arr.length-1?`.5px solid ${P.panelEdge}`:0 }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13.5, fontWeight:500 }}>{name}</div>
              <div style={{ fontSize:11.5, color:P.muted }}>{sub}</div>
            </div>
            <Toggle on={on} />
          </div>
        ))}
      </div>
      <SectionLabel>Maya's voice</SectionLabel>
      <div style={{ background:P.panel, border:`.5px solid ${P.panelEdge}`, borderRadius:12, overflow:'hidden', marginBottom:14 }}>
        {[
          ['Voice modeling', 'Off · Maya types only', false],
          ['Persona name', 'Maya', null],
          ['Tone', 'Warm-direct (Dr. Levin\'s default)', null],
        ].map(([k, v, on], i, arr) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', borderBottom: i<arr.length-1?`.5px solid ${P.panelEdge}`:0 }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13.5, fontWeight:500 }}>{k}</div>
              <div style={{ fontSize:11.5, color:P.muted }}>{v}</div>
            </div>
            {on != null ? <Toggle on={on} /> : <span style={{ color:P.faint }}>{PI.arrow(14)}</span>}
          </div>
        ))}
      </div>
      <SectionLabel>Privacy</SectionLabel>
      <div style={{ background:P.panel, border:`.5px solid ${P.panelEdge}`, borderRadius:12, overflow:'hidden' }}>
        {[
          ['Conversations stay on this device', '', true],
          ['Auto-summarize for share review', 'Maya drafts; you approve', true],
          ['Allow Dr. Levin to request specific items', 'Each request needs your tap', true],
        ].map(([k, v, on], i, arr) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', borderBottom: i<arr.length-1?`.5px solid ${P.panelEdge}`:0 }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13.5, fontWeight:500 }}>{k}</div>
              {v && <div style={{ fontSize:11.5, color:P.muted }}>{v}</div>}
            </div>
            <Toggle on={on} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Toggle({ on }) {
  return (
    <div style={{
      width:36, height:20, borderRadius:999, padding:2,
      background: on ? P.sage : '#dccdb6',
      display:'flex', alignItems:'center', flexShrink:0,
      justifyContent: on ? 'flex-end' : 'flex-start',
    }}>
      <div style={{ width:16, height:16, borderRadius:'50%', background:'#fff' }}/>
    </div>
  );
}

window.PChat = PChat;
window.PPrescriptions = PPrescriptions;
window.PAdherence = PAdherence;
window.PProfile = PProfile;
window.PShares = PShares;
window.PShareReview = PShareReview;
window.PRequestApprove = PRequestApprove;
window.PNotifications = PNotifications;
window.PSettings = PSettings;
