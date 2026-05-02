// app.jsx — main shell. Wraps clinician + patient artboards in a design canvas
// and provides the Tweaks panel for adherence + annotations.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "adherence": "real",
  "annotations": false
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Push tweak state to globals the apps read
  React.useEffect(() => {
    window.__TEND_ADHERENCE = t.adherence;
    window.__TEND_ANNOTATIONS = t.annotations;
    window.dispatchEvent(new Event('tend-anno-toggle'));
  }, [t.adherence, t.annotations]);

  return (
    <>
      <DesignCanvas>
        <DCSection id="overview" title="Tend" subtitle="The infrastructure for the between-visit half of care · mental health · Dr. Maya Levin & Chen Avraham">
          <DCArtboard id="clinician" label="Clinician web · Dr. Maya Levin" width={1280} height={820}>
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
      </TweaksPanel>
    </>
  );
}

function PhoneFrame({ children }) {
  return (
    <div style={{
      width:'100%', height:'100%',
      background:'#1a1715',
      padding:10, borderRadius:36,
      boxShadow:'inset 0 0 0 1px rgba(255,255,255,.04)',
      display:'flex',
    }}>
      <div style={{
        flex:1, borderRadius:28, overflow:'hidden',
        background:'#f6f1e8',
        position:'relative',
      }}>
        {children}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
