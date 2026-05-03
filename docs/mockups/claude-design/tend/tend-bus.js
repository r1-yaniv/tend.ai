// tend-bus.js — cross-page (and same-page) signaling for the Tend prototype.
//
// Used to coordinate between Clinician.html and Patient.html when they're
// open in two separate tabs/windows: an action on one page leaves a hint
// in localStorage; the other page (if open) hears the storage event and
// pops a tooltip pointing at the relevant element. If the other page is
// NOT open, the hint waits there and surfaces next time it loads.

(function () {
  if (window.tendBus) return;

  const STORAGE_KEY = 'tend.hint';
  const listeners = {};

  // ─── tiny same-page event bus ───
  function on(ev, fn) {
    (listeners[ev] = listeners[ev] || []).push(fn);
    return () => {
      listeners[ev] = (listeners[ev] || []).filter(f => f !== fn);
    };
  }
  function emit(ev, payload) {
    (listeners[ev] || []).forEach(f => { try { f(payload); } catch (e) { console.error(e); } });
  }

  // ─── cross-page hint via localStorage ───
  // Each "hint" looks like { id, target, side, title, body, expires, nonce }
  // - target: which page should show it ('patient' | 'clinician')
  // - other fields drive the tooltip rendering
  function postHint(hint) {
    const enriched = {
      ...hint,
      nonce: Date.now() + ':' + Math.random().toString(36).slice(2, 7),
      created: Date.now(),
    };
    try {
      localStorage.setItem(STORAGE_KEY + '.' + hint.target, JSON.stringify(enriched));
    } catch (e) { /* private mode etc */ }
    // Also fire same-page in case both artboards live in one window.
    emit('hint', enriched);
  }

  // Read + clear the hint addressed to `target`. Returns the hint or null.
  function consumeHint(target) {
    const key = STORAGE_KEY + '.' + target;
    let raw = null;
    try { raw = localStorage.getItem(key); } catch (e) { return null; }
    if (!raw) return null;
    let parsed;
    try { parsed = JSON.parse(raw); } catch (e) { return null; }
    // Expire after 60s — stale hints are confusing.
    if (parsed.created && Date.now() - parsed.created > 60000) {
      try { localStorage.removeItem(key); } catch (e) {}
      return null;
    }
    try { localStorage.removeItem(key); } catch (e) {}
    return parsed;
  }

  // Subscribe to hints for a given target. Calls fn(hint) for each new one.
  // Drains anything already waiting on subscribe.
  function subscribeHints(target, fn) {
    const key = STORAGE_KEY + '.' + target;
    // Drain on next tick (after the page mounts).
    setTimeout(() => {
      const pending = consumeHint(target);
      if (pending) fn(pending);
    }, 60);

    const handler = (ev) => {
      if (ev.key !== key || !ev.newValue) return;
      const hint = consumeHint(target);
      if (hint) fn(hint);
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }

  window.tendBus = { on, emit, postHint, consumeHint, subscribeHints };
})();
