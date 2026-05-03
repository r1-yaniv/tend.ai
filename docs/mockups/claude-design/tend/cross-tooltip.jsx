// cross-tooltip.jsx — renders the tooltip that pops up after a cross-page action.
// Subscribes to tendBus hints addressed to a given target ('patient' | 'clinician').
// Hint shape: { target, anchor, title, body, action }
//   anchor: a CSS selector (or null for centered) to pin the tooltip to.
//   action: optional { label, route } — clicking jumps to that route.

function CrossTooltip({ target, onAction }) {
  const [hint, setHint] = React.useState(null);
  const [pos, setPos] = React.useState(null);

  React.useEffect(() => {
    if (!window.tendBus) return;
    const off = window.tendBus.subscribeHints(target, (h) => {
      setHint(h);
      // Auto-dismiss after 12s
      setTimeout(() => setHint(curr => (curr && curr.nonce === h.nonce) ? null : curr), 12000);
    });
    return off;
  }, [target]);

  // Re-anchor when hint changes or window resizes.
  React.useEffect(() => {
    if (!hint) { setPos(null); return; }
    const place = () => {
      if (!hint.anchor) {
        setPos({ centered: true });
        return;
      }
      const el = document.querySelector(hint.anchor);
      if (!el) { setPos({ centered: true }); return; }
      const r = el.getBoundingClientRect();
      setPos({
        top: r.bottom + window.scrollY + 8,
        left: r.left + window.scrollX + r.width / 2,
        anchorRect: r,
      });
    };
    place();
    window.addEventListener('resize', place);
    const i = setInterval(place, 400); // re-poll, anchor may mount late
    return () => { window.removeEventListener('resize', place); clearInterval(i); };
  }, [hint]);

  if (!hint || !pos) return null;

  const dismiss = () => setHint(null);

  const cardStyle = pos.centered ? {
    position:'fixed', top:'50%', left:'50%', transform:'translate(-50%, -50%)',
    zIndex: 99999,
  } : {
    position:'absolute', top: pos.top, left: pos.left, transform:'translateX(-50%)',
    zIndex: 99999,
  };

  return (
    <div style={cardStyle}>
      {/* arrow */}
      {!pos.centered && (
        <div style={{
          position:'absolute', top:-6, left:'50%', transform:'translateX(-50%) rotate(45deg)',
          width:12, height:12, background:'#1c1917',
          boxShadow:'-1px -1px 0 rgba(0,0,0,.05)',
        }} />
      )}
      <div style={{
        position:'relative',
        background:'#1c1917', color:'#fafaf9',
        borderRadius:10, padding:'12px 14px', maxWidth:300, minWidth:240,
        boxShadow:'0 12px 36px rgba(0,0,0,.32)',
        fontFamily:'"Inter", system-ui, sans-serif',
        animation:'tend-tip-in .2s ease-out',
      }}>
        <style>{`@keyframes tend-tip-in { from { opacity:0; transform: translateY(4px) ${pos.centered ? 'translate(-50%, -50%)' : 'translateX(-50%)'}; } }`}</style>
        <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6, fontSize:10, fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase', color:'#fde047' }}>
          <span style={{ fontSize:14, lineHeight:1 }}>✻</span>
          From the {target === 'patient' ? 'clinician' : 'patient'} side
        </div>
        <div style={{ fontSize:13, fontWeight:600, marginBottom:4, lineHeight:1.3 }}>
          {hint.title}
        </div>
        <div style={{ fontSize:12, lineHeight:1.5, color:'rgba(250,250,249,.78)' }}>
          {hint.body}
        </div>
        <div style={{ display:'flex', gap:6, marginTop:10, justifyContent:'flex-end' }}>
          {hint.action && (
            <button onClick={() => { onAction && onAction(hint.action); dismiss(); }} style={{
              background:'#fde047', color:'#1c1917', border:0, padding:'5px 10px',
              borderRadius:5, fontSize:11.5, fontWeight:600, cursor:'pointer',
            }}>{hint.action.label}</button>
          )}
          <button onClick={dismiss} style={{
            background:'transparent', color:'rgba(250,250,249,.7)', border:'.5px solid rgba(250,250,249,.2)',
            padding:'5px 10px', borderRadius:5, fontSize:11.5, fontWeight:500, cursor:'pointer',
          }}>Got it</button>
        </div>
      </div>
    </div>
  );
}

window.CrossTooltip = CrossTooltip;

// ─── LocalToast — same-page success toast after a cross-app action ───
// Listens for 'tend-toast' events on window and shows a sliding card
// in the corner. Toast shape: { title, body, linkLabel, linkHref, tone }
function LocalToast() {
  const [toast, setToast] = React.useState(null);

  React.useEffect(() => {
    const onToast = (ev) => {
      const t = ev.detail || {};
      const id = Date.now() + ':' + Math.random().toString(36).slice(2, 7);
      setToast({ ...t, id });
      setTimeout(() => setToast(curr => (curr && curr.id === id) ? null : curr), 9000);
    };
    window.addEventListener('tend-toast', onToast);
    return () => window.removeEventListener('tend-toast', onToast);
  }, []);

  if (!toast) return null;
  const tone = toast.tone || 'success';
  const accent = tone === 'success' ? '#5a7a5e' : '#a86b3c';

  return (
    <div style={{
      position:'fixed', bottom:24, right:24, zIndex: 99998,
      maxWidth:360, minWidth:300,
      background:'#fff', color:'#1c1917',
      borderRadius:12, padding:'14px 16px',
      border:'.5px solid rgba(15,23,42,.12)',
      boxShadow:'0 20px 48px rgba(15,23,42,.18), 0 4px 12px rgba(15,23,42,.08)',
      fontFamily:'"Inter", system-ui, sans-serif',
      animation:'tend-toast-in .25s cubic-bezier(.2,.8,.2,1)',
      display:'flex', gap:12,
    }}>
      <style>{`@keyframes tend-toast-in { from { opacity:0; transform: translateY(12px); } }`}</style>
      <div style={{
        width:28, height:28, borderRadius:'50%', flexShrink:0,
        background: tone === 'success' ? '#e3ebe1' : '#f4e6d3',
        color: accent,
        display:'flex', alignItems:'center', justifyContent:'center',
        marginTop:2,
      }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
          <path d="M5 12l5 5 9-11"/>
        </svg>
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:13.5, fontWeight:600, marginBottom:3, lineHeight:1.35 }}>
          {toast.title}
        </div>
        <div style={{ fontSize:12.5, color:'#4a4239', lineHeight:1.5, marginBottom: toast.linkLabel ? 8 : 0 }}>
          {toast.body}
        </div>
        {toast.linkLabel && toast.linkHref && (
          <a href={toast.linkHref} onClick={(e) => {
            // If the toast carries a hint, re-post it so the destination
            // page (same tab or new tab) finds it fresh on load.
            if (toast.hint && window.tendBus) {
              window.tendBus.postHint(toast.hint);
            }
          }} style={{
            display:'inline-flex', alignItems:'center', gap:5,
            fontSize:12.5, fontWeight:600, color: accent,
            textDecoration:'none',
          }}>
            {toast.linkLabel}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 5l7 7-7 7"/></svg>
          </a>
        )}
      </div>
      <button onClick={() => setToast(null)} aria-label="Dismiss" style={{
        background:'transparent', border:0, cursor:'pointer',
        color:'rgba(15,23,42,.4)', padding:0, alignSelf:'flex-start',
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 6l12 12M18 6L6 18"/>
        </svg>
      </button>
    </div>
  );
}

// helper: fire from anywhere
window.tendToast = (detail) => {
  window.dispatchEvent(new CustomEvent('tend-toast', { detail }));
};

window.LocalToast = LocalToast;
