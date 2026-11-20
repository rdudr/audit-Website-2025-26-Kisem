// Builds src/site/k/taluka-map.json: the sub-district (taluka) map behind "Where we have worked".
//
// Source: geoBoundaries gbOpen India ADM1 (states), ADM2 (districts, 2021) and ADM3 (sub-districts,
// 2018), from Pathways Data / lgdirectory.gov.in, licence ODbL 1.0. The site credits it under the map.
//   https://www.geoboundaries.org/api/current/gbOpen/IND/ADM3/  (and ADM1, ADM2)
// Download the three .topojson files into one folder, then:
//   node scripts/build-taluka-map.mjs <folder with ADM1/ADM2/ADM3.topojson>
//
// What it does: keeps every sub-district whose inner point falls in the map frame, tags it with
// its state and district, projects to a 1000-wide Web Mercator view, and simplifies each shared
// border ONCE (Douglas-Peucker on the TopoJSON arcs), so neighbouring talukas still meet exactly.
// District and state borders are the arcs whose two sides differ.
import fs from 'node:fs';
import path from 'node:path';

const dir = process.argv[2];
if (!dir) { console.error('usage: node scripts/build-taluka-map.mjs <folder>'); process.exit(1); }
const read = n => JSON.parse(fs.readFileSync(path.join(dir, n + '.topojson'), 'utf8'));

// Frame: Gujarat, Diu, Daman, Dadra Nagar Haveli and the Abu Road edge of Rajasthan.
const FRAME = { w: 68.05, e: 74.55, s: 20.05, n: 24.85 };
const W = 1000;
const merc = lat => (Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360)) * 180) / Math.PI;
const K = W / (FRAME.e - FRAME.w);
const H = Math.round(K * (merc(FRAME.n) - merc(FRAME.s)));
const PX = lng => (lng - FRAME.w) * K;
const PY = lat => (merc(FRAME.n) - merc(lat)) * K;

// ---- TopoJSON decoding ----
function decodeArcs(t) {
  const [sx, sy] = t.transform.scale, [tx, ty] = t.transform.translate;
  return t.arcs.map(a => { let x = 0, y = 0; return a.map(([dx, dy]) => { x += dx; y += dy; return [x * sx + tx, y * sy + ty]; }); });
}
const polysOf = g => g.type === 'Polygon' ? [g.arcs] : g.type === 'MultiPolygon' ? g.arcs : [];
function ringCoords(arcs, ring) {
  const out = [];
  for (const i of ring) {
    const a = i >= 0 ? arcs[i] : arcs[~i].slice().reverse();
    for (let k = out.length ? 1 : 0; k < a.length; k++) out.push(a[k]);
  }
  return out;
}
const area = r => { let s = 0; for (let i = 0, j = r.length - 1; i < r.length; j = i++) s += (r[j][0] + r[i][0]) * (r[j][1] - r[i][1]); return s / 2; };
function inRing(p, r) {
  let c = false;
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const [xi, yi] = r[i], [xj, yj] = r[j];
    if ((yi > p[1]) !== (yj > p[1]) && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}
const inPolys = (p, polys) => polys.some(rings => inRing(p, rings[0]) && !rings.slice(1).some(h => inRing(p, h)));
// A point inside the largest ring (a horizontal scan through its middle), safer than a centroid.
function innerPoint(polys) {
  let best = null, ba = 0;
  for (const rings of polys) { const a = Math.abs(area(rings[0])); if (a > ba) { ba = a; best = rings; } }
  if (!best) return null;
  const r = best[0], ys = r.map(p => p[1]), y = (Math.min(...ys) + Math.max(...ys)) / 2, xs = [];
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const [xi, yi] = r[i], [xj, yj] = r[j];
    if ((yi > y) !== (yj > y)) xs.push(xi + ((y - yi) * (xj - xi)) / (yj - yi));
  }
  xs.sort((a, b) => a - b);
  let gx = (r[0][0]), gw = -1;
  for (let i = 0; i + 1 < xs.length; i += 2) if (xs[i + 1] - xs[i] > gw) { gw = xs[i + 1] - xs[i]; gx = (xs[i] + xs[i + 1]) / 2; }
  return [gx, y];
}
function layer(name) {
  const t = read(name), arcs = decodeArcs(t), obj = Object.values(t.objects)[0];
  return obj.geometries.map(g => {
    const topo = polysOf(g);
    const polys = topo.map(rings => rings.map(ring => ringCoords(arcs, ring)));
    return { name: g.properties.shapeName, topo, polys, arcs };
  });
}
const plain = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '');
// Spellings as people in Gujarat write them; all-capital names in title case.
const FIX = { 'Ahmadabad': 'Ahmedabad', 'Batod': 'Botad', 'Morvi': 'Morbi', 'Sabar Kantha': 'Sabarkantha', 'Banas Kantha': 'Banaskantha', 'Panch Mahals': 'Panchmahal', 'Dohad': 'Dahod', 'The Dangs': 'Dang', 'Arvalli': 'Aravalli', 'Aravali': 'Aravalli', 'Kachchh': 'Kutch', 'Mahesana': 'Mehsana', 'Gir Somnath': 'Gir Somnath', 'Devbhumi Dwarka': 'Devbhumi Dwarka', 'Vadodara Rural': 'Vadodara Rural' };
const tidy = s => { s = plain(s).trim(); if (s === s.toUpperCase()) s = s.toLowerCase().replace(/(^|[\s-])\w/g, c => c.toUpperCase()); return FIX[s] || s; };

// ---- states and districts ----
const STATES = { 'Gujarat': 'Gujarat', 'Rajasthan': 'Rajasthan', 'Madhya Pradesh': 'Madhya Pradesh', 'Maharashtra': 'Maharashtra', 'Dadra and Nagar Haveli and Daman and Diu': 'Dadra and Nagar Haveli and Daman and Diu' };
const adm1 = layer('ADM1').filter(s => STATES[plain(s.name)]);
const adm2 = layer('ADM2');
const stateOf = p => { const s = adm1.find(s => inPolys(p, s.polys)); return s ? plain(s.name) : ''; };

// ---- sub-districts in the frame ----
const t3 = read('ADM3'), arcs3 = decodeArcs(t3), geoms3 = Object.values(t3.objects)[0].geometries;
const inFrame = p => p[0] > FRAME.w - 0.3 && p[0] < FRAME.e + 0.3 && p[1] > FRAME.s - 0.3 && p[1] < FRAME.n + 0.3;
const units = [];
for (const g of geoms3) {
  const topo = polysOf(g);
  const polys = topo.map(rings => rings.map(ring => ringCoords(arcs3, ring)));
  const ip = innerPoint(polys);
  if (!ip || !inFrame(ip)) continue;
  const st = stateOf(ip);
  if (!st) continue; // Pakistan side, sea
  const d = adm2.find(d => inPolys(ip, d.polys));
  units.push({ n: tidy(g.properties.shapeName.replace(/\s*\((Pt|M Corp\.?|CT|OG|M)\)\s*$/i, '')), d: d ? tidy(d.name) : '', st, topo, ip });
}
const HOME = new Set(['Gujarat', 'Dadra and Nagar Haveli and Daman and Diu']);

// ---- which units touch each arc ----
const sides = new Map();
units.forEach((u, ui) => { for (const rings of u.topo) for (const ring of rings) for (const i of ring) { const k = i >= 0 ? i : ~i; (sides.get(k) || sides.set(k, []).get(k)).push(ui); } });

// ---- project and simplify each arc once ----
function dp(pts, tol) {
  if (pts.length < 3) return pts;
  const keep = new Uint8Array(pts.length); keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];
  while (stack.length) {
    const [a, b] = stack.pop(); const [ax, ay] = pts[a], [bx, by] = pts[b];
    const dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy) || 1e-9;
    let md = 0, mi = -1;
    for (let i = a + 1; i < b; i++) { const d = Math.abs(dy * pts[i][0] - dx * pts[i][1] + bx * ay - by * ax) / L; if (d > md) { md = d; mi = i; } }
    if (md > tol && mi > 0) { keep[mi] = 1; stack.push([a, mi], [mi, b]); }
  }
  return pts.filter((_, i) => keep[i]);
}
const simp = new Map();
for (const [k, us] of sides) {
  const home = us.some(ui => HOME.has(units[ui].st));
  const pts = arcs3[k].map(([x, y]) => [PX(x), PY(y)]);
  simp.set(k, dp(pts, home ? 0.7 : 2.4));
}
const r1 = v => Math.round(v * 10) / 10;
const arcPts = i => i >= 0 ? simp.get(i) : simp.get(~i).slice().reverse();
function ringPath(ring) {
  const pts = [];
  for (const i of ring) { const a = arcPts(i); for (let k = pts.length ? 1 : 0; k < a.length; k++) pts.push(a[k]); }
  return pts;
}
// Relative steps on a 0.1 grid ("M x y l dx dy dx dy ..."): about a third smaller than absolute.
function rel(pts) {
  const q = pts.map(([x, y]) => [Math.round(x * 10), Math.round(y * 10)]);
  // A step that rounds to nothing is dropped; an empty "l" would stop the browser drawing the rest.
  let steps = '';
  for (let i = 1; i < q.length; i++) { const dx = q[i][0] - q[i - 1][0], dy = q[i][1] - q[i - 1][1]; if (dx || dy) steps += (steps && dx >= 0 ? ' ' : '') + dx / 10 + (dy >= 0 ? ' ' : '') + dy / 10; }
  return 'M' + q[0][0] / 10 + ' ' + q[0][1] / 10 + (steps ? 'l' + steps : '');
}
const fmt = pts => rel(pts) + 'z';

// ---- output ----
const out = { W, H, frame: FRAME, source: 'geoBoundaries gbOpen IND ADM1/ADM2/ADM3 (Pathways Data, lgdirectory.gov.in), ODbL 1.0', units: [], districts: '', states: '', coast: '' };
units.forEach(u => {
  let d = '';
  const home = HOME.has(u.st);
  const all = u.topo.map(rings => rings.map(ringPath));
  const big = Math.max(...all.map(rs => Math.abs(area(rs[0]))));
  for (const rs of all) {
    const a = Math.abs(area(rs[0]));
    if (a < big && a < (home ? 2 : 8)) continue; // specks of islands; the largest part always stays
    d += rs.filter(r => r.length > 2).map(fmt).join('');
  }
  if (d) out.units.push({ n: u.n, d: u.d, s: u.st === 'Dadra and Nagar Haveli and Daman and Diu' ? 'DNH and DD' : u.st, h: home ? 1 : 0, p: d, c: [r1(PX(u.ip[0])), r1(PY(u.ip[1]))] });
});
// Borders: an arc with sides in two districts / two states; the home outline is an arc used once.
const lines = { districts: [], states: [], coast: [] };
for (const [k, us] of sides) {
  const a = units[us[0]], b = us[1] != null ? units[us[1]] : null;
  const pts = simp.get(k);
  const s = rel(pts);
  if (!b) { if (HOME.has(a.st)) lines.coast.push(s); continue; }
  if (a.st !== b.st) { if (HOME.has(a.st) || HOME.has(b.st)) lines.states.push(s); }
  else if (a.d !== b.d && HOME.has(a.st)) lines.districts.push(s);
}
out.districts = lines.districts.join('');
out.states = lines.states.join('');
out.coast = lines.coast.join('');
// District labels: area-weighted point of each home district's units.
const dl = new Map();
for (const u of units) if (HOME.has(u.st) && u.d) { const e = dl.get(u.d) || { x: 0, y: 0, n: 0 }; e.x += PX(u.ip[0]); e.y += PY(u.ip[1]); e.n++; dl.set(u.d, e); }
out.districtLabels = [...dl].map(([n, e]) => [n, r1(e.x / e.n), r1(e.y / e.n)]);
const file = path.resolve('src/site/k/taluka-map.json');
fs.writeFileSync(file, JSON.stringify(out));
const home = out.units.filter(u => u.h).length;
console.log(`${out.units.length} sub-districts (${home} in Gujarat and DNH/DD), ${dl.size} districts, ${W}x${H}, ${(fs.statSync(file).size / 1024).toFixed(0)} KB -> ${file}`);
