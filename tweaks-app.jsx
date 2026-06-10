// Envision Chiropractic — Tweaks panel app
// Lives on the homepage only. Other pages inherit theme via localStorage
// (chrome.js handles that on load + on every 'tweakchange').

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": ["#2C5FE5", "#fffaf5"],
  "font": "big_shoulders",
  "cta": "pill",
  "headline": "GET BACK TO LIVING PAIN-FREE"
}/*EDITMODE-END*/;

const FONT_OPTIONS = [
  { value: 'big_shoulders', label: 'Big Shoulders + Montserrat' },
  { value: 'anton',         label: 'Anton + Inter' },
  { value: 'archivo',       label: 'Archivo Black + Archivo' },
  { value: 'bebas',         label: 'Bebas Neue + Manrope' },
];

const PALETTE_OPTIONS = [
  ['#A1A37A', '#1f2421'],  // sage (default)
  ['#C8FF33', '#1f2421'],  // electric lime
  ['#FF5A36', '#fffaf5'],  // hot coral
  ['#2C5FE5', '#fffaf5'],  // cobalt
  ['#E8B23B', '#1f2421'],  // amber
];

function TweaksApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply on every change
  React.useEffect(() => {
    const r = document.documentElement.style;
    r.setProperty('--accent', t.palette[0]);
    r.setProperty('--accent-ink', t.palette[1] || '#1f2421');

    const fonts = {
      big_shoulders: ['"Big Shoulders Display", sans-serif', '"Montserrat", sans-serif'],
      anton:         ['"Anton", sans-serif',                  '"Inter", sans-serif'],
      archivo:       ['"Archivo Black", sans-serif',          '"Archivo", sans-serif'],
      bebas:         ['"Bebas Neue", sans-serif',             '"Manrope", sans-serif'],
    };
    const f = fonts[t.font] || fonts.big_shoulders;
    r.setProperty('--font-display', f[0]);
    r.setProperty('--font-ui', f[1]);

    const cta = {
      square:  ['0px',   'var(--ink)',    'var(--bone)', '1.5px solid var(--ink)'],
      pill:    ['999px', 'var(--ink)',    'var(--bone)', '1.5px solid var(--ink)'],
      outline: ['0px',   'transparent',   'var(--ink)',  '1.5px solid var(--ink)'],
    };
    const c = cta[t.cta] || cta.square;
    r.setProperty('--cta-radius', c[0]);
    r.setProperty('--cta-bg',     c[1]);
    r.setProperty('--cta-fg',     c[2]);
    r.setProperty('--cta-border', c[3]);

    document.querySelectorAll('[data-hero-headline]').forEach((el) => {
      el.textContent = t.headline;
    });

    // Persist for cross-page inheritance
    try {
      localStorage.setItem('envision-theme-v2', JSON.stringify(t));
    } catch (e) {}
  }, [t]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Palette" />
      <TweakColor label="Accent" value={t.palette} options={PALETTE_OPTIONS}
                  onChange={(v) => setTweak('palette', v)} />

      <TweakSection label="Typography" />
      <TweakSelect label="Type pair" value={t.font} options={FONT_OPTIONS}
                   onChange={(v) => setTweak('font', v)} />

      <TweakSection label="Buttons" />
      <TweakRadio label="CTA style" value={t.cta}
                  options={[
                    { value: 'square',  label: 'Square' },
                    { value: 'pill',    label: 'Pill' },
                    { value: 'outline', label: 'Outline' },
                  ]}
                  onChange={(v) => setTweak('cta', v)} />

      <TweakSection label="Copy" />
      <TweakText label="Hero headline" value={t.headline}
                 onChange={(v) => setTweak('headline', v)} />

      <TweakButton label="Reset to defaults" secondary
                   onClick={() => {
                     setTweak(TWEAK_DEFAULTS);
                     try { localStorage.removeItem('envision-theme-v2'); } catch (e) {}
                   }} />
    </TweaksPanel>
  );
}

const __mount = document.getElementById('tweaks-root');
if (__mount) {
  ReactDOM.createRoot(__mount).render(<TweaksApp />);
}
