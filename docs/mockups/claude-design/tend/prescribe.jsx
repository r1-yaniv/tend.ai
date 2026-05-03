// Prescription authoring + Shares inbox + Context flow
// Continues the clinician app namespace.

function PrescriptionAuthoring({ onBack }) {
  const [step, setStep] = React.useState(1);
  // 1: upload notes, 2: AI draft + edit, 3: review & approve
  const [notes, setNotes] = React.useState(SAMPLE_SESSION_NOTES);
  const [draft, setDraft] = React.useState(null);
  const [thinking, setThinking] = React.useState(false);

  const generate = () => {
    setThinking(true);
    setTimeout(() => {
      setDraft(JSON.parse(JSON.stringify(AI_DRAFT)));
      setThinking(false);
      setStep(2);
    }, 1200);
  };

  return (
    <div style={{ padding:'18px 22px 28px', position:'relative' }}>
      <Anno n={1} top={20} right={20}>
        <strong>AI drafts, clinician approves.</strong> The prescription is the contract for everything between visits. Shari can upload her own notes, accept the draft, edit any task, then sign off. Final approval is always hers.
      </Anno>

      <Stepper step={step} steps={['Session notes','AI draft & edit','Review & approve']} />

      <div style={{ marginTop:18 }}>
        {step === 1 && (
          <UploadStep notes={notes} setNotes={setNotes} onGenerate={generate} thinking={thinking} />
        )}
        {step === 2 && draft && (
          <DraftStep draft={draft} setDraft={setDraft} onBack={() => setStep(1)} onNext={() => setStep(3)} />
        )}
        {step === 3 && draft && (
          <ApproveStep draft={draft} onBack={() => setStep(2)} onApprove={onBack} />
        )}
      </div>
    </div>
  );
}

function Stepper({ step, steps }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
      {steps.map((label, i) => {
        const n = i + 1;
        const active = step === n;
        const done = step > n;
        return (
          <React.Fragment key={i}>
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <div style={{
                width:22, height:22, borderRadius:'50%',
                background: done ? C.accent : active ? '#fff' : '#f1f5f9',
                color: done ? '#fff' : active ? C.fg : C.faint,
                border: active ? `1.5px solid ${C.accent}` : `.5px solid ${C.border}`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:11, fontWeight:600,
              }}>{done ? I.check(11) : n}</div>
              <span style={{ fontSize:12.5, fontWeight: active||done ? 600 : 500, color: active||done ? C.fg : C.muted }}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ flex:'0 0 40px', height:1, background:done?C.accent:C.border }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

const SAMPLE_SESSION_NOTES = `Session 11 · Chen Avraham · Apr 28, 2026

Presentation: Reports 3 nightmares this week, woke 02:00–03:00 each time. Used 3-2-1 grounding twice (effective once). Avoiding Café Albert; said it "felt impossible Mon."

Work in session:
- Reviewed last imaginal exposure recording. SUDS peaked at 8, ended at 5. Patient noted decreased dissociation compared to two weeks ago.
- Discussed in-vivo step. Chen wants to scale back from "crowded mid-morning" to "near-empty late afternoon" for now.
- Sleep: still no consistent window. Drinking 4 coffees most days. Agreed cut-off 14:00.

Plan:
- Continue PE imaginal recording 4×/week.
- In-vivo café: scale to late afternoon Mon/Thu, 20 min, stay until SUDS halves.
- Sleep window 23:30–06:30; phone out of room.
- Morning grounding + 1-line log daily.
- Cut caffeine after 14:00.
- Shari (AI) may guide grounding and exposure. No trauma processing. Crisis → human protocol.
- Notify if SUDS sustained ≥8 for >30min during exposure, or two consecutive nights <4h sleep.

Risk: No SI ideation reported. Patient denied passive thoughts. Continue weekly check on this.`;

const AI_DRAFT = {
  protocol: 'Prolonged Exposure + sleep stabilization',
  tasks: [
    { id:'imag-exp', title:'Imaginal exposure recording', cadence:'4× / week', duration:'~30 min', detail:'Listen to recorded narrative. SUDS log before/after. Shari can guide if SUDS ≥7.', type:'exposure', source:'session-notes' },
    { id:'in-vivo', title:'In-vivo exposure: Café Albert', cadence:'Mon, Thu', duration:'20 min', detail:'Late afternoon (scaled down). Stay until SUDS drops by 50%.', type:'exposure', source:'session-notes' },
    { id:'sleep', title:'Sleep window 23:30 – 06:30', cadence:'nightly', duration:'7h', detail:'No screens after 22:30. Phone out of room. If awake >20 min, get out of bed.', type:'continuous', source:'session-notes' },
    { id:'journal', title:'Morning grounding + log', cadence:'daily', duration:'5 min', detail:'3-2-1 grounding, then one line on last night.', type:'continuous', source:'session-notes' },
  ],
  constraints: [
    { id:'c1', text:'No alcohol while in active PE phase', source:'standing' },
    { id:'c2', text:'Caffeine cut-off 14:00', source:'session-notes' },
  ],
  escalation: [
    { id:'e1', text:'SUDS sustained ≥ 8 for >30 min during exposure → notify clinician', source:'session-notes' },
    { id:'e2', text:'Two consecutive nights <4h sleep → notify clinician', source:'session-notes' },
    { id:'e3', text:'Any SI ideation → immediate handoff to crisis protocol', source:'standing' },
  ],
  ai: {
    level: 'guided',
    crisisGuidance: false,  // hands off to human
    rationale: 'Chen has shown benefit from in-the-moment grounding guidance. Standing instruction: AI may NOT initiate trauma processing or attempt crisis de-escalation — human handoff only.',
  },
};

function UploadStep({ notes, setNotes, onGenerate, thinking }) {
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:16 }}>
      <Card title="Session notes" right={<Pill>{I.edit(11)} editable</Pill>}>
        <textarea value={notes} onChange={e => setNotes(e.target.value)}
          style={{
            width:'100%', minHeight:380, border:`.5px solid ${C.border}`, borderRadius:8,
            padding:12, fontSize:12.5, fontFamily:C.mono, lineHeight:1.55, color:C.fg,
            resize:'vertical', outline:'none',
          }} />
        <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:10 }}>
          <button style={{
            padding:'6px 10px', fontSize:11.5, borderRadius:6,
            border:`.5px solid ${C.border}`, background:'#fff', color:C.fg, cursor:'pointer',
            display:'inline-flex', alignItems:'center', gap:6,
          }}>{I.upload(12)} Upload .docx / paste from EHR</button>
          <span style={{ fontSize:11, color:C.faint }}>or transcribe a recording (3 sources connected)</span>
        </div>
      </Card>

      <Card title="What the draft will produce" right={<Pill tone="accent">{I.sparkles(11)} AI</Pill>}>
        <div style={{ fontSize:12.5, color:C.muted, lineHeight:1.6, marginBottom:14 }}>
          Tend extracts a structured prescription from your notes:
        </div>
        <ChecklistItem text="Discrete tasks (exposures, thought records)" />
        <ChecklistItem text="Continuous behaviors (sleep window, caffeine cut-off)" />
        <ChecklistItem text="Constraints (no alcohol while titrating)" />
        <ChecklistItem text="Escalation thresholds (when to ping you)" />
        <ChecklistItem text="AI assistance level — what Shari may guide on, and where she hands off" />
        <div style={{ marginTop:12, padding:'10px 12px', background:'#f8fafc', borderRadius:7, border:`.5px solid ${C.border}`, fontSize:11.5, color:C.muted, display:'flex', gap:8 }}>
          {I.shield(13)}
          <div>You will edit every field before signing. Tend never sends a prescription Chen-side without your approval.</div>
        </div>
        <button onClick={onGenerate} disabled={thinking} style={{
          marginTop:14, width:'100%', height:38, borderRadius:8, fontSize:13, fontWeight:600,
          background: thinking ? '#cbd5e1' : C.accent, color:'#fff', border:0, cursor: thinking?'wait':'pointer',
          display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8,
        }}>
          {thinking ? <><Spinner /> Reading session notes…</> : <>{I.sparkles(13)} Draft prescription</>}
        </button>
      </Card>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{
      width:14, height:14, borderRadius:'50%',
      border:'2px solid rgba(255,255,255,.4)', borderTopColor:'#fff',
      animation:'tend-spin 0.7s linear infinite',
    }}>
      <style>{`@keyframes tend-spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

function ChecklistItem({ text }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, padding:'4px 0', fontSize:12.5 }}>
      <div style={{ width:14, height:14, borderRadius:4, background:C.accentSoft, color:C.accent, display:'flex', alignItems:'center', justifyContent:'center' }}>{I.check(10)}</div>
      {text}
    </div>
  );
}

function DraftStep({ draft, setDraft, onBack, onNext }) {
  const updateTask = (i, patch) => {
    setDraft({ ...draft, tasks: draft.tasks.map((t, j) => j===i ? {...t, ...patch} : t) });
  };
  const removeTask = (i) => setDraft({ ...draft, tasks: draft.tasks.filter((_, j) => j !== i) });

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:16 }}>
      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <Card title="Prescribed work" right={<button style={ghostBtn}>{I.plus(12)} Add task</button>}>
          {draft.tasks.map((t, i) => (
            <div key={t.id} style={{ padding:'12px 0', borderBottom:`.5px solid ${C.border}` }}>
              <div style={{ display:'flex', gap:10, alignItems:'flex-start' }}>
                <TaskIcon type={t.type} />
                <div style={{ flex:1 }}>
                  <input value={t.title} onChange={e => updateTask(i, { title: e.target.value })}
                    style={editInput} />
                  <div style={{ display:'flex', gap:8, marginTop:6, flexWrap:'wrap' }}>
                    <input value={t.cadence} onChange={e => updateTask(i, { cadence: e.target.value })}
                      style={{ ...editInput, width:120, fontSize:11.5 }} />
                    <input value={t.duration} onChange={e => updateTask(i, { duration: e.target.value })}
                      style={{ ...editInput, width:90, fontSize:11.5 }} />
                    <Pill tone="accent" style={{ marginLeft:'auto' }}>{I.sparkles(10)} from notes</Pill>
                  </div>
                  <textarea value={t.detail} onChange={e => updateTask(i, { detail: e.target.value })}
                    style={{ ...editInput, marginTop:6, minHeight:42, fontSize:12 }} />
                </div>
                <button onClick={() => removeTask(i)} style={{
                  background:'none', border:0, color:C.faint, cursor:'pointer', fontSize:14, padding:4,
                }}>×</button>
              </div>
            </div>
          ))}
        </Card>

        <Card title="Constraints">
          {draft.constraints.map((c, i) => (
            <div key={c.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'7px 0' }}>
              {I.lock(13)}
              <input value={c.text} onChange={e => setDraft({ ...draft, constraints: draft.constraints.map((x, j) => j===i?{...x, text:e.target.value}:x) })} style={{ ...editInput, flex:1 }} />
              <Pill tone={c.source==='standing'?'neutral':'accent'}>{c.source==='standing'?'standing':'from notes'}</Pill>
            </div>
          ))}
        </Card>

        <Card title="Escalation thresholds" right={<Pill tone="bad">Auto-notify Shari</Pill>}>
          {draft.escalation.map((e, i) => (
            <div key={e.id} style={{ display:'flex', alignItems:'center', gap:10, padding:'7px 0' }}>
              <span style={{ color:C.bad }}>{I.dot()}</span>
              <input value={e.text} onChange={ev => setDraft({ ...draft, escalation: draft.escalation.map((x, j) => j===i?{...x, text:ev.target.value}:x) })} style={{ ...editInput, flex:1 }} />
              <Pill tone={e.source==='standing'?'neutral':'accent'}>{e.source==='standing'?'standing':'from notes'}</Pill>
            </div>
          ))}
        </Card>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <Card title="AI assistance" right={<Pill tone="accent">{I.sparkles(11)} draft</Pill>}>
          <div style={{ fontSize:11.5, color:C.faint, fontWeight:500, letterSpacing:'.04em', marginBottom:6 }}>LEVEL</div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:6, marginBottom:12 }}>
            {[
              ['off','Off'],['minimal','Minimal'],['guided','Guided'],['full','Full'],
            ].map(([k, label]) => (
              <button key={k} onClick={() => setDraft({...draft, ai:{...draft.ai, level:k}})} style={{
                padding:'8px 6px', fontSize:11, borderRadius:6,
                border:`.5px solid ${draft.ai.level===k ? C.accent : C.border}`,
                background: draft.ai.level===k ? C.accentSoft : '#fff',
                color: draft.ai.level===k ? C.accent : C.fg,
                fontWeight: draft.ai.level===k ? 600 : 500, cursor:'pointer',
              }}>{label}</button>
            ))}
          </div>
          <div style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'10px 0', borderTop:`.5px solid ${C.border}` }}>
            <input type="checkbox" checked={draft.ai.crisisGuidance} onChange={e => setDraft({...draft, ai:{...draft.ai, crisisGuidance:e.target.checked}})} style={{ marginTop:2 }} />
            <div>
              <div style={{ fontSize:12.5, fontWeight:500 }}>Allow Shari to guide through crisis</div>
              <div style={{ fontSize:11.5, color:C.muted, marginTop:2, lineHeight:1.5 }}>
                Off (recommended for Chen): AI hands off to human protocol on any SI mention.
              </div>
            </div>
          </div>
          <div style={{ marginTop:8, fontSize:11.5, color:C.muted, lineHeight:1.55, padding:'10px 12px', background:'#f8fafc', borderRadius:7 }}>
            <b style={{ color:C.fg }}>Rationale (from notes):</b> {draft.ai.rationale}
          </div>
        </Card>

        <Card title="Diff vs. last prescription" right={<Pill>v3 → v4</Pill>}>
          <Diff op="+" text="In-vivo café scaled to late afternoon" />
          <Diff op="~" text="Sleep — phone out of room (added)" />
          <Diff op="+" text="Caffeine cut-off 14:00" />
          <Diff op="=" text="Imaginal exposure unchanged" muted />
          <Diff op="=" text="Morning log unchanged" muted />
        </Card>

        <div style={{ display:'flex', gap:8 }}>
          <button onClick={onBack} style={{ ...ghostBtn, flex:1, height:36 }}>Back</button>
          <button onClick={onNext} style={{
            flex:2, height:36, borderRadius:7, fontSize:13, fontWeight:600,
            background:C.accent, color:'#fff', border:0, cursor:'pointer',
            display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6,
          }}>Review & approve {I.arrowR(13)}</button>
        </div>
      </div>
    </div>
  );
}

function Diff({ op, text, muted }) {
  const c = op==='+'?C.ok : op==='~'?'#b45309' : op==='-'?C.bad : C.faint;
  return (
    <div style={{ display:'flex', gap:10, padding:'5px 0', alignItems:'center' }}>
      <span style={{ fontFamily:C.mono, fontWeight:700, color:c, width:14, textAlign:'center' }}>{op}</span>
      <span style={{ fontSize:12.5, color: muted ? C.faint : C.fg }}>{text}</span>
    </div>
  );
}

function ApproveStep({ draft, onBack, onApprove }) {
  const [signed, setSigned] = React.useState(false);
  const handleApprove = () => {
    const planHint = {
      target:'patient',
      anchor:'[data-plan-card]',
      title:'Dr. Kaplan updated your plan',
      body:'A new prescription is here — café exposure scaled to late afternoon, sleep window tightened. Open Plan to see what changed.',
      action:{ label:'Open plan', route:'prescriptions' },
    };
    if (window.tendBus) {
      window.tendBus.emit('rx-approved', { version:'v4' });
      window.tendBus.postHint(planHint);
    }
    if (window.tendToast) {
      window.tendToast({
        tone:'success',
        title:'Prescription v4 approved',
        body:'Chen will see the update next time he opens Tend. Want to see how it lands on his end?',
        linkLabel:'Open Chen\'s phone',
        linkHref:'Patient.html',
        hint: planHint,
      });
    }
    onApprove();
  };
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:16 }}>
      <Card title="Final prescription · v4 (pending)">
        <div style={{ fontSize:13, color:C.muted, marginBottom:12 }}>
          The summary below is exactly what Chen's app will receive. Nothing more, nothing less.
        </div>
        {draft.tasks.map(t => (
          <div key={t.id} style={{ padding:'10px 0', borderBottom:`.5px solid ${C.border}`, display:'flex', gap:10 }}>
            <TaskIcon type={t.type} />
            <div>
              <div style={{ fontSize:13, fontWeight:600 }}>{t.title} <span style={{ color:C.faint, fontWeight:400, fontSize:11.5 }}>· {t.cadence} · {t.duration}</span></div>
              <div style={{ fontSize:12, color:C.muted, marginTop:3, lineHeight:1.5 }}>{t.detail}</div>
            </div>
          </div>
        ))}
        <div style={{ marginTop:12, fontSize:11.5, color:C.faint, fontWeight:600, letterSpacing:'.04em', textTransform:'uppercase' }}>Constraints</div>
        {draft.constraints.map(c => <div key={c.id} style={{ fontSize:12.5, padding:'4px 0', display:'flex', gap:8 }}>{I.lock(13)} {c.text}</div>)}
        <div style={{ marginTop:12, fontSize:11.5, color:C.faint, fontWeight:600, letterSpacing:'.04em', textTransform:'uppercase' }}>Escalation</div>
        {draft.escalation.map(e => <div key={e.id} style={{ fontSize:12.5, padding:'4px 0', display:'flex', gap:8, color:C.fg }}><span style={{color:C.bad, marginTop:6}}>{I.dot()}</span>{e.text}</div>)}
      </Card>

      <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
        <Card title="Signing">
          <div style={{ fontSize:12.5, color:C.muted, lineHeight:1.55, marginBottom:12 }}>
            Your signature pushes v4 to Chen's device. Old version retires; he keeps a record. He'll see a "Maya updated your plan" card next time he opens Tend.
          </div>
          <div style={{ padding:'14px 12px', background:'#f8fafc', borderRadius:7, border:`.5px solid ${C.border}` }}>
            <div style={{ fontSize:11.5, color:C.faint, marginBottom:6 }}>Approver</div>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <Avatar size={28} photo={CLINICIAN.photo} />
              <div>
                <div style={{ fontSize:13, fontWeight:600 }}>{CLINICIAN.name}</div>
                <div style={{ fontSize:11.5, color:C.faint }}>License FL-SW-49213</div>
              </div>
            </div>
            <label style={{ display:'flex', alignItems:'flex-start', gap:8, marginTop:12, fontSize:12, color:C.fg, cursor:'pointer' }}>
              <input type="checkbox" checked={signed} onChange={e => setSigned(e.target.checked)} />
              <span>I have reviewed every task, constraint, and escalation, and approve this prescription as final.</span>
            </label>
          </div>
          <div style={{ display:'flex', gap:8, marginTop:14 }}>
            <button onClick={onBack} style={{ ...ghostBtn, flex:1, height:36 }}>Back</button>
            <button onClick={handleApprove} disabled={!signed} style={{
              flex:2, height:36, borderRadius:7, fontSize:13, fontWeight:600,
              background: signed ? C.accent : '#cbd5e1', color:'#fff', border:0, cursor: signed?'pointer':'not-allowed',
              display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6,
            }}>{I.check(13)} Sign & push to Chen</button>
          </div>
        </Card>
        <Card title="What Chen will see">
          <div style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'10px 12px', background:'#fdf6ec', borderRadius:7, fontSize:12.5, color:'#5a4a2a', lineHeight:1.5 }}>
            <span style={{ fontSize:18 }}>·</span>
            <div>"Hey Chen — Shari updated your plan after Tuesday's session. Café exposure moved to late afternoon. Want a quick walk-through?"</div>
          </div>
        </Card>
      </div>
    </div>
  );
}

const ghostBtn = {
  padding:'5px 10px', fontSize:11.5, borderRadius:6,
  border:`.5px solid ${C.border}`, background:'#fff', color:C.fg, cursor:'pointer',
  display:'inline-flex', alignItems:'center', gap:6,
};

const editInput = {
  width:'100%', padding:'5px 8px', fontSize:12.5, fontFamily:C.font,
  border:`.5px solid ${C.border}`, borderRadius:5, background:'#fdfdfc',
  color:C.fg, outline:'none', resize:'vertical',
};

// ────── Inbox of shares ──────
function SharesInbox({ onBack }) {
  return (
    <div style={{ padding:'18px 22px 28px' }}>
      <div style={{ fontSize:13, color:C.muted, marginBottom:14, maxWidth:680, lineHeight:1.55 }}>
        New summaries patients chose to share with you, across your panel. Two waiting from Chen this morning.
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr', gap:10, maxWidth:880 }}>
        {[
          { who:'Chen Avraham', tone:'teal', when:'2h ago', kind:'episode',
            summary:'Episode at 02:14 last night · ~22 min', detail:'Used 3-2-1 grounding (partial). Declined Shari\'s help mid-way. Final SUDS: 5.', urgent:true },
          { who:'Chen Avraham', tone:'teal', when:'5h ago', kind:'adherence',
            summary:'In-vivo exposure: skipped Mon', detail:'Reason: "couldn\'t leave the apartment today"' },
          { who:'Tyler Brooks', tone:'amber', when:'1d ago', kind:'mood',
            summary:'Morning check-in: mood 2/10', detail:'No journal entry. Auto-nudge sent.' },
          { who:'Jenna Reed', tone:'rose', when:'1d ago', kind:'adherence',
            summary:'Interoceptive exposure complete', detail:'3rd this week. SUDS resolved within 6 min.' },
        ].map((s, i) => (
          <div key={i} style={{
            background:'#fff', border:`.5px solid ${C.border}`, borderRadius:10,
            padding:'12px 14px', display:'flex', alignItems:'flex-start', gap:12,
          }}>
            <Avatar initials={s.who.split(' ').map(w=>w[0]).join('')} tone={s.tone} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                <span style={{ fontSize:13, fontWeight:600 }}>{s.who}</span>
                {s.urgent && <Pill tone="bad">flagged</Pill>}
                <span style={{ fontSize:11, color:C.faint, marginLeft:'auto' }}>{s.when}</span>
              </div>
              <div style={{ fontSize:12.5, marginTop:4 }}>{s.summary}</div>
              <div style={{ fontSize:11.5, color:C.muted, marginTop:3, lineHeight:1.5 }}>{s.detail}</div>
            </div>
            <button style={ghostBtn}>Open</button>
          </div>
        ))}
      </div>
    </div>
  );
}

window.PrescriptionAuthoring = PrescriptionAuthoring;
window.SharesInbox = SharesInbox;
window.ContextSharing = SharesInbox; // shares the same surface for now
