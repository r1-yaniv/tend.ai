// Tiny annotation pin component. Toggled globally via window.__TEND_ANNOTATIONS.
// Use: <Anno n={1} top={12} left={20}>This explains the design choice…</Anno>

function Anno({ n, top, left, right, bottom, children, side = 'right' }) {
  const [open, setOpen] = React.useState(false);
  const visible = window.__TEND_ANNOTATIONS;

  // re-render when global flips
  const [, force] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => {
    const h = () => force();
    window.addEventListener('tend-anno-toggle', h);
    return () => window.removeEventListener('tend-anno-toggle', h);
  }, []);

  if (!visible) return null;

  const pos = {};
  if (top != null) pos.top = top;
  if (left != null) pos.left = left;
  if (right != null) pos.right = right;
  if (bottom != null) pos.bottom = bottom;

  const tipPos = side === 'right'
    ? { left: 26, top: -4 }
    : side === 'left'
    ? { right: 26, top: -4 }
    : side === 'top'
    ? { left: -8, bottom: 26 }
    : { left: -8, top: 26 };

  return (
    <div style={{ position:'absolute', ...pos, zIndex: 50 }}
         onMouseEnter={() => setOpen(true)}
         onMouseLeave={() => setOpen(false)}>
      <div className="anno-pin">{n}</div>
      {open && (
        <div className="anno-tip" style={{ position:'absolute', ...tipPos }}>
          {children}
        </div>
      )}
    </div>
  );
}

window.Anno = Anno;
