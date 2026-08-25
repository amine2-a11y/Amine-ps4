function getFw() {
  const ua = navigator.userAgent || '';
  const m = ua.match(/PlayStation\s+4[\/\s]+(\d+\.\d{2})/i);
  return m ? parseFloat(m[1]) : NaN;
}

const fw = getFw();
const state = document.getElementById('state');
const out = document.getElementById('out');

function show(msg, extra) {
  if (state) state.textContent = msg;
  if (out) out.textContent = 'Detected firmware: ' + (Number.isNaN(fw) ? 'unknown' : fw.toFixed(2)) + (extra ? '\n' + extra : '');
}

function loadModule(path, label) {
  show('جاري تشغيل ' + label + '...', 'Firmware: ' + (Number.isNaN(fw) ? 'unknown' : fw.toFixed(2)) + '\nجارٍ قراءة وتجهيز الـchain...');
  // Do not use top-level await: older PS4 WebKit versions can parse modules
  // but reject top-level await, leaving the page stuck on the initial message.
  import(path).then(function () {
    show('جاري تنفيذ ' + label + '...', 'Firmware: ' + (Number.isNaN(fw) ? 'unknown' : fw.toFixed(2)) + '\nالـchain تم اختياره حسب Firmware.');
  }).catch(function (err) {
    show('Chain load error', String(err && (err.stack || err.message) || err));
  });
}

if (!Number.isNaN(fw) && fw >= 9.00 && fw < 10.00) {
  loadModule('./src/psfree-lapse/alert.mjs', 'PSFree + Lapse');
} else if (!Number.isNaN(fw) && (fw === 11.00 || fw === 11.50 || fw === 12.00 || fw === 12.02)) {
  loadModule('./chain_lapse.js', 'Lapse');
} else if (!Number.isNaN(fw) && (fw === 12.50 || fw === 12.52 || fw === 13.00)) {
  loadModule('./chain_poops.js', 'Poops');
} else {
  show('No supported chain for this firmware in this package.', 'Firmware detected but no exact chain is configured here.');
}
