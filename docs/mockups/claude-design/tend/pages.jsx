// pages.jsx — entry shells for Clinician.html and Patient.html
// (single-page versions of each artboard, with cross-page tooltips and
// a header strip linking back to the index / the other side)

const TWEAK_DEFAULTS_PAGE = /*EDITMODE-BEGIN*/{
  "adherence": "real",
  "annotations": false
}/*EDITMODE-END*/;

function PageHeader({ title, subtitle, otherLabel, otherHref }) {
  return (
    <div style={{
      position:'sticky', top:0, zIndex:30,
      background:'rgba(245, 244, 240, .82)',
      backdropFilter:'saturate(140%) blur(10px)',
      borderBottom:'.5px solid rgba(15,23,42,.08)',
      padding:'10px 18px', display:'flex', alignItems:'center', gap:14,
      fontFamily:'"Inter", system-ui, sans-serif',
    }}>
      <a href="Tend.html" style={{
        display:'inline-flex', alignItems:'center', gap:8, textDecoration:'none', color:'#0f172a',
      }}>
        <svg width="22" height="22" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="none" stroke="#0d6e6e" strokeWidth="1.4"/><path d="M16 8c0 6 4 8 8 10-4 2-8 4-8 10-0-6-4-8-8-10 4-2 8-4 8-10z" fill="#0d6e6e"/></svg>
        <span style={{ fontFamily:'"Instrument Serif", serif', fontSize:18, letterSpacing:'-0.01em' }}>Tend</span>
      </a>
      <div style={{ height:18, width:1, background:'rgba(15,23,42,.12)' }} />
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:13, fontWeight:600, color:'#0f172a' }}>{title}</div>
        <div style={{ fontSize:11, color:'#64748b', marginTop:1 }}>{subtitle}</div>
      </div>
      <a href={otherHref} style={{
        fontSize:12, fontWeight:600, padding:'6px 11px', borderRadius:6,
        background:'#fff', border:'.5px solid rgba(15,23,42,.12)',
        color:'#0f172a', textDecoration:'none', whiteSpace:'nowrap',
      }}>{otherLabel} →</a>
    </div>
  );
}

// ─── CLINICIAN PAGE ───
function ClinicianPage() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS_PAGE);
  React.useEffect(() => {
    window.__TEND_ADHERENCE = t.adherence;
    window.__TEND_ANNOTATIONS = t.annotations;
    window.dispatchEvent(new Event('tend-anno-toggle'));
  }, [t.adherence, t.annotations]);

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', background:'#f5f4f0' }}>
      <PageHeader
        title="Clinician · Shari B. Kaplan, LCSW"
        subtitle="The web app where Shari runs her between-visit practice"
        otherLabel="Open patient app"
        otherHref="Patient.html"
      />
      <div style={{
        flex:1, padding:'24px clamp(16px, 4vw, 48px)',
        display:'flex', justifyContent:'center',
      }}>
        <div style={{
          width:'min(1280px, 100%)', height:'min(820px, calc(100vh - 120px))',
          minHeight:680,
          background:'#fff', borderRadius:14, overflow:'hidden',
          border:'.5px solid rgba(15,23,42,.08)',
          boxShadow:'0 20px 60px -20px rgba(15,23,42,.18), 0 2px 8px rgba(15,23,42,.04)',
          position:'relative',
        }}>
          <ClinicianApp />
        </div>
      </div>

      <TweaksPanel>
        <TweakSection label="Demo state" />
        <TweakRadio label="Chen's adherence" value={t.adherence}
          options={['off', 'real', 'on']} onChange={(v) => setTweak('adherence', v)} />
        <div style={{ fontSize:10.5, color:'rgba(41,38,27,.55)', marginTop:-4, lineHeight:1.4 }}>
          Flips Chen between drift, real, and on-track.
        </div>
        <TweakSection label="Design notes" />
        <TweakToggle label="Show annotations" value={t.annotations}
          onChange={(v) => setTweak('annotations', v)} />
        <TweakSection label="Try the cross-page loop" />
        <div style={{ fontSize:11, color:'rgba(41,38,27,.7)', lineHeight:1.45 }}>
          Open the <a href="Patient.html" style={{ color:'#0d6e6e' }}>patient app</a> in another tab.
          Approve a prescription here → a hint pops up on the patient side.
        </div>
      </TweaksPanel>
    </div>
  );
}

// ─── PATIENT PAGE ───
function PatientPage() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS_PAGE);
  React.useEffect(() => {
    window.__TEND_ADHERENCE = t.adherence;
    window.__TEND_ANNOTATIONS = t.annotations;
    window.dispatchEvent(new Event('tend-anno-toggle'));
  }, [t.adherence, t.annotations]);

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', background:'#1f1d1a' }}>
      <PageHeader
        title="Patient · Chen Avraham"
        subtitle="iPhone app · between-visit companion in Dr. Kaplan's voice"
        otherLabel="Open clinician app"
        otherHref="Clinician.html"
      />
      <div style={{
        flex:1, padding:'28px 16px 36px',
        display:'flex', justifyContent:'center', alignItems:'flex-start',
        background:'radial-gradient(ellipse at center top, #2a2723 0%, #1a1816 70%)',
      }}>
        <div style={{
          width:390, height:'min(820px, calc(100vh - 120px))',
          minHeight:680, flexShrink:0,
          boxShadow:'0 30px 80px -20px rgba(0,0,0,.6), 0 8px 24px rgba(0,0,0,.4)',
          borderRadius:46,
        }}>
          <PhoneFrame>
            <PatientApp />
          </PhoneFrame>
        </div>
      </div>

      <TweaksPanel>
        <TweakSection label="Demo state" />
        <TweakRadio label="Your adherence" value={t.adherence}
          options={['off', 'real', 'on']} onChange={(v) => setTweak('adherence', v)} />
        <TweakSection label="Design notes" />
        <TweakToggle label="Show annotations" value={t.annotations}
          onChange={(v) => setTweak('annotations', v)} />
        <TweakSection label="Try the cross-page loop" />
        <div style={{ fontSize:11, color:'rgba(41,38,27,.7)', lineHeight:1.45 }}>
          Open the <a href="Clinician.html" style={{ color:'#0d6e6e' }}>clinician app</a> in another tab.
          Open <i>Share</i> here and approve → a hint pops up on the clinician inbox.
        </div>
      </TweaksPanel>
    </div>
  );
}

// PhoneFrame copy (same as in app.jsx — keep in sync if you change one)
function PhoneFrame({ children }) {
  return (
    <div style={{
      width:'100%', height:'100%',
      background:'#22201d',
      padding:3, borderRadius:44,
      display:'flex',
    }}>
      <div style={{
        flex:1, borderRadius:42, overflow:'hidden',
        background:'#f6f1e8',
        position:'relative',
      }}>
        {children}
      </div>
    </div>
  );
}

window.ClinicianPage = ClinicianPage;
window.PatientPage = PatientPage;
