// app.jsx — main shell. Wraps clinician + patient artboards in a design canvas
// and provides the Tweaks panel for adherence + annotations.
//
// Cross-artboard navigation: the two artboards share a global event bus
// (window.tendBus) so an action in one can trigger a tooltip in the other.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "adherence": "real",
  "annotations": false
}/*EDITMODE-END*/;

// ─── tiny event bus + cross-artboard tooltip ───
(function initBus() {
  if (window.tendBus) return;
  const listeners = {};
  window.tendBus = {
    on(ev, fn) { (listeners[ev] = listeners[ev] || []).push(fn); return () => {
      listeners[ev] = (listeners[ev] || []).filter(f => f !== fn);
    }; },
    emit(ev, payload) { (listeners[ev] || []).forEach(f => f(payload)); },
  };
})();

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => {
    window.__TEND_ADHERENCE = t.adherence;
    window.__TEND_ANNOTATIONS = t.annotations;
    window.dispatchEvent(new Event('tend-anno-toggle'));
  }, [t.adherence, t.annotations]);

  return (
    <>
      <DesignCanvas>
        <DCSection id="overview" title="Tend" subtitle="The infrastructure for the between-visit half of care · mental health · Shari B. Kaplan, LCSW & Chen Avraham">
          <DCArtboard id="clinician" label="Clinician web · Shari B. Kaplan, LCSW" width={1280} height={820}>
            <ClinicianApp />
          </DCArtboard>
          <DCArtboard id="patient" label="Patient mobile · Chen Avraham" width={390} height={820}>
            <PhoneFrame>
              <PatientApp />
            </PhoneFrame>
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel>
        <TweakSection label="Demo state" />
        <TweakRadio
          label="Chen's adherence"
          value={t.adherence}
          options={['off', 'real', 'on']}
          onChange={(v) => setTweak('adherence', v)}
        />
        <div style={{ fontSize:10.5, color:'rgba(41,38,27,.55)', marginTop:-4, lineHeight:1.4 }}>
          Flips Chen between drift, his current real state, and on-track. Watch the dashboard, his patient detail, and the patient adherence view all change.
        </div>
        <TweakSection label="Design notes" />
        <TweakToggle
          label="Show annotations"
          value={t.annotations}
          onChange={(v) => setTweak('annotations', v)}
        />
        <div style={{ fontSize:10.5, color:'rgba(41,38,27,.55)', marginTop:-4, lineHeight:1.4 }}>
          Yellow pins explain key design choices. Hover them to read.
        </div>
        <TweakSection label="Try the cross-app loop" />
        <div style={{ fontSize:11, color:'rgba(41,38,27,.7)', lineHeight:1.45 }}>
          1. On the <b>clinician</b>, open Chen → "Update prescription" → Approve. A tooltip will pop on the <b>phone</b>.<br/>
          2. On the <b>phone</b>, tap the share card → Review → Share. A tooltip will pop on the <b>clinician</b>.<br/>
          3. Tap "<b>Shari</b>" in the phone's chat header to see the Delphi voice-clone profile.
        </div>
      </TweaksPanel>
    </>
  );
}

// ─── phone frame: subtle bezel that matches cream interior, zero white seam ───
function PhoneFrame({ children }) {
  return (
    <div style={{
      width:'100%', height:'100%',
      background:'#22201d',
      padding:3, borderRadius:44,
      display:'flex',
      boxShadow:'0 1px 0 rgba(255,255,255,.04) inset',
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

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
