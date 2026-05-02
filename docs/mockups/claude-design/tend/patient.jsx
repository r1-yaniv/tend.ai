// patient.jsx — Tend patient mobile app
// Aesthetic: warm, journal-like. Cream background, soft sage accent,
// serif for moments that feel personal (Maya's voice, prompts), sans for UI.

const P = {
  font: '"Inter", system-ui, -apple-system, sans-serif',
  serif: '"Instrument Serif", "Iowan Old Style", Georgia, serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
  // Warm cream palette
  bg: '#f6f1e8',
  panel: '#fbf7ef',
  panelEdge: 'rgba(74, 53, 30, 0.08)',
  panelEdgeStrong: 'rgba(74, 53, 30, 0.16)',
  fg: '#2a221b',
  muted: '#6b5b4a',
  faint: '#a89580',
  // Soft sage accent (Maya)
  sage: '#5a7a5e',
  sageSoft: '#e3ebe1',
  sageMid: '#a8bca7',
  // Warm secondary
  amber: '#a86b3c',
  amberSoft: '#f4e6d3',
  // Status
  ok: '#5a7a5e',
  warn: '#a86b3c',
  bad: '#9f3a3a',
};

// ─── primitives ───
function PPill({ tone='neutral', children, style }) {
  const palettes = {
    neutral:{ bg:'#efe7d8', fg:'#5b4a36', bd:'rgba(74,53,30,.08)' },
    sage:{ bg:P.sageSoft, fg:P.sage, bd:'rgba(90,122,94,.18)' },
    amber:{ bg:P.amberSoft, fg:P.amber, bd:'rgba(168,107,60,.2)' },
    bad:{ bg:'#f7dcdc', fg:P.bad, bd:'rgba(159,58,58,.18)' },
  };
  const p = palettes[tone] || palettes.neutral;
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:5,
      padding:'2px 8px', borderRadius:999, fontSize:11, fontWeight:500,
      background:p.bg, color:p.fg, border:`.5px solid ${p.bd}`,
      whiteSpace:'nowrap', ...style,
    }}>{children}</span>
  );
}

const PI = {
  back:(s=18)=> <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M15 6l-6 6 6 6"/></svg>,
  send:(s=18)=> <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><path d="M3 11.5l18-8-7 18-2.5-7.5L3 11.5z"/></svg>,
  more:(s=18)=> <svg width={s} height={s} viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>,
  close:(s=18)=> <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 6l12 12M18 6L6 18"/></svg>,
  check:(s=14)=> <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M5 12l5 5 9-11"/></svg>,
  share:(s=14)=> <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3v12M7 8l5-5 5 5M5 21h14"/></svg>,
  lock:(s=14)=> <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>,
  bell:(s=18)=> <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>,
  dot:(s=8)=> <svg width={s} height={s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="6" fill="currentColor"/></svg>,
  spark:(s=14)=> <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 4l1.8 4.5L18 10l-4.2 1.5L12 16l-1.8-4.5L6 10l4.2-1.5L12 4z"/></svg>,
  arrow:(s=14)=> <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>,
  plus:(s=18)=> <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 5v14M5 12h14"/></svg>,
};

// ─── shell ───
function PatientApp() {
  const [route, setRoute] = React.useState('home');
  // home | chat | prescriptions | adherence | profile | shares | shareOne | settings | notifications | requestApprove
  const [pendingShare, setPendingShare] = React.useState(0);

  const adherenceMode = window.__TEND_ADHERENCE || 'real';

  const go = setRoute;

  return (
    <div style={{
      width:'100%', height:'100%',
      background:P.bg, color:P.fg,
      font:`14px/1.5 ${P.font}`,
      display:'flex', flexDirection:'column',
      overflow:'hidden', position:'relative',
    }}>
      <PStatusBar />
      <div style={{ flex:1, display:'flex', flexDirection:'column', minHeight:0, position:'relative' }}>
        {route === 'home' && <PHome go={go} adherenceMode={adherenceMode} />}
        {route === 'chat' && <PChat go={go} setPendingShare={setPendingShare} />}
        {route === 'prescriptions' && <PPrescriptions go={go} />}
        {route === 'adherence' && <PAdherence go={go} adherenceMode={adherenceMode} />}
        {route === 'profile' && <PProfile go={go} />}
        {route === 'shares' && <PShares go={go} />}
        {route === 'shareOne' && <PShareReview go={go} idx={pendingShare} />}
        {route === 'settings' && <PSettings go={go} />}
        {route === 'notifications' && <PNotifications go={go} />}
        {route === 'requestApprove' && <PRequestApprove go={go} />}
      </div>
      {!['chat','shareOne','requestApprove'].includes(route) && (
        <PTabBar route={route} go={go} />
      )}
    </div>
  );
}

function PStatusBar() {
  return (
    <div style={{
      height:32, padding:'0 18px', display:'flex', alignItems:'center', justifyContent:'space-between',
      fontSize:12, fontWeight:600, color:P.fg, flexShrink:0, fontVariantNumeric:'tabular-nums',
    }}>
      <span>9:41</span>
      <div style={{ display:'flex', gap:6, alignItems:'center', opacity:.85 }}>
        <svg width="16" height="10" viewBox="0 0 16 10"><path d="M0 9h2V7H0v2zm3 0h2V5H3v4zm3 0h2V3H6v6zm3 0h2V1H9v8zm3 0h2v-7h-2v7z" fill="currentColor"/></svg>
        <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1"><path d="M1 4a8 8 0 0 1 12 0M3 6a5 5 0 0 1 8 0M5 8a2 2 0 0 1 4 0"/></svg>
        <svg width="22" height="10" viewBox="0 0 22 10"><rect x="0" y="1" width="18" height="8" rx="2" fill="none" stroke="currentColor" strokeWidth=".8"/><rect x="2" y="3" width="13" height="4" rx="1" fill="currentColor"/><rect x="19" y="3.5" width="1.5" height="3" fill="currentColor"/></svg>
      </div>
    </div>
  );
}

function PTabBar({ route, go }) {
  const tabs = [
    { id:'home',  label:'Today',  icon: home => <svg width="18" height="18" viewBox="0 0 24 24" fill={home?'currentColor':'none'} stroke="currentColor" strokeWidth="1.6"><path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-5v-7H10v7H5a1 1 0 0 1-1-1v-9z"/></svg> },
    { id:'chat',  label:'Maya',   icon: home => <svg width="18" height="18" viewBox="0 0 24 24" fill={home?'currentColor':'none'} stroke="currentColor" strokeWidth="1.6"><path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-7l-4 4v-4H6a2 2 0 0 1-2-2V6z"/></svg> },
    { id:'prescriptions', label:'Plan', icon: home => <svg width="18" height="18" viewBox="0 0 24 24" fill={home?'currentColor':'none'} stroke="currentColor" strokeWidth="1.6"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></svg> },
    { id:'profile', label:'You',  icon: home => <svg width="18" height="18" viewBox="0 0 24 24" fill={home?'currentColor':'none'} stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg> },
  ];
  return (
    <div style={{
      flexShrink:0, padding:'8px 16px 14px',
      borderTop:`.5px solid ${P.panelEdge}`,
      background:P.bg,
      display:'flex', justifyContent:'space-around', alignItems:'center',
    }}>
      {tabs.map(t => {
        const active = route === t.id || (t.id==='prescriptions' && route==='adherence');
        return (
          <button key={t.id} onClick={() => go(t.id)} style={{
            background:'transparent', border:0, cursor:'pointer',
            display:'flex', flexDirection:'column', alignItems:'center', gap:3,
            color: active ? P.sage : P.faint,
            padding:'4px 10px',
          }}>
            {t.icon(active)}
            <span style={{ fontSize:10, fontWeight: active ? 600 : 500 }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── HOME ───
function PHome({ go, adherenceMode }) {
  const greeting = 'Good morning, Chen.';
  const onTrack = adherenceMode === 'on';
  const offTrack = adherenceMode === 'off';

  // Today's prescribed items
  const today = [
    { id:'morning', title:'Morning grounding', dur:'5 min', state: offTrack ? 'pending' : 'done', type:'continuous' },
    { id:'imag', title:'Imaginal exposure', dur:'30 min', state: offTrack ? 'pending' : 'pending', when:'flexible', type:'exposure' },
    { id:'cafe', title:'Café Albert · late afternoon', dur:'20 min', state:'pending', when:'17:00', type:'exposure' },
  ];

  return (
    <div style={{ flex:1, overflow:'auto', padding:'8px 20px 20px', position:'relative' }}>
      <Anno n={6} top={20} right={10}>
        <strong>Pull-first home.</strong> No streaks, no points. Just today's plan and what Chen feels like attending to. Maya is one tap away but doesn't push notifications unless he asked her to.
      </Anno>

      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 0 18px' }}>
        <div>
          <div style={{ fontSize:11.5, color:P.faint, fontWeight:500, letterSpacing:'.04em', textTransform:'uppercase' }}>Sun · May 3</div>
          <h1 style={{ margin:'4px 0 0', fontFamily:P.serif, fontWeight:400, fontSize:26, letterSpacing:'-0.01em' }}>
            {greeting}
          </h1>
        </div>
        <button onClick={() => go('notifications')} style={{
          width:36, height:36, borderRadius:'50%', border:`.5px solid ${P.panelEdge}`,
          background:P.panel, color:P.muted, cursor:'pointer',
          display:'flex', alignItems:'center', justifyContent:'center', position:'relative',
        }}>
          {PI.bell(16)}
          <span style={{
            position:'absolute', top:6, right:8, width:7, height:7, borderRadius:'50%',
            background:P.amber, border:`1px solid ${P.panel}`,
          }}/>
        </button>
      </div>

      {/* Pending share request — load-bearing for the demo */}
      <div style={{
        background:'#fff', border:`.5px solid ${P.panelEdgeStrong}`, borderRadius:14,
        padding:'14px 14px 12px', marginBottom:14,
        boxShadow:'0 1px 0 rgba(74,53,30,.04)',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:6 }}>
          <PPill tone="amber">{PI.share(11)} 2 things ready to share with Maya</PPill>
        </div>
        <div style={{ fontSize:13.5, color:P.fg, lineHeight:1.5, marginBottom:10 }}>
          Tend prepared summaries from last night and this morning. Nothing has left your phone yet — review what you'd like Maya to see.
        </div>
        <button onClick={() => go('shares')} style={{
          width:'100%', height:38, borderRadius:8, fontSize:13, fontWeight:600,
          background:P.fg, color:P.bg, border:0, cursor:'pointer',
          display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6,
        }}>Review {PI.arrow(13)}</button>
      </div>

      {/* Maya, the companion (subtle) */}
      <div onClick={() => go('chat')} style={{
        display:'flex', gap:12, alignItems:'center',
        background:P.sageSoft, border:`.5px solid rgba(90,122,94,.18)`, borderRadius:14,
        padding:'14px', marginBottom:18, cursor:'pointer',
      }}>
        <MayaMark size={42} />
        <div style={{ flex:1 }}>
          <div style={{ fontSize:11.5, color:P.sage, fontWeight:600, letterSpacing:'.02em' }}>MAYA · YOUR COMPANION</div>
          <div style={{ fontFamily:P.serif, fontSize:17, lineHeight:1.3, marginTop:2, fontStyle:'italic', color:P.fg }}>
            "Whenever you're ready — I'm here."
          </div>
        </div>
        <div style={{ color:P.sage }}>{PI.arrow(16)}</div>
      </div>

      {/* Today's plan */}
      <SectionLabel>Today's plan</SectionLabel>
      <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:18 }}>
        {today.map(item => (
          <TodayItem key={item.id} item={item} onOpen={() => go('chat')} />
        ))}
        <button onClick={() => go('prescriptions')} style={{
          background:'transparent', border:0, color:P.muted, cursor:'pointer',
          fontSize:12.5, padding:'6px 0', textAlign:'left',
        }}>See full plan from Maya →</button>
      </div>

      {/* Quick check-in */}
      <SectionLabel>Quick check-in</SectionLabel>
      <div style={{
        background:P.panel, border:`.5px solid ${P.panelEdge}`, borderRadius:14,
        padding:'14px',
      }}>
        <div style={{ fontSize:13.5, color:P.fg, marginBottom:10 }}>How's the morning so far?</div>
        <div style={{ display:'flex', gap:6, justifyContent:'space-between' }}>
          {['😞','🙁','😐','🙂','😊'].map((e, i) => (
            <button key={i} style={{
              flex:1, aspectRatio:'1/1', maxWidth:48, borderRadius:10,
              border:`.5px solid ${P.panelEdge}`, background:'#fff',
              fontSize:18, cursor:'pointer',
            }}>{e}</button>
          ))}
        </div>
        <div style={{ fontSize:11.5, color:P.faint, marginTop:8, display:'flex', alignItems:'center', gap:6 }}>
          {PI.lock(11)} Stays on your phone unless you choose to share.
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize:11, fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase',
      color:P.faint, padding:'2px 0 8px',
    }}>{children}</div>
  );
}

function TodayItem({ item, onOpen }) {
  const isDone = item.state === 'done';
  return (
    <div onClick={onOpen} style={{
      display:'flex', alignItems:'center', gap:12,
      background:P.panel, border:`.5px solid ${P.panelEdge}`, borderRadius:12,
      padding:'12px 14px', cursor:'pointer',
    }}>
      <div style={{
        width:22, height:22, borderRadius:'50%', flexShrink:0,
        border: isDone ? 0 : `1.5px solid ${P.panelEdgeStrong}`,
        background: isDone ? P.sage : 'transparent',
        color: isDone ? '#fff' : 'transparent',
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        {isDone && PI.check(13)}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:13.5, fontWeight:500, color: isDone ? P.faint : P.fg, textDecoration: isDone ? 'line-through' : 'none' }}>
          {item.title}
        </div>
        <div style={{ fontSize:11.5, color:P.faint, marginTop:2, display:'flex', gap:8 }}>
          <span>{item.dur}</span>
          {item.when && <span>· {item.when}</span>}
          {item.type==='exposure' && <PPill tone="sage" style={{ fontSize:9.5, padding:'1px 6px' }}>exposure</PPill>}
        </div>
      </div>
      <div style={{ color:P.faint }}>{PI.arrow(14)}</div>
    </div>
  );
}

function MayaMark({ size = 36 }) {
  return (
    <div style={{
      width:size, height:size, borderRadius:'50%',
      background: 'radial-gradient(circle at 30% 30%, #b9d0bb, #6f8d72 70%)',
      display:'flex', alignItems:'center', justifyContent:'center',
      color:'#fff', fontFamily:P.serif, fontSize:Math.round(size*0.5), fontStyle:'italic',
      flexShrink:0,
      boxShadow:'inset 0 -2px 4px rgba(0,0,0,.1), inset 0 1px 1px rgba(255,255,255,.3)',
    }}>m</div>
  );
}

window.PatientApp = PatientApp;
window.PMayaMark = MayaMark;
window.PStatusBar = PStatusBar;
window.P = P;
window.PI = PI;
window.PPill = PPill;
window.SectionLabel = SectionLabel;
