// clinician.jsx — Tend clinician web app (desktop)
// Aesthetic: clinical/medical, calm, restrained accent, mostly grayscale + a single
// muted teal accent. Lots of whitespace. Dense data well-presented.

const C = {
  // Type: SF Pro / Inter; feels like modern EHR but cleaner.
  font: '"Inter", system-ui, -apple-system, sans-serif',
  serif: '"Instrument Serif", "Iowan Old Style", Georgia, serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
  // Cool neutrals
  bg: '#f7f7f5',
  panel: '#ffffff',
  border: 'rgba(15,23,42,0.08)',
  borderStrong: 'rgba(15,23,42,0.14)',
  fg: '#0f172a',
  muted: '#475569',
  faint: '#94a3b8',
  // Accent: muted slate-teal
  accent: '#0d6e6e',
  accentSoft: '#e6f0f0',
  // Status
  ok: '#059669',
  okSoft: '#ecfdf5',
  warn: '#b45309',
  warnSoft: '#fef3c7',
  bad: '#b91c1c',
  badSoft: '#fee2e2',
};

// ───────────────── primitives ─────────────────

function Pill({ tone='neutral', children, style }) {
  const palettes = {
    neutral: { bg:'#f1f5f9', fg:'#334155', bd:'rgba(15,23,42,.06)' },
    ok: { bg:C.okSoft, fg:C.ok, bd:'rgba(5,150,105,.18)' },
    warn:{ bg:C.warnSoft, fg:C.warn, bd:'rgba(180,83,9,.2)' },
    bad: { bg:C.badSoft, fg:C.bad, bd:'rgba(185,28,28,.18)' },
    accent:{ bg:C.accentSoft, fg:C.accent, bd:'rgba(13,110,110,.18)' },
  };
  const p = palettes[tone] || palettes.neutral;
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:6,
      padding:'2px 8px', borderRadius:999, fontSize:11, fontWeight:500,
      background:p.bg, color:p.fg, border:`.5px solid ${p.bd}`,
      whiteSpace:'nowrap', ...style
    }}>{children}</span>
  );
}

function Avatar({ initials, size=28, tone='slate', photo }) {
  const tones = {
    slate:['#e2e8f0','#334155'],
    teal:['#d4ecec','#0d6e6e'],
    amber:['#fde68a','#92400e'],
    rose:['#fecdd3','#9f1239'],
    blue:['#dbeafe','#1e40af'],
    violet:['#ede9fe','#5b21b6'],
    green:['#d1fae5','#065f46'],
    stone:['#e7e5e4','#44403c'],
  };
  const [bg, fg] = tones[tone] || tones.slate;
  if (photo) {
    return (
      <div style={{
        width:size, height:size, borderRadius:'50%',
        backgroundImage:`url(${photo})`, backgroundSize:'cover', backgroundPosition:'center 20%',
        flexShrink:0, border:`.5px solid ${C.border}`,
      }} />
    );
  }
  return (
    <div style={{
      width:size, height:size, borderRadius:'50%', background:bg, color:fg,
      display:'flex', alignItems:'center', justifyContent:'center',
      fontWeight:600, fontSize:Math.round(size*0.4),
      flexShrink:0,
    }}>{initials}</div>
  );
}

const TONE_BY_PATIENT = {
  chen:'teal', rachel:'violet', marcus:'blue', tyler:'amber',
  jenna:'rose', devon:'green', paige:'stone', ethan:'slate',
};

// Sparkline-ish 14-day adherence bar
function AdherenceBar({ value, status }) {
  const tone = status === 'attention' ? C.warn : C.ok;
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, minWidth:120 }}>
      <div style={{
        flex:1, height:6, background:'#e2e8f0', borderRadius:999, overflow:'hidden',
      }}>
        <div style={{
          width:`${value}%`, height:'100%', background:tone, borderRadius:999,
          transition:'width .3s',
        }} />
      </div>
      <span style={{ fontSize:12, color:C.muted, fontVariantNumeric:'tabular-nums', minWidth:28, textAlign:'right' }}>
        {value}%
      </span>
    </div>
  );
}

// Tiny inline icons (kept minimal — no icon libs)
const I = {
  search: (s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>,
  bell:   (s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>,
  arrowR: (s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>,
  arrowU: (s=12) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 19V5M5 12l7-7 7 7"/></svg>,
  arrowD: (s=12) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>,
  flat:   (s=12) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/></svg>,
  dot:    (s=8)  => <svg width={s} height={s} viewBox="0 0 24 24"><circle cx="12" cy="12" r="6" fill="currentColor"/></svg>,
  sparkles: (s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8"/></svg>,
  check:  (s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12l5 5 9-11"/></svg>,
  upload: (s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 16V4M6 10l6-6 6 6M4 20h16"/></svg>,
  plus:   (s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>,
  edit:   (s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 20h4l11-11-4-4L4 16v4z"/></svg>,
  shield: (s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z"/></svg>,
  lock:   (s=14) => <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>,
};

// ───────────────── shell ─────────────────

function ClinicianApp() {
  const initialRoute = (() => {
    try {
      const r = new URLSearchParams(window.location.search).get('route');
      const valid = ['dashboard','patient','prescribe','shares','context'];
      return valid.includes(r) ? r : 'dashboard';
    } catch (e) { return 'dashboard'; }
  })();
  const [route, setRoute] = React.useState(initialRoute);
  // route: 'dashboard' | 'patient' | 'prescribe' | 'shares' | 'context'
  const [filter, setFilter] = React.useState('all');

  // Adherence override (from tweaks): null | 'on' | 'off'
  const adherenceMode = window.__TEND_ADHERENCE || 'real';

  const goPatient = () => setRoute('patient');
  const goPrescribe = () => setRoute('prescribe');

  return (
    <div style={{
      width:'100%', height:'100%',
      display:'flex', background:C.bg, color:C.fg,
      font:`13px/1.45 ${C.font}`, position:'relative', overflow:'hidden',
    }}>
      <Sidebar route={route} setRoute={setRoute} />
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        <TopBar route={route} setRoute={setRoute} />
        <div style={{ flex:1, overflow:'auto', position:'relative' }}>
          {route === 'dashboard' && <Dashboard filter={filter} setFilter={setFilter} onPatient={goPatient} adherenceMode={adherenceMode} />}
          {route === 'patient'   && <PatientDetail onPrescribe={goPrescribe} onBack={() => setRoute('dashboard')} adherenceMode={adherenceMode} />}
          {route === 'prescribe' && <PrescriptionAuthoring onBack={() => setRoute('patient')} />}
          {route === 'shares'    && <SharesInbox onBack={() => setRoute('patient')} />}
          {route === 'context'   && <ContextSharing onBack={() => setRoute('patient')} />}
        </div>
      </div>
      <CrossTooltip target="clinician" onAction={(a) => a && a.route && setRoute(a.route)} />
      <LocalToast />
    </div>
  );
}

// ───────────────── sidebar / topbar ─────────────────

function Sidebar({ route, setRoute }) {
  const [profileOpen, setProfileOpen] = React.useState(false);
  const NavItem = ({ id, label, count, dataAttr }) => {
    const active = route === id;
    const extra = dataAttr ? { [dataAttr]: '' } : {};
    return (
      <button
        onClick={() => setRoute(id)}
        {...extra}
        style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          width:'100%', padding:'7px 10px', borderRadius:6,
          background: active ? '#fff' : 'transparent',
          border: active ? `.5px solid ${C.border}` : '.5px solid transparent',
          boxShadow: active ? '0 1px 2px rgba(15,23,42,.04)' : 'none',
          color: active ? C.fg : C.muted,
          fontWeight: active ? 600 : 500,
          fontSize:12.5, cursor:'pointer', textAlign:'left',
        }}>
        <span>{label}</span>
        {count != null && (
          <span style={{
            fontSize:10, color:C.faint, fontVariantNumeric:'tabular-nums',
          }}>{count}</span>
        )}
      </button>
    );
  };

  return (
    <aside style={{
      width:216, flexShrink:0, background:'#f1efea',
      borderRight:`.5px solid ${C.border}`,
      padding:'14px 12px', display:'flex', flexDirection:'column', gap:14,
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, padding:'2px 6px' }}>
        <TendMark size={22} />
        <span style={{ fontFamily:C.serif, fontSize:18, fontWeight:500, letterSpacing:'-0.01em' }}>Tend</span>
        <span style={{ fontSize:9, fontWeight:600, padding:'2px 5px', borderRadius:4, background:'#e6f0f0', color:C.accent, marginLeft:'auto' }}>CLINICIAN</span>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:1 }}>
        <NavLabel>Workspace</NavLabel>
        <NavItem id="dashboard" label="Patients" count={8} />
        <NavItem id="shares"    label="Inbox · shares" count={2} dataAttr="data-shares-nav" />
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:1 }}>
        <NavLabel>Today</NavLabel>
        <SidebarSession when="10:00" who="Chen Avraham" active={route==='patient'} />
        <SidebarSession when="14:30" who="Rachel Bennett" />
        <SidebarSession when="16:00" who="Jenna Reed" />
      </div>

      <div style={{ marginTop:'auto', position:'relative' }}>
        {profileOpen && <ClinicianProfilePopover onClose={() => setProfileOpen(false)} />}
        <button
          onClick={() => setProfileOpen(o => !o)}
          data-clinician-profile
          style={{
            width:'100%', padding:'10px 8px',
            borderTop:`.5px solid ${C.border}`,
            display:'flex', alignItems:'center', gap:9,
            background: profileOpen ? '#fff' : 'transparent',
            border:0, borderTop:`.5px solid ${C.border}`,
            cursor:'pointer', textAlign:'left',
          }}>
          <Avatar size={28} photo={CLINICIAN.photo} />
          <div style={{ minWidth:0, flex:1 }}>
            <div style={{ fontSize:12, fontWeight:600, lineHeight:1.2 }}>{CLINICIAN.shortName}</div>
            <div style={{ fontSize:10.5, color:C.faint }}>LCSW · Trauma & PTSD</div>
          </div>
          <span style={{ fontSize:9, color:C.faint }}>⋯</span>
        </button>
      </div>
    </aside>
  );
}

function NavLabel({ children }) {
  return (
    <div style={{
      fontSize:9.5, fontWeight:600, letterSpacing:'.08em',
      textTransform:'uppercase', color:C.faint, padding:'2px 6px 4px',
    }}>{children}</div>
  );
}

function ClinicianProfilePopover({ onClose }) {
  // Pop up above the avatar button. Positioned absolute within the wrapping container.
  return (
    <>
      <div onClick={onClose} style={{
        position:'fixed', inset:0, zIndex:40,
      }} />
      <div style={{
        position:'absolute', bottom:'calc(100% + 6px)', left:8, right:8,
        background:'#fff', border:`.5px solid ${C.border}`,
        borderRadius:10, boxShadow:'0 12px 36px rgba(15,23,42,.18)',
        padding:'14px', zIndex:41,
        animation:'tend-pop .15s ease-out',
      }}>
        <style>{`@keyframes tend-pop { from { opacity:0; transform: translateY(4px); } }`}</style>
        <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:10 }}>
          <Avatar size={42} photo={CLINICIAN.photo} />
          <div style={{ minWidth:0, flex:1 }}>
            <div style={{ fontSize:13, fontWeight:600, lineHeight:1.2 }}>{CLINICIAN.name}</div>
            <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{CLINICIAN.title}</div>
          </div>
        </div>

        {/* Voice clone block */}
        <div style={{
          background:'#f4f1ec', border:`.5px solid ${C.border}`, borderRadius:8,
          padding:'10px 12px', marginBottom:10,
        }}>
          <div style={{ fontSize:9.5, color:C.faint, fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:4 }}>
            Your voice clone · powered by Delphi
          </div>
          <div style={{ fontSize:11.5, color:C.fg, lineHeight:1.5 }}>
            Patients meet <b>Shari</b>, an AI in your voice and manner. She runs only inside the protocols you've approved, never starts trauma processing, and hands off to you on any escalation.
          </div>
          <div style={{ display:'flex', gap:6, marginTop:8 }}>
            <button style={popBtn}>Manage voice & persona</button>
            <button style={popBtnGhost}>Listen to a sample</button>
          </div>
        </div>

        {/* Quick stats */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
          <ProfileStat label="Active patients" value="24" />
          <ProfileStat label="Between-visit hrs / wk" value="11.5" />
        </div>

        {/* Menu */}
        <div style={{ display:'flex', flexDirection:'column', borderTop:`.5px solid ${C.border}`, margin:'0 -14px -14px', padding:'4px 0' }}>
          <ProfileMenu label="Caseload settings" />
          <ProfileMenu label="Notification rules" />
          <ProfileMenu label="Billing & payouts" />
          <ProfileMenu label="Sign out" tone="danger" />
        </div>
      </div>
    </>
  );
}

const popBtn = {
  fontSize:11, fontWeight:600, padding:'5px 9px', borderRadius:5,
  background:'#1c1917', color:'#fff', border:0, cursor:'pointer',
};
const popBtnGhost = {
  fontSize:11, fontWeight:500, padding:'5px 9px', borderRadius:5,
  background:'#fff', color:'#1c1917', border:`.5px solid ${C.border}`, cursor:'pointer',
};

function ProfileStat({ label, value }) {
  return (
    <div style={{ background:'#fff', border:`.5px solid ${C.border}`, borderRadius:8, padding:'8px 10px' }}>
      <div style={{ fontSize:9.5, color:C.faint, fontWeight:600, letterSpacing:'.08em', textTransform:'uppercase' }}>{label}</div>
      <div style={{ fontSize:18, fontWeight:600, marginTop:2, fontVariantNumeric:'tabular-nums' }}>{value}</div>
    </div>
  );
}

function ProfileMenu({ label, tone }) {
  return (
    <button style={{
      background:'transparent', border:0, padding:'8px 14px', textAlign:'left',
      fontSize:12, color: tone==='danger' ? '#9f3a3a' : C.fg, cursor:'pointer',
    }}>{label}</button>
  );
}

function NavLabelDUPE_REMOVE({ children }) {
  return null;
}


function SidebarSession({ when, who, active }) {
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:8, padding:'5px 10px',
      borderRadius:6, fontSize:12,
      background: active ? '#fff' : 'transparent',
      border: active ? `.5px solid ${C.border}` : '.5px solid transparent',
    }}>
      <span style={{ fontFamily:C.mono, fontSize:10.5, color:C.faint, fontVariantNumeric:'tabular-nums' }}>{when}</span>
      <span style={{ color: active ? C.fg : C.muted, fontWeight: active ? 600 : 500 }}>{who}</span>
    </div>
  );
}

function TendMark({ size=22 }) {
  return (
    <div style={{
      width:size, height:size, borderRadius:7,
      background:'linear-gradient(135deg, #0d6e6e, #084c4c)',
      display:'flex', alignItems:'center', justifyContent:'center',
      color:'#fff', fontFamily:C.serif, fontSize:Math.round(size*0.62), fontStyle:'italic',
      boxShadow:'inset 0 -1px 2px rgba(0,0,0,.15), inset 0 1px 0 rgba(255,255,255,.18)',
    }}>t</div>
  );
}

function TopBar({ route, setRoute }) {
  const titles = {
    dashboard: 'Patients',
    patient: 'Chen Avraham',
    prescribe: 'Prescription · Chen Avraham',
    shares: 'Inbox · shares',
    context: 'Context · Chen Avraham',
  };
  const crumbs = {
    patient: [{label:'Patients', onClick:() => setRoute('dashboard')}],
    prescribe: [{label:'Patients', onClick:() => setRoute('dashboard')}, {label:'Chen Avraham', onClick:() => setRoute('patient')}],
    context: [{label:'Patients', onClick:() => setRoute('dashboard')}, {label:'Chen Avraham', onClick:() => setRoute('patient')}],
  }[route];

  return (
    <header style={{
      height:52, background:'#fff', borderBottom:`.5px solid ${C.border}`,
      display:'flex', alignItems:'center', padding:'0 22px', gap:14, flexShrink:0,
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:8 }}>
        {crumbs && crumbs.map((c, i) => (
          <React.Fragment key={i}>
            <button onClick={c.onClick} style={{
              background:'none', border:0, color:C.muted, fontSize:13, padding:0, cursor:'pointer',
            }}>{c.label}</button>
            <span style={{ color:C.faint }}>/</span>
          </React.Fragment>
        ))}
        <span style={{ fontSize:14, fontWeight:600 }}>{titles[route]}</span>
      </div>

      <div style={{ flex:1 }} />

      <div style={{
        display:'flex', alignItems:'center', gap:6,
        padding:'5px 10px', borderRadius:7, background:'#f1f5f9',
        border:`.5px solid ${C.border}`, color:C.muted, fontSize:12, width:240,
      }}>
        {I.search(13)}
        <span style={{ color:C.faint }}>Search patients, notes…</span>
        <span style={{ marginLeft:'auto', fontFamily:C.mono, fontSize:10, color:C.faint }}>⌘K</span>
      </div>

      <button style={iconBtn}>{I.bell()}</button>
    </header>
  );
}

const iconBtn = {
  width:30, height:30, borderRadius:7, border:`.5px solid ${C.border}`,
  background:'#fff', color:C.muted, display:'flex', alignItems:'center', justifyContent:'center',
  cursor:'pointer',
};

// ───────────────── DASHBOARD ─────────────────

function Dashboard({ filter, setFilter, onPatient, adherenceMode }) {
  const overrides = {
    on: { adherence: 92, status: 'on-track', summary: 'All exposures complete this week. Sleep stable 6.4h avg. Mood trending up.', flag: null, trend:'up' },
    off:{ adherence: 41, status: 'attention', summary: 'Skipped all in-vivo exposures this week. Sleep <4h on 4 nights. Two episodes.', flag:'No journal entries 3d. Two episodes shared. Imaginal exposure declined.', trend:'down' },
  };

  const patients = PATIENTS.map(p => {
    if (p.id === 'chen' && (adherenceMode === 'on' || adherenceMode === 'off')) {
      return { ...p, ...overrides[adherenceMode] };
    }
    return p;
  });

  const filtered = patients.filter(p =>
    filter === 'all' ? true :
    filter === 'attention' ? p.status === 'attention' :
    filter === 'pre-session' ? ['chen','noa','tamar'].includes(p.id) :
    filter === 'no-engagement' ? (p.id === 'tyler') :
    true
  );

  const counts = {
    all: patients.length,
    attention: patients.filter(p => p.status === 'attention').length,
    'pre-session': 3,
    'no-engagement': 1,
  };

  return (
    <div style={{ padding:'18px 22px 28px', position:'relative' }}>
      <Anno n={1} top={20} left={-22}>
        <strong>Pull-first dashboard.</strong> No notification firehose — patients surface only when their prescription deviation crosses the threshold the clinician defined.
      </Anno>

      {/* Top metrics */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:12, marginBottom:18 }}>
        <Stat label="Active patients" value="8" sub="2 added this month" />
        <Stat label="Need attention" value={counts.attention} sub="Adherence drift" tone="warn" />
        <Stat label="This week's sessions" value="11" sub="3 today" />
        <Stat label="Avg adherence" value="72%" sub="+4 vs last week" tone="ok" trend="up" />
      </div>

      {/* Filters */}
      <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:14, flexWrap:'wrap' }}>
        <span style={{ fontSize:11, color:C.faint, fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase', marginRight:6 }}>Smart filters</span>
        {[
          ['all','All'],
          ['attention','Needs attention'],
          ['pre-session','Session in 24h'],
          ['no-engagement','No engagement 72h'],
        ].map(([k, label]) => (
          <button key={k} onClick={() => setFilter(k)} style={{
            padding:'4px 10px', borderRadius:999, fontSize:11.5, fontWeight:500,
            border:`.5px solid ${filter===k ? C.fg : C.border}`,
            background: filter===k ? C.fg : '#fff',
            color: filter===k ? '#fff' : C.fg,
            cursor:'pointer', display:'inline-flex', alignItems:'center', gap:6,
          }}>
            {label}
            <span style={{ fontSize:10, opacity:.7 }}>{counts[k]}</span>
          </button>
        ))}
      </div>

      {/* Patient list */}
      <div style={{
        background:'#fff', border:`.5px solid ${C.border}`, borderRadius:10,
        overflow:'hidden', position:'relative',
      }}>
        <div style={{
          display:'grid',
          gridTemplateColumns:'minmax(200px,1.4fr) 90px minmax(140px,1.1fr) minmax(220px,2fr) 110px 30px',
          gap:14, padding:'9px 16px', borderBottom:`.5px solid ${C.border}`,
          fontSize:10, fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase',
          color:C.faint, background:'#fafafa',
        }}>
          <div>Patient</div>
          <div>Condition</div>
          <div>Adherence (14d)</div>
          <div>Latest signal</div>
          <div>Next session</div>
          <div></div>
        </div>
        {filtered.map(p => (
          <PatientRow key={p.id} p={p} onClick={p.id==='chen' ? onPatient : undefined} />
        ))}
        {filtered.length === 0 && (
          <div style={{ padding:'40px 16px', textAlign:'center', color:C.faint, fontSize:12 }}>
            No patients match this filter.
          </div>
        )}
      </div>

      <Anno n={2} top={300} right={20}>
        <strong>Chen flagged.</strong> Click his row to enter the in-depth view — prescription, adherence, conversations he chose to share, and pending share requests.
      </Anno>
    </div>
  );
}

function Stat({ label, value, sub, tone='neutral', trend }) {
  const trendColor = tone==='warn' ? C.warn : tone==='ok' ? C.ok : C.muted;
  return (
    <div style={{
      background:'#fff', border:`.5px solid ${C.border}`, borderRadius:10,
      padding:'12px 14px',
    }}>
      <div style={{ fontSize:11, color:C.faint, fontWeight:500, letterSpacing:'.02em', marginBottom:6 }}>{label}</div>
      <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
        <div style={{ fontSize:24, fontWeight:600, letterSpacing:'-0.02em', fontVariantNumeric:'tabular-nums' }}>{value}</div>
        {trend && <span style={{ color:trendColor, display:'inline-flex' }}>{trend==='up'?I.arrowU(11):I.arrowD(11)}</span>}
      </div>
      <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{sub}</div>
    </div>
  );
}

function PatientRow({ p, onClick }) {
  const tone = TONE_BY_PATIENT[p.id] || 'slate';
  return (
    <div onClick={onClick} style={{
      display:'grid',
      gridTemplateColumns:'minmax(200px,1.4fr) 90px minmax(140px,1.1fr) minmax(220px,2fr) 110px 30px',
      gap:14, padding:'12px 16px', borderBottom:`.5px solid ${C.border}`,
      alignItems:'center', cursor: onClick ? 'pointer' : 'default',
      transition:'background .12s',
    }}
    onMouseEnter={e => onClick && (e.currentTarget.style.background='#fafafa')}
    onMouseLeave={e => onClick && (e.currentTarget.style.background='transparent')}
    >
      <div style={{ display:'flex', alignItems:'center', gap:10, minWidth:0 }}>
        <Avatar initials={p.initials} tone={tone} />
        <div style={{ minWidth:0 }}>
          <div style={{ fontSize:13, fontWeight:600 }}>{p.name}</div>
          <div style={{ fontSize:11, color:C.faint }}>{p.lastContact}</div>
        </div>
      </div>
      <div>
        <Pill>{p.condition}</Pill>
      </div>
      <div>
        <AdherenceBar value={p.adherence} status={p.status} />
      </div>
      <div style={{ minWidth:0 }}>
        {p.flag ? (
          <div style={{ display:'flex', alignItems:'flex-start', gap:6 }}>
            <span style={{ color:C.warn, marginTop:1, flexShrink:0 }}>{I.dot()}</span>
            <div style={{ fontSize:12, color:C.fg, lineHeight:1.4 }}>{p.flag}</div>
          </div>
        ) : (
          <div style={{ fontSize:12, color:C.muted, lineHeight:1.4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
            {p.summary}
          </div>
        )}
      </div>
      <div style={{ fontSize:12, color:C.muted, fontVariantNumeric:'tabular-nums' }}>{p.nextSession}</div>
      <div style={{ color:C.faint, display:'flex', justifyContent:'flex-end' }}>{I.arrowR()}</div>
    </div>
  );
}

// ───────────────── PATIENT DETAIL ─────────────────

function PatientDetail({ onPrescribe, onBack, adherenceMode }) {
  const [tab, setTab] = React.useState('overview');
  // overview | prescription | adherence | shares | conversations

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%' }}>
      {/* Patient header */}
      <div style={{
        background:'#fff', borderBottom:`.5px solid ${C.border}`,
        padding:'18px 22px 0',
      }}>
        <div style={{ display:'flex', alignItems:'flex-start', gap:14, marginBottom:14 }}>
          <Avatar initials={CHEN.initials} size={48} tone="teal" />
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <h2 style={{ margin:0, fontSize:18, fontWeight:600, letterSpacing:'-0.01em' }}>{CHEN.name}</h2>
              <Pill tone="accent">{CHEN.diagnosis}</Pill>
              <Pill>{CHEN.phase}</Pill>
              {adherenceMode==='off' && <Pill tone="bad">Needs attention</Pill>}
              {adherenceMode==='on'  && <Pill tone="ok">On track</Pill>}
            </div>
            <div style={{ fontSize:12, color:C.muted, marginTop:4 }}>
              Age {CHEN.age} · {CHEN.pronouns} · {CHEN.notes}
            </div>
            <div style={{ fontSize:12, color:C.muted, marginTop:2 }}>
              Last session <b style={{ color:C.fg, fontWeight:500 }}>{CHEN.lastSession}</b> · Next <b style={{ color:C.fg, fontWeight:500 }}>{CHEN.nextSession}</b>
            </div>
          </div>
          <div style={{ display:'flex', gap:6 }}>
            <button style={{ ...iconBtn, width:'auto', padding:'0 12px', gap:6, fontSize:12, color:C.fg }}>
              {I.edit(13)} Notes
            </button>
            <button onClick={onPrescribe} style={{
              padding:'0 12px', height:30, borderRadius:7, fontSize:12, fontWeight:600,
              background:C.accent, color:'#fff', border:0, cursor:'pointer',
              display:'inline-flex', alignItems:'center', gap:6,
            }}>{I.sparkles(12)} Update prescription</button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:2, marginLeft:62 }}>
          {[
            ['overview','Overview'],
            ['prescription','Prescription'],
            ['adherence','Adherence'],
            ['shares','Shares from Chen'],
            ['conversations','Conversations'],
            ['context','Context shared with Shari'],
          ].map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)} style={{
              padding:'8px 12px', fontSize:12, fontWeight: tab===k ? 600 : 500,
              color: tab===k ? C.fg : C.muted,
              background:'transparent', border:0, borderBottom:`2px solid ${tab===k ? C.accent : 'transparent'}`,
              cursor:'pointer', marginBottom:-1,
            }}>{label}</button>
          ))}
        </div>
      </div>

      <div style={{ flex:1, overflow:'auto', padding:'20px 22px' }}>
        {tab === 'overview' && <OverviewTab adherenceMode={adherenceMode} onPrescribe={onPrescribe} />}
        {tab === 'prescription' && <PrescriptionTab onEdit={onPrescribe} />}
        {tab === 'adherence' && <AdherenceTab adherenceMode={adherenceMode} />}
        {tab === 'shares' && <SharesTab />}
        {tab === 'conversations' && <ConversationsTab />}
        {tab === 'context' && <ContextTab />}
      </div>
    </div>
  );
}

// ────── Overview ──────
function OverviewTab({ adherenceMode, onPrescribe }) {
  const flag = adherenceMode === 'off';
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1.1fr 1fr', gap:16, position:'relative' }}>
      {/* Left column */}
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        <Card title="At a glance" right={<Pill tone={flag?'bad':'ok'}>{flag?'Drift detected':'Within plan'}</Pill>}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12 }}>
            <Mini label="Adherence (14d)" value={flag?'41%':(adherenceMode==='on'?'92%':'64%')} tone={flag?'warn':(adherenceMode==='on'?'ok':'neutral')} />
            <Mini label="Episodes shared (7d)" value={flag?'4':(adherenceMode==='on'?'0':'2')} />
            <Mini label="Sleep avg (7d)" value={flag?'3.8h':(adherenceMode==='on'?'6.4h':'4.2h')} tone={flag?'warn':(adherenceMode==='on'?'ok':'warn')} />
          </div>
        </Card>

        <Card title="Latest signals from Chen" right={<a style={{ fontSize:11.5, color:C.accent, textDecoration:'none' }}>See all shares →</a>}>
          {SHARED_LOG.slice(0,4).map(s => (
            <div key={s.id} style={{
              display:'flex', gap:10, padding:'10px 0',
              borderBottom:`.5px solid ${C.border}`,
            }}>
              <SignalDot kind={s.kind} />
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12.5, color:C.fg }}>{s.summary}</div>
                <div style={{ fontSize:11, color:C.faint, marginTop:2 }}>{s.when}</div>
              </div>
            </div>
          ))}
        </Card>

        <Card title="Pre-session note draft" right={<Pill tone="accent">{I.sparkles(11)} AI</Pill>}>
          <div style={{ fontSize:13, color:C.fg, lineHeight:1.6 }}>
            Since last session, Chen completed <b>2 of 4</b> imaginal exposures and skipped both in-vivo café exposures. Sleep dropped on 4 of 7 nights (avg 4.2h). He shared <b>2 nighttime episodes</b>, both around 02:00, with grounding partially effective. He <i>declined</i> Shari's guidance on one of them — flagged as a deliberate choice consistent with his stated preference to "handle some on my own."
            <div style={{ marginTop:10, paddingTop:10, borderTop:`.5px dashed ${C.border}`, color:C.muted, fontSize:12 }}>
              Suggested for the session: review what made the second imaginal exposure feel doable; revisit in-vivo step (consider scaling down to a quieter time).
            </div>
          </div>
        </Card>
      </div>

      {/* Right column */}
      <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
        <Card title="Active prescription" right={<a onClick={onPrescribe} style={{ fontSize:11.5, color:C.accent, textDecoration:'none', cursor:'pointer' }}>Edit →</a>}>
          <div style={{ fontSize:11.5, color:C.faint, marginBottom:8 }}>{PRESCRIPTION.version}</div>
          {PRESCRIPTION.tasks.map(t => (
            <div key={t.id} style={{
              display:'flex', alignItems:'flex-start', gap:10, padding:'8px 0',
              borderBottom:`.5px solid ${C.border}`,
            }}>
              <TaskIcon type={t.type} />
              <div style={{ flex:1 }}>
                <div style={{ fontSize:12.5, fontWeight:500 }}>{t.title}</div>
                <div style={{ fontSize:11, color:C.muted, marginTop:2 }}>{t.cadence} · {t.duration}</div>
              </div>
            </div>
          ))}
        </Card>

        <Card title="AI assistance" right={<Pill tone="accent">{PRESCRIPTION.aiAssistance.level}</Pill>}>
          <div style={{ fontSize:12.5, color:C.fg, lineHeight:1.55 }}>
            {PRESCRIPTION.aiAssistance.description}
          </div>
          <div style={{ marginTop:10, padding:'8px 10px', background:'#faf7e8', border:'.5px solid rgba(180,83,9,.2)', borderRadius:6, display:'flex', alignItems:'flex-start', gap:8 }}>
            {I.shield(13)}
            <div style={{ fontSize:11.5, color:'#7c4a07' }}>
              <b>Crisis protocol:</b> AI hands off to human crisis line on any SI mention. Chen consented Apr 28.
            </div>
          </div>
        </Card>

        <Card title="Pending share requests" right={<Pill tone="warn">{PENDING_SHARES.length} waiting on Chen</Pill>}>
          <div style={{ fontSize:12.5, color:C.muted, lineHeight:1.55 }}>
            Shari's app generated {PENDING_SHARES.length} share summaries. Chen will see them next time he opens the app and decide what to send up.
          </div>
        </Card>
      </div>
    </div>
  );
}

function Card({ title, right, children, padding='14px' }) {
  return (
    <div style={{
      background:'#fff', border:`.5px solid ${C.border}`, borderRadius:10,
    }}>
      <div style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:`10px ${padding} 8px`, borderBottom:`.5px solid ${C.border}`,
      }}>
        <span style={{ fontSize:11.5, fontWeight:600, letterSpacing:'.02em' }}>{title}</span>
        {right}
      </div>
      <div style={{ padding }}>{children}</div>
    </div>
  );
}

function Mini({ label, value, tone='neutral' }) {
  const color = tone==='warn'?C.warn : tone==='ok'?C.ok : C.fg;
  return (
    <div>
      <div style={{ fontSize:10.5, color:C.faint, fontWeight:500, letterSpacing:'.04em', textTransform:'uppercase' }}>{label}</div>
      <div style={{ fontSize:20, fontWeight:600, color, letterSpacing:'-0.02em', fontVariantNumeric:'tabular-nums', marginTop:3 }}>{value}</div>
    </div>
  );
}

function SignalDot({ kind }) {
  const palette = { episode:['#fee2e2','#b91c1c'], adherence:['#fef3c7','#92400e'], mood:['#dbeafe','#1e40af'] };
  const [bg, fg] = palette[kind] || palette.adherence;
  return (
    <div style={{
      width:24, height:24, borderRadius:6, background:bg, color:fg,
      display:'flex', alignItems:'center', justifyContent:'center',
      fontSize:10, fontWeight:700, fontFamily:C.mono, flexShrink:0,
    }}>
      {kind==='episode'?'EP':kind==='adherence'?'AD':'MD'}
    </div>
  );
}

function TaskIcon({ type }) {
  return (
    <div style={{
      width:22, height:22, borderRadius:5,
      background: type==='exposure' ? '#e6f0f0' : '#f1f5f9',
      color: type==='exposure' ? C.accent : C.muted,
      display:'flex', alignItems:'center', justifyContent:'center',
      fontSize:10, fontWeight:700, flexShrink:0,
    }}>
      {type==='exposure' ? 'E' : 'C'}
    </div>
  );
}

// ────── Prescription tab ──────
function PrescriptionTab({ onEdit }) {
  return (
    <div style={{ maxWidth:760 }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
        <div>
          <div style={{ fontSize:11.5, color:C.faint, fontWeight:500, letterSpacing:'.04em' }}>Active</div>
          <div style={{ fontSize:16, fontWeight:600, marginTop:2 }}>{PRESCRIPTION.protocol}</div>
          <div style={{ fontSize:11.5, color:C.muted, marginTop:2 }}>{PRESCRIPTION.version}</div>
        </div>
        <button onClick={onEdit} style={{
          padding:'0 12px', height:32, borderRadius:7, fontSize:12, fontWeight:600,
          background:C.accent, color:'#fff', border:0, cursor:'pointer',
          display:'inline-flex', alignItems:'center', gap:6,
        }}>{I.edit(12)} Edit & re-approve</button>
      </div>

      <Card title="Prescribed work">
        {PRESCRIPTION.tasks.map(t => (
          <div key={t.id} style={{
            padding:'12px 0', borderBottom:`.5px solid ${C.border}`,
            display:'flex', gap:12,
          }}>
            <TaskIcon type={t.type} />
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <div style={{ fontSize:13.5, fontWeight:600 }}>{t.title}</div>
                <Pill>{t.cadence}</Pill>
                <Pill>{t.duration}</Pill>
              </div>
              <div style={{ fontSize:12.5, color:C.muted, marginTop:5, lineHeight:1.5 }}>{t.detail}</div>
            </div>
          </div>
        ))}
      </Card>

      <div style={{ height:14 }} />
      <Card title="Constraints">
        {PRESCRIPTION.constraints.map((c, i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:8, padding:'6px 0', fontSize:12.5 }}>
            {I.lock(13)} {c}
          </div>
        ))}
      </Card>

      <div style={{ height:14 }} />
      <Card title="Escalation thresholds" right={<Pill tone="bad">Auto-notify Shari</Pill>}>
        {PRESCRIPTION.escalation.map((e, i) => (
          <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:8, padding:'6px 0', fontSize:12.5, color:C.fg, lineHeight:1.5 }}>
            <span style={{ color:C.bad, marginTop:5 }}>{I.dot()}</span> {e}
          </div>
        ))}
      </Card>
    </div>
  );
}

// ────── Adherence tab ──────
function AdherenceTab({ adherenceMode }) {
  // Override the rows for visual demo
  const rowsBase = ADHERENCE_14D.rows;
  const rows = adherenceMode === 'on'
    ? rowsBase.map(r => ({ ...r, values: r.values.map(v => v == null ? null : Math.max(v, 0.5)) }))
    : adherenceMode === 'off'
    ? rowsBase.map(r => ({ ...r, values: r.values.map(v => v == null ? null : Math.min(v, 0.5)) }))
    : rowsBase;

  return (
    <div>
      <div style={{ display:'flex', gap:14, marginBottom:14 }}>
        <Mini label="Composite (14d)" value={adherenceMode==='on'?'92%':adherenceMode==='off'?'41%':'64%'} tone={adherenceMode==='on'?'ok':adherenceMode==='off'?'warn':'neutral'} />
        <Mini label="Streak — morning log" value={adherenceMode==='off'?'0d':'5d'} />
        <Mini label="Last in-vivo" value={adherenceMode==='off'?'Apr 25':'Apr 30'} />
        <Mini label="Sleep avg (7d)" value={adherenceMode==='on'?'6.4h':adherenceMode==='off'?'3.8h':'4.2h'} tone={adherenceMode==='on'?'ok':'warn'} />
      </div>

      <Card title="14-day prescription heatmap" right={<Legend />}>
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          {/* Header dates */}
          <div style={{ display:'grid', gridTemplateColumns:`200px repeat(14, 1fr)`, gap:4, alignItems:'end' }}>
            <div />
            {ADHERENCE_14D.days.map((d, i) => (
              <div key={i} style={{ fontSize:9.5, color:C.faint, textAlign:'center', fontFamily:C.mono }}>
                {d.split(' ')[1]}
              </div>
            ))}
          </div>
          {rows.map((r, i) => (
            <div key={i} style={{ display:'grid', gridTemplateColumns:`200px repeat(14, 1fr)`, gap:4, alignItems:'center' }}>
              <div style={{ fontSize:12 }}>{r.task}</div>
              {r.values.map((v, j) => (
                <Cell key={j} v={v} />
              ))}
            </div>
          ))}
        </div>
      </Card>

      <Anno n={3} top={20} right={20}>
        <strong>Adherence view, two depths.</strong> Composite numbers up top for the glance; the heatmap below for clinicians who want per-task / per-day detail. Patient controls how much detail each layer reveals.
      </Anno>
    </div>
  );
}

function Cell({ v }) {
  if (v == null) return <div style={{ height:24, background:'transparent', borderRadius:4 }} />;
  const c = v === 1 ? C.ok : v === 0.5 ? '#e0a45c' : C.bad;
  const bg = v === 1 ? 'rgba(5,150,105,.18)' : v === 0.5 ? 'rgba(224,164,92,.22)' : 'rgba(185,28,28,.16)';
  return (
    <div style={{
      height:24, background:bg, borderRadius:4, position:'relative',
      display:'flex', alignItems:'center', justifyContent:'center',
    }}>
      <div style={{ width:6, height:6, borderRadius:'50%', background:c }} />
    </div>
  );
}

function Legend() {
  return (
    <div style={{ display:'flex', gap:10, fontSize:10.5, color:C.muted }}>
      {[['Done',C.ok],['Partial','#e0a45c'],['Missed',C.bad]].map(([l, c]) => (
        <span key={l} style={{ display:'inline-flex', alignItems:'center', gap:4 }}>
          <span style={{ width:7, height:7, borderRadius:'50%', background:c }} />{l}
        </span>
      ))}
    </div>
  );
}

// ────── Shares from Chen ──────
function SharesTab() {
  return (
    <div style={{ maxWidth:760, position:'relative' }}>
      <Anno n={4} top={-4} right={0} side="bottom">
        <strong>Audit log of shares.</strong> Every item here is something Chen explicitly approved. Clinician sees what was shared <em>and</em> what was withheld.
      </Anno>
      <div style={{ marginBottom:12, fontSize:12.5, color:C.muted, lineHeight:1.55 }}>
        Each entry is a summary Chen reviewed and approved. You can ask for more by requesting a share — Chen gets a notification and decides.
      </div>
      <Card title={`Shared by Chen · last 7 days (${SHARED_LOG.length})`}>
        {SHARED_LOG.map(s => (
          <div key={s.id} style={{
            display:'flex', gap:12, padding:'12px 0',
            borderBottom:`.5px solid ${C.border}`,
          }}>
            <SignalDot kind={s.kind} />
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:13, fontWeight:500 }}>{s.summary}</span>
                <span style={{ fontSize:11, color:C.faint }}>{s.when}</span>
              </div>
              <div style={{ fontSize:11.5, color:C.muted, marginTop:3, lineHeight:1.5 }}>{s.detail}</div>
            </div>
          </div>
        ))}
      </Card>

      <div style={{ height:14 }} />
      <Card title="Request a deeper share" right={<Pill tone="accent">Ask Chen</Pill>}>
        <div style={{ fontSize:12.5, color:C.muted, lineHeight:1.55, marginBottom:10 }}>
          For something specific (e.g. transcript of last night's episode), send a request. Chen sees a single, scoped, auto-revoking ask.
        </div>
        <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
          {['Last night\'s transcript', 'Sleep details (full week)', 'In-vivo: skipped reasons'].map(t => (
            <button key={t} style={{
              padding:'6px 10px', fontSize:11.5, borderRadius:6,
              border:`.5px solid ${C.border}`, background:'#fff', color:C.fg, cursor:'pointer',
            }}>+ {t}</button>
          ))}
        </div>
      </Card>
    </div>
  );
}

function ConversationsTab() {
  return (
    <div style={{ maxWidth:760 }}>
      <div style={{ marginBottom:12, fontSize:12.5, color:C.muted, lineHeight:1.55 }}>
        Conversations live on Chen's device. He chooses to share <b>themes and summaries</b> here — never raw transcripts unless he opts in.
      </div>
      <Card title="Themes Chen surfaced this week">
        {[
          ['Avoidance of public spaces','3 mentions','Especially mid-morning, places that "feel exposed"'],
          ['Hyperarousal — startle response','2 mentions','Trigger: motorbike backfire, supermarket dropped item'],
          ['Sleep onset rumination','5 mentions','Loops on "what could have gone differently" memories'],
          ['Connection — calling sister','1 mention','First reach-out in three weeks. Chen wants to talk about it.'],
        ].map(([title, count, sub]) => (
          <div key={title} style={{ padding:'10px 0', borderBottom:`.5px solid ${C.border}`, display:'flex', gap:12 }}>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:13, fontWeight:500 }}>{title}</span>
                <Pill>{count}</Pill>
              </div>
              <div style={{ fontSize:12, color:C.muted, marginTop:3, lineHeight:1.5 }}>{sub}</div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

function ContextTab() {
  return (
    <div style={{ maxWidth:760, position:'relative' }}>
      <Anno n={5} top={-4} right={0} side="bottom">
        <strong>Context flows the other way too.</strong> This is the explicit surface for what the clinician shared <em>down</em> to Chen's device — for personalization. Symmetric to the share-up flow.
      </Anno>
      <div style={{ marginBottom:12, fontSize:12.5, color:C.muted, lineHeight:1.55 }}>
        What you've shared <em>down</em> to Chen's app. The on-device Shari uses only this — nothing else.
      </div>
      <Card title="Persona settings">
        <Row label="Persona name" value="Shari (your first name)" />
        <Row label="Tone" value="Warm-direct (your default)" />
        <Row label="Voice modeling" value={<span><b>Powered by Delphi</b> · ready, awaiting Chen's opt-in</span>} />
        <Row label="Allowed scope" value="Prescription guidance, grounding, in-the-moment de-escalation" />
        <Row label="Out of scope" value="Trauma processing, medication advice, crisis (hands off to human)" last />
      </Card>
      <div style={{ height:14 }} />
      <Card title="Patient context shared with the on-device AI" right={<button style={{ padding:'4px 10px', fontSize:11, border:`.5px solid ${C.border}`, background:'#fff', borderRadius:6, cursor:'pointer' }}>+ Share more</button>}>
        <Row label="Diagnosis & phase" value="PTSD · Phase 2 processing" />
        <Row label="Trigger themes" value="Crowded indoor spaces, sudden loud sounds, scent of diesel" />
        <Row label="Grounding preferences" value="3-2-1 sensory; cold water; declined breathwork" />
        <Row label="Recent session highlights" value="2 paragraphs from Apr 28 session notes" />
        <Row label="Withheld" value="Full session transcripts, diagnostic history, family details" tone="warn" last />
      </Card>
    </div>
  );
}

function Row({ label, value, tone='neutral', last }) {
  return (
    <div style={{
      display:'grid', gridTemplateColumns:'180px 1fr', gap:14, padding:'10px 0',
      borderBottom: last ? 'none' : `.5px solid ${C.border}`,
      alignItems:'baseline',
    }}>
      <div style={{ fontSize:11.5, color:C.faint, fontWeight:500 }}>{label}</div>
      <div style={{ fontSize:12.5, color: tone==='warn'?C.warn:C.fg, lineHeight:1.5 }}>{value}</div>
    </div>
  );
}

window.ClinicianApp = ClinicianApp;
