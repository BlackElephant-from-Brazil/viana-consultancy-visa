// The wall: sunlight through a Gothic window on limestone, one fragment shader on a fixed canvas.
// Morning behind the hero, the same wall at dusk behind the enquiry form. It only draws while a
// section that shows the wall is on screen, at 30 fps, and holds one still frame under reduced motion.

const VERT = 'attribute vec2 a; void main(){ gl_Position = vec4(a, 0.0, 1.0); }';
const FRAG = `
precision highp float;
uniform vec2 uRes; uniform float uTime; uniform float uScroll; uniform vec2 uPointer;
uniform float uMood; uniform vec2 uCenter; uniform float uScale;
float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(hash(i), hash(i+vec2(1.0,0.0)), f.x), mix(hash(i+vec2(0.0,1.0)), hash(i+vec2(1.0,1.0)), f.x), f.y); }
float fbm(vec2 p){ float s = 0.0, a = 0.5; for(int i=0;i<5;i++){ s += a*noise(p); p = p*2.03 + 17.1; a *= 0.5; } return s; }
float sdBox(vec2 p, vec2 b){ vec2 d = abs(p)-b; return length(max(d,0.0)) + min(max(d.x,d.y),0.0); }
// pointed arch: half width w, springing line at y = 0, body down to y = -h
float sdArch(vec2 p, float w, float h){
  float body = sdBox(p - vec2(0.0, -h*0.5), vec2(w, h*0.5));
  float top = max(max(length(p - vec2(w,0.0)) - 2.0*w, length(p + vec2(w,0.0)) - 2.0*w), -p.y);
  return min(body, top); }
// what the tracery lets through: two lancets and an oculus, with thin glazing bars
float lightShape(vec2 q){
  float W = 0.30, H = 1.60;
  float outer = sdArch(q, W, H);
  float wl = W*0.40;
  float l1 = sdArch(q - vec2(-W*0.51, -0.10), wl, H-0.10);
  float l2 = sdArch(q - vec2( W*0.51, -0.10), wl, H-0.10);
  float oc = length(q - vec2(0.0, 0.215)) - W*0.36;
  float d = max(min(min(l1, l2), oc), outer + 0.012);
  float by = abs(fract((q.y + 0.03) / 0.21) - 0.5) * 0.21;
  float bx = abs(abs(q.x) - W*0.51);
  float bars = min(by, bx) - 0.0040;
  if (q.y < -0.02) d = max(d, -bars);
  return d; }
void main(){
  vec2 frag = gl_FragCoord.xy;
  vec2 p = (frag - 0.5*uRes) / uRes.y;
  float t = uTime;
  // limestone: slow tone, fine tooling, faint ashlar joints
  vec2 w = p + vec2(0.0, uScroll*0.10);
  float tone = fbm(w*1.6);
  float fine = fbm(w*vec2(26.0, 9.0) + 3.7);
  vec3 dayStone = mix(vec3(0.915,0.872,0.800), vec3(0.955,0.925,0.870), tone) * (0.985 + fine*0.030);
  vec3 duskStone = mix(vec3(0.060,0.086,0.146), vec3(0.086,0.118,0.190), tone) * (0.97 + fine*0.06);
  vec3 stone = mix(dayStone, duskStone, uMood);
  float rowH = 0.31, colW = 0.92;
  float row = floor(w.y / rowH);
  vec2 cell = vec2(w.x / colW + mod(row, 2.0)*0.5 + hash(vec2(row, 3.0))*0.3, w.y / rowH);
  vec2 fc = fract(cell);
  float jx = min(fc.x, 1.0-fc.x) * colW, jy = min(fc.y, 1.0-fc.y) * rowH;
  float joint = 1.0 - smoothstep(0.0, 0.0030, min(jx, jy));
  stone *= 1.0 + (hash(floor(cell)) - 0.5) * 0.014;
  stone *= 1.0 - joint * mix(0.040, 0.14, uMood);
  // the window, projected at a slant
  vec2 c = uCenter + vec2(-uScroll*0.16 + sin(t*0.05)*0.015 + uPointer.x*0.010, uScroll*0.30 + uPointer.y*0.006);
  vec2 q = (p - c) * uScale;
  q.x += q.y * (mix(0.30, 0.50, uMood) + uScroll*0.10);
  float d = lightShape(q);
  float soft = mix(0.006, 0.030, smoothstep(-1.0, 0.6, q.y));
  float light = 1.0 - smoothstep(-soft, soft, d);
  // leaves moving in front of the glass
  vec2 lq = q*vec2(2.6, 2.1) + vec2(t*0.020, sin(t*0.11)*0.05);
  lq += 0.40*vec2(fbm(lq*1.2 + t*0.028), fbm(lq*1.2 + 9.0 - t*0.022));
  float leaves = smoothstep(0.42, 0.60, fbm(lq));
  float canopy = smoothstep(-0.75, 0.40, q.y - 0.35*q.x);
  light *= 1.0 - leaves * mix(0.10, 0.78, canopy);
  vec3 shadeMul = mix(vec3(0.935,0.936,0.948), vec3(1.0), uMood);
  vec3 litDay = stone * vec3(1.070,1.046,0.992);
  vec3 litDusk = stone * 1.5 + vec3(0.300,0.215,0.115);
  vec3 lit = mix(litDay, litDusk, uMood);
  float bounce = exp(-max(d, 0.0) * 6.0) * mix(0.05, 0.10, uMood);
  float k = clamp(light * mix(1.0, 0.55, uMood) + bounce, 0.0, 1.0);
  vec3 col = mix(stone * shadeMul, lit, k);
  col *= 1.0 - 0.05 * smoothstep(0.4, 1.1, length(p * vec2(0.7, 1.0)));
  col += (hash(frag + fract(t)*61.0) - 0.5) * 0.010;
  gl_FragColor = vec4(col, 1.0);
}`;

export function startWall({ canvas, holder, daySections, duskSection, reduced }) {
  let gl;
  try { gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' }); } catch (e) { gl = null; }
  if (!gl) return;

  const compile = (type, src) => {
    const s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
  };
  const vs = compile(gl.VERTEX_SHADER, VERT);
  const fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return;
  const prog = gl.createProgram();
  gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'a');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = {};
  ['uRes', 'uTime', 'uScroll', 'uPointer', 'uMood', 'uCenter', 'uScale'].forEach((n) => { U[n] = gl.getUniformLocation(prog, n); });

  let visible = new Set();
  let px = 0, py = 0, tx = 0, ty = 0;
  let last = 0, raf = 0, dirty = true;
  const t0 = performance.now();

  function size() {
    const small = innerWidth < 760;
    const dpr = Math.min(devicePixelRatio || 1, small ? 1 : 1.5);
    const w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; gl.viewport(0, 0, w, h); }
  }

  function draw(now) {
    size();
    const small = innerWidth < 760;
    const r = duskSection.getBoundingClientRect();
    const dusk = r.top < innerHeight * 1.5;           // everything above the form is opaque, so the switch is never seen
    const scroll = dusk ? Math.max(-1, Math.min(1, -r.top / innerHeight)) * 0.5 : Math.min(2.2, scrollY / innerHeight);
    px += (tx - px) * 0.05; py += (ty - py) * 0.05;
    gl.uniform2f(U.uRes, canvas.width, canvas.height);
    gl.uniform1f(U.uTime, reduced ? 30 : 30 + (now - t0) / 1000);
    gl.uniform1f(U.uScroll, scroll);
    gl.uniform2f(U.uPointer, px, py);
    gl.uniform1f(U.uMood, dusk ? 1 : 0);
    if (dusk) gl.uniform2f(U.uCenter, small ? 0.02 : -0.36, small ? 0.36 : 0.28);
    else gl.uniform2f(U.uCenter, small ? 0.05 : 0.44, small ? 0.36 : 0.30);
    gl.uniform1f(U.uScale, small ? 1.95 : 1.34);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    holder.classList.add('is-live');
  }

  function loop(now) {
    raf = 0;
    if (!visible.size || document.hidden) return;
    if (reduced) { if (dirty) { draw(now); dirty = false; } return; }
    if (now - last >= 32) { last = now; draw(now); }
    raf = requestAnimationFrame(loop);
  }
  const wake = () => { dirty = true; if (!raf) raf = requestAnimationFrame(loop); };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) visible.add(e.target); else visible.delete(e.target); });
    wake();
  });
  [...daySections, duskSection].forEach((s) => s && io.observe(s));
  addEventListener('resize', wake, { passive: true });
  addEventListener('scroll', () => { if (reduced) wake(); }, { passive: true });
  document.addEventListener('visibilitychange', wake);
  if (!reduced && matchMedia('(pointer: fine)').matches) {
    addEventListener('pointermove', (e) => { tx = e.clientX / innerWidth * 2 - 1; ty = 1 - e.clientY / innerHeight * 2; }, { passive: true });
  }
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); holder.classList.remove('is-live'); });
  // one composed frame first, the loop a moment later
  requestAnimationFrame((now) => { draw(now); setTimeout(wake, 300); });
}
