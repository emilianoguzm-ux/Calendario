/* ============================================================
   Ilustraciones del calendario (SVG dibujado a mano, viewBox 0 0 100 100).
   ============================================================ */
(function (raiz) {
  "use strict";
  const P = {
    carbon: "#2b2f36", rojo: "#c8303c", rojoOsc: "#9e2230", coral: "#f47c7c", rosa: "#f9d0d0",
    durazno: "#fcdcc6", amarillo: "#f5c13a", ocre: "#d9951e", verde: "#8cbd2e", verdeOsc: "#3f8a3a",
    pino: "#2c6b3a", azul: "#3aa6c9", azulOsc: "#227a99", celeste: "#b3e1ef", crema: "#fff4e3",
    cafe: "#7a4b2a", cafeClaro: "#c9874a", blanco: "#ffffff"
  };
  const f = n => (+n).toFixed(1);

  const corazon = (cx, cy, s, c) =>
    `<path d="M${f(cx)} ${f(cy + s * .9)} C${f(cx - s * 1.5)} ${f(cy - s * .1)} ${f(cx - s * .7)} ${f(cy - s * 1.2)} ${f(cx)} ${f(cy - s * .45)} C${f(cx + s * .7)} ${f(cy - s * 1.2)} ${f(cx + s * 1.5)} ${f(cy - s * .1)} ${f(cx)} ${f(cy + s * .9)}Z" fill="${c}"/>`;
  function estrella(cx, cy, R, r, c, puntas = 5) {
    let d = "";
    for (let i = 0; i < puntas * 2; i++) {
      const rad = i % 2 ? r : R, a = -Math.PI / 2 + i * Math.PI / puntas;
      d += (i ? "L" : "M") + f(cx + rad * Math.cos(a)) + " " + f(cy + rad * Math.sin(a));
    }
    return `<path d="${d}Z" fill="${c}"/>`;
  }
  function flor(cx, cy, r, c = P.rojo) {
    let s = "";
    for (let i = 0; i < 5; i++) {
      const a = i / 5 * 2 * Math.PI - Math.PI / 2;
      s += `<circle cx="${f(cx + r * .55 * Math.cos(a))}" cy="${f(cy + r * .55 * Math.sin(a))}" r="${f(r * .5)}" fill="${c}"/>`;
    }
    return s + `<circle cx="${cx}" cy="${cy}" r="${f(r * .3)}" fill="${P.amarillo}"/>`;
  }
  const mono = (x, y, rot, c, c2, e = 1) =>
    `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${e})"><path d="M0 0 C-14 -12 -20 5 0 2Z M0 0 C14 -12 20 5 0 2Z" fill="${c}"/><path d="M-2 2 l-8 14 5 -1 3 4z M2 2 l8 14 -5 -1 -3 4z" fill="${c2}"/><circle r="3.6" fill="${c2}"/></g>`;
  function caja(cx, base, w, h, cCaja, cTapa, cListon) {
    const top = base - h;
    return `<rect x="${f(cx - w / 2)}" y="${f(top)}" width="${w}" height="${h}" rx="2" fill="${cCaja}"/>
      <rect x="${f(cx - w / 2 - 3)}" y="${f(top - 8)}" width="${w + 6}" height="10" rx="2" fill="${cTapa}"/>
      <rect x="${f(cx - 4)}" y="${f(top - 8)}" width="8" height="${h + 8}" fill="${cListon}"/>
      <path d="M${cx} ${f(top - 8)} C${cx - 9} ${f(top - 21)} ${cx - 19} ${f(top - 12)} ${cx} ${f(top - 8)}Z M${cx} ${f(top - 8)} C${cx + 9} ${f(top - 21)} ${cx + 19} ${f(top - 12)} ${cx} ${f(top - 8)}Z" fill="${cListon}"/>
      <circle cx="${cx}" cy="${f(top - 8)}" r="3" fill="${cListon}"/>`;
  }
  const brillos = (pts, c = P.crema) => pts.map(([x, y, r]) => estrella(x, y, r, r * .42, c)).join("");

  const M = {
    banderines() {
      const cols = [P.rojo, P.amarillo, P.azul, P.coral, P.verde, P.celeste];
      const q = t => [(1 - t) ** 2 * 6 + 2 * (1 - t) * t * 50 + t * t * 94, (1 - t) ** 2 * 34 + 2 * (1 - t) * t * 62 + t * t * 34];
      let s = `<path d="M6 34 Q50 62 94 34" fill="none" stroke="${P.crema}" stroke-width="1.6"/>`;
      for (let i = 0; i < 6; i++) {
        const [x, y] = q((i + .5) / 6);
        s += `<path d="M${f(x - 7)} ${f(y - 2)} H${f(x + 7)} L${f(x)} ${f(y + 17)}Z" fill="${cols[i]}"/>`;
      }
      for (const [x, y, rot] of [[8, 32, -30], [92, 32, 30]])
        s += `<g transform="translate(${x} ${y}) rotate(${rot})"><ellipse cx="0" cy="-9" rx="3" ry="7" fill="${P.verde}"/><ellipse cx="-6" cy="-5" rx="3" ry="6" fill="${P.verdeOsc}" transform="rotate(-50 -6 -5)"/><ellipse cx="6" cy="-5" rx="3" ry="6" fill="${P.verdeOsc}" transform="rotate(50 6 -5)"/><circle r="3.2" fill="${P.rojo}"/><circle cx="4" cy="2" r="2.5" fill="${P.rojo}"/></g>`;
      return s + brillos([[28, 82, 4.5], [72, 86, 3.6]]) + estrella(50, 90, 3, 1.3, P.amarillo);
    },
    baston() {
      const d = "M62 90 V38 a16 16 0 0 0 -32 0 v5";
      return `<path d="${d}" fill="none" stroke="#000" stroke-opacity=".12" stroke-width="14" stroke-linecap="round" transform="translate(3 3)"/>
        <path d="${d}" fill="none" stroke="#fff" stroke-width="13" stroke-linecap="round"/>
        <path d="${d}" fill="none" stroke="${P.rojo}" stroke-width="13" stroke-dasharray="5 7"/>
        ${mono(62, 58, 0, P.verde, P.verdeOsc)}${brillos([[18, 70, 4], [84, 22, 3.4]])}`;
    },
    taza() {
      return `<rect x="55" y="12" width="5" height="30" rx="2" fill="${P.cafeClaro}" transform="rotate(18 57 27)"/>
        <path d="M68 53 h4 a10 10 0 0 1 0 20 h-5" fill="none" stroke="${P.rojo}" stroke-width="6"/>
        <path d="M24 46 H70 V72 a14 14 0 0 1 -14 14 H38 a14 14 0 0 1 -14 -14Z" fill="${P.rojo}"/>
        <path d="M24 46 H70 V52 H24Z" fill="${P.rojoOsc}"/>
        <g fill="#fff"><circle cx="31" cy="43" r="8"/><circle cx="42" cy="35" r="10"/><circle cx="55" cy="36" r="9"/><circle cx="64" cy="43" r="7.5"/><rect x="24" y="40" width="46" height="8" rx="4"/></g>
        <g stroke-width="2.4" stroke-linecap="round"><path d="M36 32 l3 2" stroke="${P.rojo}"/><path d="M47 30 l2 -3" stroke="${P.azul}"/><path d="M56 34 l3 1" stroke="${P.amarillo}"/><path d="M42 41 l-2 2" stroke="${P.verde}"/><path d="M30 41 l2 -2" stroke="${P.amarillo}"/><path d="M62 41 l-1 3" stroke="${P.rojo}"/><path d="M50 42 l3 0" stroke="${P.azul}"/></g>
        <g stroke="#fff" stroke-width="2.2" stroke-linecap="round"><path d="M47 58 V76 M39 62.5 L55 71.5 M55 62.5 L39 71.5"/></g>
        ${corazon(82, 24, 4.5, P.rojo)}${corazon(16, 30, 3.4, P.coral)}${corazon(86, 84, 3, P.coral)}`;
    },
    rama() {
      const q = t => [(1 - t) ** 2 * 10 + 2 * (1 - t) * t * 48 + t * t * 90, (1 - t) ** 2 * 80 + 2 * (1 - t) * t * 58 + t * t * 20];
      const dq = t => [2 * (1 - t) * 38 + 2 * t * 42, 2 * (1 - t) * -22 + 2 * t * -38];
      let s = `<path d="M10 80 Q48 58 90 20" fill="none" stroke="${P.cafe}" stroke-width="3" stroke-linecap="round"/>`;
      for (let t = .04; t < .98; t += .045) {
        const [x, y] = q(t), [dx, dy] = dq(t), a = Math.atan2(dy, dx);
        for (const lado of [-1, 1]) {
          const b = a + lado * .85, L = 14 - t * 5;
          s += `<path d="M${f(x)} ${f(y)} L${f(x + L * Math.cos(b))} ${f(y + L * Math.sin(b))}" stroke="${lado > 0 ? P.pino : P.verdeOsc}" stroke-width="2.6" stroke-linecap="round"/>`;
        }
      }
      for (const [x, y] of [[44, 58], [50, 63], [40, 64], [70, 37], [75, 41]])
        s += `<circle cx="${x}" cy="${y}" r="4" fill="${P.rojo}"/><circle cx="${x - 1.2}" cy="${y - 1.3}" r="1.2" fill="#fff" opacity=".6"/>`;
      return s + mono(26, 70, -30, P.amarillo, P.ocre, .9);
    },
    carta() {
      let s = `<g stroke="${P.verdeOsc}" stroke-width="2.2" fill="none"><path d="M50 44 C44 30 36 24 28 20"/><path d="M50 44 C54 30 62 22 72 18"/><path d="M50 44 V16"/></g>
        <ellipse cx="38" cy="32" rx="4" ry="9" fill="${P.pino}" transform="rotate(-40 38 32)"/><ellipse cx="62" cy="30" rx="4" ry="9" fill="${P.pino}" transform="rotate(40 62 30)"/>`;
      s += flor(28, 20, 9) + flor(72, 18, 8) + flor(50, 15, 10, P.coral);
      return s + `<rect x="16" y="42" width="68" height="44" rx="3" fill="#fff"/>
        <path d="M16 86 L44 62 M84 86 L56 62" stroke="${P.celeste}" stroke-width="2"/>
        <path d="M16 44 L50 68 L84 44" fill="#fff" stroke="${P.celeste}" stroke-width="2" stroke-linejoin="round"/>
        ${corazon(50, 66, 6.5, P.rojo)}`;
    },
    esferas() {
      const bolas = [[26, 52, 13, P.rojo, "zig"], [52, 70, 15, P.azul, "puntos"], [77, 44, 12, P.amarillo, "rayas"]];
      let s = "";
      for (const [x, y, r, c, pat] of bolas) {
        s += `<path d="M${x} 0 V${y - r - 5}" stroke="${P.crema}" stroke-width="1.2"/><rect x="${x - 4}" y="${y - r - 6}" width="8" height="6" rx="1.5" fill="${P.ocre}"/><circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;
        if (pat === "zig") { let d = `M${x - r + 1.5} ${y}`; for (let i = 1; i <= 6; i++) d += ` L${f(x - r + 1.5 + i * (2 * r - 3) / 6)} ${y + (i % 2 ? -4 : 0)}`; s += `<path d="${d}" fill="none" stroke="#fff" stroke-width="2"/>`; }
        if (pat === "puntos") for (const [dx, dy] of [[-7, -5], [0, -8], [7, -5], [-9, 3], [0, 1], [9, 3], [-4, 9], [4, 9]]) s += `<circle cx="${x + dx}" cy="${y + dy}" r="1.8" fill="#fff"/>`;
        if (pat === "rayas") s += `<path d="M${f(x - r * .95)} ${y - 3} H${f(x + r * .95)} M${f(x - r * .95)} ${y + 3} H${f(x + r * .95)}" stroke="${P.rojo}" stroke-width="2.4"/>`;
        s += `<ellipse cx="${f(x - r * .4)}" cy="${f(y - r * .42)}" rx="${f(r * .2)}" ry="${f(r * .32)}" fill="#fff" opacity=".45" transform="rotate(35 ${f(x - r * .4)} ${f(y - r * .42)})"/>`;
      }
      return s + estrella(12, 86, 3.6, 1.5, P.amarillo) + estrella(88, 82, 4.2, 1.8, P.crema) + `<circle cx="38" cy="90" r="1.5" fill="#fff"/><circle cx="64" cy="14" r="1.3" fill="#fff"/><circle cx="12" cy="20" r="1.3" fill="#fff"/>`;
    },
    munieco() {
      const copos = [[22, 30], [76, 26], [30, 18], [70, 60], [20, 56], [82, 44], [60, 16], [38, 82]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6" fill="#fff"/>`).join("");
      return `<circle cx="50" cy="52" r="42" fill="${P.celeste}"/>${copos}
        <circle cx="50" cy="73" r="19" fill="#fff"/><circle cx="50" cy="46" r="14" fill="#fff"/>
        <rect x="39" y="20" width="22" height="16" rx="2" fill="${P.carbon}"/><rect x="34" y="34" width="32" height="5" rx="2.5" fill="${P.carbon}"/><rect x="39" y="29" width="22" height="4" fill="${P.rojo}"/>
        <circle cx="45" cy="44" r="1.8" fill="${P.carbon}"/><circle cx="55" cy="44" r="1.8" fill="${P.carbon}"/>
        <path d="M50 47.5 L62 50 L50 52Z" fill="#f08a24"/>
        <circle cx="41.5" cy="50" r="2.6" fill="${P.coral}" opacity=".7"/><circle cx="58.5" cy="50" r="2.6" fill="${P.coral}" opacity=".7"/>
        <path d="M45 53.5 q5 3 10 0" stroke="${P.carbon}" stroke-width="1.3" fill="none" stroke-linecap="round"/>
        <path d="M35 57 Q50 64 65 57 L65 62 Q50 69 35 62Z" fill="${P.rojo}"/><path d="M57 61 l7 15 -6 1.5 -4 -14z" fill="${P.rojoOsc}"/>
        <circle cx="50" cy="71" r="2" fill="${P.carbon}"/><circle cx="50" cy="79" r="2" fill="${P.carbon}"/>
        <path d="M32 70 L20 60 M68 70 L80 60" stroke="${P.cafe}" stroke-width="2" stroke-linecap="round"/>`;
    },
    corona() {
      let s = `<circle cx="50" cy="47" r="27" fill="none" stroke="${P.pino}" stroke-width="14"/>`;
      for (let i = 0; i < 22; i++) {
        const a = i / 22 * 2 * Math.PI, rr = 27 + (i % 2 ? 5 : -5);
        const x = 50 + rr * Math.cos(a + .12), y = 47 + rr * Math.sin(a + .12);
        s += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="7.5" ry="3.4" fill="${i % 2 ? P.verdeOsc : P.verde}" transform="rotate(${f(a * 180 / Math.PI + 70)} ${f(x)} ${f(y)})"/>`;
      }
      for (let i = 0; i < 9; i++) {
        const a = i / 9 * 2 * Math.PI + .3, x = 50 + 27 * Math.cos(a), y = 47 + 27 * Math.sin(a);
        s += `<circle cx="${f(x)}" cy="${f(y)}" r="3" fill="${P.rojo}"/><circle cx="${f(x + 3)}" cy="${f(y + 1.5)}" r="2.2" fill="${P.rojo}"/>`;
      }
      return s + mono(50, 76, 0, P.rojo, P.rojoOsc, 1.15);
    },
    arbol() {
      let s = `<rect x="45" y="78" width="10" height="12" rx="2" fill="${P.cafe}"/>
        <path d="M50 12 L72 40 H62 L80 60 H66 L86 82 H14 L34 60 H20 L38 40 H28Z" fill="${P.verdeOsc}"/>
        <path d="M50 12 L72 40 H62 L80 60 H66 L86 82 H50Z" fill="${P.pino}"/>
        <path d="M33 50 Q50 58 70 46 M26 71 Q50 79 77 66" fill="none" stroke="${P.crema}" stroke-width="1.8" stroke-dasharray="1 3.5" stroke-linecap="round"/>`;
      for (const [x, y, c] of [[42, 34, P.rojo], [56, 44, P.amarillo], [38, 55, P.crema], [62, 58, P.rojo], [48, 66, P.amarillo], [30, 75, P.rojo], [70, 76, P.crema], [57, 73, P.azul]])
        s += `<circle cx="${x}" cy="${y}" r="3.2" fill="${c}"/>`;
      return s + estrella(50, 11, 8.5, 3.8, P.amarillo);
    },
    guantes() {
      const guante = (x, y, rot, c, espejo) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${espejo ? -1 : 1} 1)">
        <ellipse cx="-12" cy="-1" rx="5" ry="8" fill="${c}" transform="rotate(-25 -12 -1)"/>
        <path d="M-12 22 V-6 a12 14 0 0 1 24 0 V22Z" fill="${c}"/>
        <rect x="-14" y="18" width="28" height="10" rx="3" fill="#fff"/>
        <path d="M-12 23 h24" stroke="${P.celeste}" stroke-width="1.6" stroke-dasharray="2 2"/>
        ${corazon(0, 4, 5, P.amarillo)}</g>`;
      return `<path d="M31 74 C30 98 70 98 69 74" fill="none" stroke="${P.azulOsc}" stroke-width="1.6"/>` +
        guante(32, 46, -12, P.azul, false) + guante(68, 46, 12, P.azul, true) +
        `<circle cx="50" cy="18" r="5" fill="none" stroke="${P.azulOsc}" stroke-width="1.6"/>`;
    },
    regalo() {
      return caja(50, 88, 52, 40, P.verde, P.verdeOsc, P.rojo) +
        [[32, 58], [32, 74], [66, 58], [66, 74], [40, 66], [60, 82]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="#fff" opacity=".8"/>`).join("") +
        brillos([[16, 26, 4.2], [86, 30, 3.6], [84, 70, 3]]);
    },
    estrella() {
      return estrella(50, 52, 36, 16, P.amarillo) + estrella(50, 52, 24, 10.5, "#ffe08a") +
        brillos([[14, 18, 5], [86, 20, 4], [86, 84, 5], [14, 82, 3.5], [50, 8, 3]], "#fff");
    },
    casita() {
      let s = `<circle cx="50" cy="54" r="44" fill="${P.celeste}"/>` +
        [[16, 40], [84, 36], [24, 76], [78, 78], [30, 22], [70, 18]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.6" fill="#fff"/>`).join("") +
        `<rect x="62" y="22" width="9" height="18" fill="${P.cafe}"/><rect x="60" y="19" width="13" height="5" rx="2" fill="#fff"/>
        <path d="M24 50 L50 27 L76 50 V86 H24Z" fill="${P.cafeClaro}"/>
        <path d="M17 53 L50 22 L83 53" fill="none" stroke="#fff" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/>`;
      for (let i = 0; i < 6; i++) {
        const t = (i + .5) / 6, xl = 50 - t * 33, y = 22 + t * 31, xr = 50 + t * 33;
        s += `<circle cx="${f(xl)}" cy="${f(y + 4.5)}" r="2.6" fill="#fff"/><circle cx="${f(xr)}" cy="${f(y + 4.5)}" r="2.6" fill="#fff"/>`;
      }
      s += [[37, 34, P.rojo], [63, 34, P.verde], [50, 22, P.amarillo], [26, 45, P.verde], [74, 45, P.rojo]].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="3" fill="${c}"/>`).join("");
      return s + `<path d="M42 86 V71 a8 8 0 0 1 16 0 V86Z" fill="${P.cafe}"/><circle cx="54" cy="79" r="1.4" fill="${P.amarillo}"/>
        <rect x="29" y="58" width="11" height="11" rx="2" fill="${P.amarillo}"/><rect x="60" y="58" width="11" height="11" rx="2" fill="${P.amarillo}"/>
        <path d="M34.5 58 V69 M29 63.5 H40 M65.5 58 V69 M60 63.5 H71" stroke="#fff" stroke-width="1.6"/>
        ${corazon(50, 49, 5, P.rojo)}<path d="M24 86 H76" stroke="#fff" stroke-width="3" stroke-dasharray="3 3"/>`;
    },
    sueter() {
      return `<path d="M30 22 L40 18 Q50 27 60 18 L70 22 L90 50 L79 58 L70 46 V88 H30 V46 L21 58 L10 50Z" fill="${P.rojo}"/>
        <path d="M40 18 Q50 27 60 18" fill="none" stroke="${P.rojoOsc}" stroke-width="4"/>
        <path d="M30 83 H70" stroke="${P.rojoOsc}" stroke-width="4"/>
        <path d="M30 52 L35 47 L40 52 L45 47 L50 52 L55 47 L60 52 L65 47 L70 52" fill="none" stroke="#fff" stroke-width="2"/>
        <path d="M30 67 L35 72 L40 67 L45 72 L50 67 L55 72 L60 67 L65 72 L70 67" fill="none" stroke="#fff" stroke-width="2"/>
        ${[35, 45, 55, 65].map(x => `<path d="M${x} 56 l2.5 3.5 -2.5 3.5 -2.5 -3.5z" fill="${P.amarillo}"/>`).join("")}
        ${[40, 50, 60].map(x => estrella(x, 37, 3.4, 1.5, "#fff")).join("")}
        <path d="M80 57 L90.5 49.5 M20 57 L9.5 49.5" stroke="${P.rojoOsc}" stroke-width="4" stroke-linecap="round"/>`;
    },
    acebo() {
      const hoja = (rot, c) => `<g transform="translate(50 52) rotate(${rot})"><path d="M2 0 Q6 -8 11 -5 Q14 -11 19 -7 Q23 -12 27 -7 Q32 -10 38 0 Q32 10 27 7 Q23 12 19 7 Q14 11 11 5 Q6 8 2 0Z" fill="${c}"/><path d="M5 0 H34" stroke="#000" stroke-opacity=".18" stroke-width="1.2"/></g>`;
      return hoja(-155, P.verde) + hoja(-25, P.pino) + hoja(95, P.verdeOsc) + hoja(205, P.pino) +
        [[45, 47], [55, 47], [50, 56]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6.5" fill="${P.rojo}"/><circle cx="${x - 2}" cy="${y - 2}" r="1.8" fill="#fff" opacity=".6"/>`).join("") +
        brillos([[86, 20, 3.6], [14, 86, 3]], P.carbon);
    },
    campana() {
      const camp = (x, y, rot) => `<g transform="translate(${x} ${y}) rotate(${rot})"><circle cy="22" r="5" fill="${P.ocre}"/>
        <path d="M0 -22 C-11 -22 -15 -10 -15 4 C-15 12 -19 15 -21 19 H21 C19 15 15 12 15 4 C15 -10 11 -22 0 -22Z" fill="${P.amarillo}"/>
        <path d="M-21 19 H21" stroke="${P.ocre}" stroke-width="3"/>
        <path d="M-6 -14 C-10 -8 -11 0 -11 8" stroke="#fff" stroke-width="2.4" fill="none" opacity=".6" stroke-linecap="round"/></g>`;
      return camp(37, 60, -16) + camp(63, 60, 16) +
        `<ellipse cx="40" cy="28" rx="4" ry="9" fill="${P.pino}" transform="rotate(-60 40 28)"/><ellipse cx="60" cy="28" rx="4" ry="9" fill="${P.pino}" transform="rotate(60 60 28)"/>` +
        mono(50, 32, 0, P.rojo, P.rojoOsc) + brillos([[14, 24, 4], [86, 86, 3.4]]);
    },
    calceta() {
      return `<path d="M44 14 V4 a6 6 0 0 1 12 0" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>
        <path d="M44 14 V4 a6 6 0 0 1 12 0" fill="none" stroke="${P.rojo}" stroke-width="5" stroke-dasharray="3 4"/>
        ${caja(60, 18, 14, 12, P.azul, P.azulOsc, P.amarillo)}
        <path d="M36 22 H64 V56 Q64 62 70 66 L82 73 Q92 80 85 89 Q78 96 66 89 L42 76 Q34 70 36 60Z" fill="${P.rojo}"/>
        <path d="M73 68 L82 73 Q92 80 85 89 Q82 92 77 92 Q85 80 73 68Z" fill="#fff"/>
        <path d="M36 40 H64 M36 50 H64" stroke="#fff" stroke-width="3" stroke-dasharray="4 3"/>
        <rect x="32" y="12" width="36" height="14" rx="4" fill="#fff"/>
        ${brillos([[16, 40, 4.4], [86, 30, 3.6], [20, 80, 3]])}`;
    },
    regalos() {
      return caja(68, 90, 40, 46, P.crema, "#fff", P.rojo) + caja(30, 90, 30, 26, P.verde, P.verdeOsc, P.rojo) +
        caja(31, 56, 20, 16, P.amarillo, P.ocre, P.rojo) +
        [[58, 60], [78, 60], [58, 78], [78, 78]].map(([x, y]) => estrella(x, y, 3, 1.3, P.azul)).join("") +
        brillos([[12, 22, 4], [88, 14, 3]]);
    },
    nochebuena() {
      const una = (cx, cy, e) => {
        let s = "";
        for (let i = 0; i < 5; i++) s += `<path transform="translate(${cx} ${cy}) rotate(${i * 72 + 36}) scale(${e})" d="M0 0 Q12 -16 0 -40 Q-12 -16 0 0Z" fill="${i % 2 ? P.verdeOsc : P.verde}"/>`;
        for (const i of [1, 3, 5, 7, 0, 2, 4, 6]) s += `<path transform="translate(${cx} ${cy}) rotate(${i * 45}) scale(${f(e * (i % 2 ? .78 : 1))})" d="M0 0 Q11 -14 0 -34 Q-11 -14 0 0Z" fill="${i % 2 ? P.rojoOsc : P.rojo}"/>`;
        for (let i = 0; i < 6; i++) { const a = i / 6 * 2 * Math.PI; s += `<circle cx="${f(cx + 4 * e * Math.cos(a))}" cy="${f(cy + 4 * e * Math.sin(a))}" r="${f(2.4 * e)}" fill="${P.amarillo}"/>`; }
        return s;
      };
      return una(70, 26, .42) + una(24, 80, .38) + una(46, 54, .78);
    },
    galleta() {
      return `<g stroke="${P.cafeClaro}" stroke-linecap="round" fill="none"><path d="M50 38 V62" stroke-width="24"/><path d="M27 48 L73 48" stroke-width="13"/><path d="M50 60 L37 85 M50 60 L63 85" stroke-width="14"/></g>
        <circle cx="50" cy="26" r="14" fill="${P.cafeClaro}"/>
        <g stroke="#fff" stroke-width="1.8" fill="none" stroke-linecap="round"><path d="M24 45 q2.5 3 0 6 M76 45 q-2.5 3 0 6 M32 84 q3.5 2.5 7 0 M61 84 q3.5 2.5 7 0"/><path d="M44 30 q6 5 12 0"/></g>
        <circle cx="45" cy="23" r="2" fill="${P.carbon}"/><circle cx="55" cy="23" r="2" fill="${P.carbon}"/>
        <path d="M42 37 L50 41 L42 45Z M58 37 L50 41 L58 45Z" fill="${P.rojo}"/>
        <circle cx="50" cy="51" r="2.8" fill="${P.verde}"/><circle cx="50" cy="60" r="2.8" fill="${P.rojo}"/>
        ${brillos([[16, 22, 4], [86, 24, 3.4], [84, 80, 3]], "#fff")}`;
    },
    copo() {
      let s = `<g stroke="#fff" stroke-width="3.4" stroke-linecap="round" fill="none">`;
      for (let i = 0; i < 6; i++) s += `<g transform="rotate(${i * 60} 50 50)"><path d="M50 50 V14 M50 26 L42 18 M50 26 L58 18 M50 38 L43 32 M50 38 L57 32"/></g>`;
      return s + `</g><circle cx="50" cy="50" r="5.5" fill="#fff"/>` +
        [[14, 16, 2], [86, 18, 1.6], [16, 84, 1.6], [84, 86, 2], [10, 50, 1.3], [90, 52, 1.3]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity=".8"/>`).join("");
    },
    luces() {
      const cols = [P.rojo, P.amarillo, P.azul, P.verde, P.coral, P.amarillo];
      const pts = [[12, 33, -20], [26, 39, -5], [40, 35, 15], [60, 22, -15], [74, 19, 0], [88, 25, 20]];
      let s = `<path d="M4 26 Q27 48 50 28 Q73 10 96 30" fill="none" stroke="${P.carbon}" stroke-width="1.6"/>`;
      pts.forEach(([x, y, r], i) => {
        s += `<g transform="translate(${x} ${y}) rotate(${r})"><rect x="-2.6" y="0" width="5.2" height="4.5" rx="1" fill="${P.carbon}"/><path d="M0 4 C-7 8 -6 19 0 21 C6 19 7 8 0 4Z" fill="${cols[i]}"/><ellipse cx="-1.8" cy="11" rx="1.2" ry="3" fill="#fff" opacity=".5"/></g>`;
      });
      const casas = [[8, 22, P.rojo], [21, 30, P.amarillo], [34, 20, P.azul], [47, 34, P.coral], [60, 24, P.verde], [73, 30, P.amarillo], [86, 22, P.azul]];
      casas.forEach(([x, h, c]) => {
        s += `<path d="M${x - 6} 92 V${92 - h} L${x} ${92 - h - 7} L${x + 6} ${92 - h} V92Z" fill="${c}"/><rect x="${x - 2}" y="${92 - h + 4}" width="4" height="5" rx="1" fill="#fff"/>`;
        if (h > 24) s += `<rect x="${x - 2}" y="${92 - h + 13}" width="4" height="5" rx="1" fill="#fff"/>`;
      });
      return s;
    },
    pastelito() {
      return `<path d="M28 58 H72 L66 88 H34Z" fill="${P.cafeClaro}"/>
        <path d="M36 58 L38 88 M44 58 L45 88 M52 58 L52 88 M60 58 L59 88 M67 58 L64.5 88" stroke="${P.cafe}" stroke-width="1.6" opacity=".45"/>
        <path d="M24 60 Q22 46 34 44 Q36 32 50 32 Q64 32 66 44 Q78 46 76 60 Q70 64 62 60 Q56 65 50 60 Q44 65 38 60 Q30 64 24 60Z" fill="#fff"/>
        <g stroke-width="2.4" stroke-linecap="round"><path d="M34 50 l2 2" stroke="${P.rojo}"/><path d="M44 42 l3 0" stroke="${P.verde}"/><path d="M58 44 l2 2" stroke="${P.azul}"/><path d="M66 52 l-2 2" stroke="${P.rojo}"/><path d="M48 52 l2 -2" stroke="${P.azul}"/></g>
        <ellipse cx="42" cy="30" rx="4" ry="8" fill="${P.pino}" transform="rotate(-55 42 30)"/><ellipse cx="58" cy="30" rx="4" ry="8" fill="${P.verdeOsc}" transform="rotate(55 58 30)"/>
        <circle cx="50" cy="28" r="6.5" fill="${P.rojo}"/><circle cx="48" cy="26" r="1.8" fill="#fff" opacity=".6"/>
        ${brillos([[14, 22, 4.2], [86, 20, 3.6], [86, 78, 3]], "#fff")}`;
    },
    globo() {
      const copos = [[38, 26], [60, 22], [70, 36], [30, 42], [52, 34], [44, 18], [66, 50]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.5" fill="#fff"/>`).join("");
      return `<circle cx="50" cy="44" r="32" fill="${P.celeste}"/>
        <path d="M22 58 Q50 46 78 58 A32 32 0 0 1 22 58Z" fill="#fff"/>
        <path d="M38 30 L46 44 H42 L48 54 H28 L34 44 H30Z" fill="${P.pino}"/>
        <path d="M54 46 L62 38 L70 46 V58 H54Z" fill="${P.rojo}"/><rect x="60" y="50" width="4" height="8" fill="${P.carbon}"/>
        ${copos}
        <path d="M30 24 A26 26 0 0 1 48 15" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".75"/>
        <path d="M26 74 H74 L69 90 H31Z" fill="${P.rojo}"/><rect x="22" y="71" width="56" height="7" rx="3.5" fill="${P.amarillo}"/>
        ${corazon(50, 83, 3.2, P.amarillo)}`;
    },
    navidad() {
      return `<g transform="translate(8 0) scale(.84)">${M.arbol()}</g>` +
        caja(18, 96, 20, 15, P.amarillo, P.ocre, P.rojo) + caja(82, 96, 22, 18, P.azul, P.azulOsc, P.amarillo) + caja(66, 96, 12, 10, P.verde, P.verdeOsc, P.rojo) +
        brillos([[12, 18, 4.5], [88, 26, 4], [18, 56, 3], [86, 62, 3]]);
    }
  };

  // Ilustraciones de las mesas de juego
  const MESAS = {
    ruleta() {
      let s = `<circle cx="50" cy="50" r="40" fill="${P.cafe}"/><circle cx="50" cy="50" r="36" fill="${P.amarillo}"/>`;
      const n = 18;
      for (let i = 0; i < n; i++) {
        const a0 = i / n * 2 * Math.PI - Math.PI / 2, a1 = (i + 1) / n * 2 * Math.PI - Math.PI / 2;
        s += `<path d="M50 50 L${f(50 + 33 * Math.cos(a0))} ${f(50 + 33 * Math.sin(a0))} A33 33 0 0 1 ${f(50 + 33 * Math.cos(a1))} ${f(50 + 33 * Math.sin(a1))}Z" fill="${i === 0 ? "#2e8b57" : i % 2 ? P.rojo : P.carbon}"/>`;
      }
      return s + `<circle cx="50" cy="50" r="19" fill="${P.cafe}" stroke="${P.amarillo}" stroke-width="2"/><path d="M50 36 V64 M36 50 H64" stroke="${P.amarillo}" stroke-width="3" stroke-linecap="round"/><circle cx="50" cy="50" r="5" fill="${P.amarillo}"/><circle cx="58" cy="22" r="3.4" fill="#fff"/>`;
    },
    blackjack() {
      const carta = (x, y, rot, r, p, c) => `<g transform="translate(${x} ${y}) rotate(${rot})"><rect x="-18" y="-25" width="36" height="50" rx="4" fill="#fff"/><text x="-13" y="-10" font-size="12" font-weight="700" fill="${c}" font-family="Georgia,serif">${r}</text><text x="0" y="12" font-size="22" text-anchor="middle" fill="${c}" font-family="Georgia,serif">${p}</text></g>`;
      return `<ellipse cx="50" cy="84" rx="30" ry="5" fill="#000" opacity=".15"/>` + carta(40, 52, -12, "A", "♥", P.rojo) + carta(60, 50, 10, "K", "♠", P.carbon);
    }
  };

  const CANDADO = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 10.5V7.5a4.5 4.5 0 0 1 9 0v3" fill="none" stroke="currentColor" stroke-width="2.4"/><rect x="5" y="10" width="14" height="11" rx="2.8" fill="currentColor"/></svg>`;

  function guirnalda(n = 13) {
    const cols = [P.rojo, P.amarillo, P.verde, P.azul, P.coral];
    let s = `<path d="M0 6 Q150 34 300 6 Q450 34 600 6" fill="none" stroke="${P.carbon}" stroke-opacity=".35" stroke-width="1.4"/>`;
    for (let i = 0; i < n; i++) {
      const x = (i + .5) * 600 / n, t = (x % 300) / 300, y = 6 + 28 * 2 * t * (1 - t) * 1;
      s += `<path d="M${f(x - 9)} ${f(y - 1)} H${f(x + 9)} L${f(x)} ${f(y + 20)}Z" fill="${cols[i % cols.length]}"/>`;
    }
    return `<svg viewBox="0 0 600 40" preserveAspectRatio="none" aria-hidden="true">${s}</svg>`;
  }

  raiz.Ilustraciones = { P, motivos: M, mesas: MESAS, CANDADO, guirnalda };
})(typeof self !== "undefined" ? self : this);
