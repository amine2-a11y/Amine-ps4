function getFw() {
  const m = (navigator.userAgent || '').match(/PlayStation\s+4[\/ ](\d+\.\d{2})/i);
  return m ? parseFloat(m[1]) : NaN;
}

const fw = getFw();
const state = document.getElementById('state');
const out = document.getElementById('out');

function show(msg) {
  if (state) state.textContent = msg;
  if (out) out.textContent = 'Detected firmware: ' + (Number.isNaN(fw) ? 'unknown' : fw.toFixed(2));
}

// Correct chain selection for this package:
// 9.00-9.99  -> bundled PSFree + Lapse implementation
// 11.00-12.02 -> package's offset-based Lapse chain
// 12.50-13.00 -> package's Poops chain
// Other versions are reported as unsupported rather than falsely selecting a chain.
if (!Number.isNaN(fw) && fw >= 9.00 && fw < 10.00) {
  show('Loading PSFree + Lapse for this firmware...');
  await import('./src/psfree-lapse/alert.mjs');
} else if (!Number.isNaN(fw) && (fw === 11.00 || fw === 11.50 || fw === 12.00 || fw === 12.02)) {
  show('Loading Lapse for this firmware...');
  await import('./chain_lapse.js');
} else if (!Number.isNaN(fw) && (fw === 12.50 || fw === 12.52 || fw === 13.00)) {
  show('Loading Poops for this firmware...');
  await import('./chain_poops.js');
} else {
  show('No supported chain for this firmware in this package.');
  if (out) out.textContent += '\nUse the main exploit page or a package containing the exact firmware offsets.';
}
