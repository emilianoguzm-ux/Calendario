/* ============================================================
   Lógica pura de los juegos (sin pantalla).
   La usa index.html en el navegador y tests/logica.test.js en Node.
   ============================================================ */
(function (raiz, fabrica) {
  const L = fabrica();
  if (typeof module === "object" && module.exports) module.exports = L;
  else raiz.Logica = L;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ------------------------------------------------------------
  // Azar
  // ------------------------------------------------------------
  function semillaDeTexto(txt) {
    let h = 1779033703 ^ txt.length;
    for (let i = 0; i < txt.length; i++) {
      h = Math.imul(h ^ txt.charCodeAt(i), 3432918353);
      h = (h << 13) | (h >>> 19);
    }
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^ (h >>> 16)) >>> 0;
  }
  /** Generador reproducible (mulberry32): misma semilla → misma secuencia. */
  function crearAzar(semilla) {
    let a = typeof semilla === "string" ? semillaDeTexto(semilla) : semilla >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const elegir = (arr, azar = Math.random) => arr[Math.floor(azar() * arr.length)];
  function barajar(arr, azar = Math.random) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(azar() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  // ------------------------------------------------------------
  // Cápsulas del gachapon
  // ------------------------------------------------------------
  /** Orden fijo de cápsulas: el día d recibe orden[d-1]. Nunca se repiten
      y, como depende solo de la semilla, el número de cada día es el mismo
      aunque se borre el navegador o se abra en otro dispositivo. */
  function ordenCapsulas(semilla, total) {
    return barajar(Array.from({ length: total }, (_, i) => i + 1), crearAzar("capsulas:" + semilla));
  }

  // ------------------------------------------------------------
  // Fechas
  // ------------------------------------------------------------
  /** La puerta del día d se puede abrir desde la medianoche (hora local) del d de diciembre en adelante. */
  function puertaAbierta(dia, ahora, anio) {
    if (!Number.isInteger(dia) || dia < 1 || dia > 25 || !(ahora instanceof Date) || isNaN(ahora)) return false;
    return ahora.getTime() >= new Date(anio, 11, dia).getTime();
  }
  const esHoyDia = (dia, ahora, anio) => ahora.getFullYear() === anio && ahora.getMonth() === 11 && ahora.getDate() === dia;

  // ------------------------------------------------------------
  // Diseño del mosaico: [fila, columna, alto, ancho] (empiezan en 1)
  // ------------------------------------------------------------
  const DISENO = {
    escritorio: {
      columnas: 6, filas: 7,
      piezas: {
        1: [1, 1, 1, 2], 2: [1, 3, 2, 1], 3: [1, 4, 1, 1], 4: [1, 5, 1, 2],
        5: [2, 1, 1, 1], 6: [2, 2, 2, 1], 25: [2, 4, 2, 2], 7: [2, 6, 1, 1],
        8: [3, 1, 1, 1], 9: [3, 3, 1, 1], 10: [3, 6, 2, 1],
        11: [4, 1, 1, 2], 12: [4, 3, 1, 1], 13: [4, 4, 2, 1], 14: [4, 5, 1, 1],
        15: [5, 1, 2, 1], 16: [5, 2, 1, 1], 17: [5, 3, 1, 1], 18: [5, 5, 1, 2],
        tragamonedas: [6, 2, 1, 2], 19: [6, 4, 1, 1], 20: [6, 5, 1, 1], 21: [6, 6, 1, 1],
        22: [7, 1, 1, 1], ruleta: [7, 2, 1, 1], blackjack: [7, 3, 1, 1], 23: [7, 4, 1, 2], 24: [7, 6, 1, 1]
      }
    },
    celular: {
      columnas: 4, filas: 11,
      piezas: {
        1: [1, 1, 1, 2], 2: [1, 3, 2, 1], 3: [1, 4, 1, 1],
        4: [2, 1, 1, 1], 5: [2, 2, 1, 1], 6: [2, 4, 2, 1],
        25: [3, 1, 2, 2], 7: [3, 3, 1, 1],
        8: [4, 3, 1, 2],
        9: [5, 1, 2, 1], 10: [5, 2, 1, 1], 11: [5, 3, 1, 1], 12: [5, 4, 2, 1],
        13: [6, 2, 1, 2],
        14: [7, 1, 1, 1], 15: [7, 2, 2, 1], 16: [7, 3, 1, 2],
        17: [8, 1, 1, 1], 18: [8, 3, 1, 1], 19: [8, 4, 1, 1],
        20: [9, 1, 1, 2], 21: [9, 3, 1, 2],
        22: [10, 1, 1, 1], 23: [10, 2, 1, 1], 24: [10, 3, 1, 2],
        tragamonedas: [11, 1, 1, 2], ruleta: [11, 3, 1, 1], blackjack: [11, 4, 1, 1]
      }
    }
  };
  const formaDe = ([, , alto, ancho]) => alto === 2 && ancho === 2 ? "grande" : alto === 2 ? "alto" : ancho === 2 ? "ancho" : "chico";
  /** Revisa que las piezas cubran la cuadrícula sin huecos ni encimarse. */
  function revisarDiseno(d) {
    const ocupado = Array.from({ length: d.filas }, () => Array(d.columnas).fill(null));
    const choques = [], fuera = [];
    for (const [id, [f, c, h, w]] of Object.entries(d.piezas)) {
      for (let y = f; y < f + h; y++) for (let x = c; x < c + w; x++) {
        if (y < 1 || y > d.filas || x < 1 || x > d.columnas) { fuera.push(id); continue; }
        if (ocupado[y - 1][x - 1] !== null) choques.push(`${ocupado[y - 1][x - 1]} y ${id} en ${y},${x}`);
        ocupado[y - 1][x - 1] = id;
      }
    }
    const huecos = [];
    ocupado.forEach((fila, y) => fila.forEach((v, x) => { if (v === null) huecos.push(`${y + 1},${x + 1}`); }));
    return { ok: !choques.length && !huecos.length && !fuera.length, choques, huecos, fuera };
  }

  // ------------------------------------------------------------
  // Ruleta europea
  // ------------------------------------------------------------
  const RUEDA = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
  const ROJOS = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);
  const colorDe = n => n === 0 ? "verde" : ROJOS.has(n) ? "rojo" : "negro";
  const CLAVES_RULETA = ["rojo", "negro", "par", "impar", "bajo", "alto", "doc1", "doc2", "doc3", "col1", "col2", "col3"]
    .concat(Array.from({ length: 37 }, (_, i) => "n:" + i));

  /** Cuánto regresa una apuesta si sale n (incluye lo apostado; 0 si pierde). */
  function pagoRuleta(clave, monto, n) {
    if (clave.startsWith("n:")) return +clave.slice(2) === n ? monto * 36 : 0;
    if (n === 0) return 0;
    const gana = {
      rojo: ROJOS.has(n), negro: !ROJOS.has(n), par: n % 2 === 0, impar: n % 2 === 1,
      bajo: n <= 18, alto: n >= 19,
      doc1: n <= 12, doc2: n > 12 && n <= 24, doc3: n > 24,
      col1: n % 3 === 1, col2: n % 3 === 2, col3: n % 3 === 0
    }[clave];
    if (!gana) return 0;
    return clave.startsWith("doc") || clave.startsWith("col") ? monto * 3 : monto * 2;
  }
  const totalApostado = apuestas => Object.values(apuestas).reduce((a, b) => a + b, 0);
  const pagoTotalRuleta = (apuestas, n) => Object.entries(apuestas).reduce((s, [k, m]) => s + pagoRuleta(k, m, n), 0);

  /** Elige el número ganador. Con suerte = null es una ruleta justa.
      Con suerte = 0.75, el 75 % de las veces cae en un número que hace ganar. */
  function elegirNumero(apuestas, suerte, azar = Math.random) {
    const todos = Array.from({ length: 37 }, (_, i) => i);
    if (suerte == null) return elegir(todos, azar);
    const apostado = totalApostado(apuestas);
    const ganan = todos.filter(n => pagoTotalRuleta(apuestas, n) > apostado);
    const pierden = todos.filter(n => pagoTotalRuleta(apuestas, n) <= apostado);
    if (azar() < suerte) return elegir(ganan.length ? ganan : todos, azar);
    return elegir(pierden.length ? pierden : todos, azar);
  }

  // ------------------------------------------------------------
  // Blackjack
  // ------------------------------------------------------------
  const PALOS = ["♠", "♥", "♦", "♣"];
  const RANGOS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  function crearZapato(mazos = 6, azar = Math.random) {
    const z = [];
    for (let m = 0; m < mazos; m++) for (const p of PALOS) for (const r of RANGOS) z.push({ r, p });
    return barajar(z, azar);
  }
  const valorCarta = c => c.r === "A" ? 11 : (c.r === "J" || c.r === "Q" || c.r === "K") ? 10 : +c.r;
  function totalMano(cartas) {
    let t = 0, ases = 0;
    for (const c of cartas) { t += valorCarta(c); if (c.r === "A") ases++; }
    while (t > 21 && ases) { t -= 10; ases--; }
    return { t, blanda: ases > 0 };
  }
  const esBlackjack = cs => cs.length === 2 && totalMano(cs).t === 21;
  /** El crupier pide con 16 o menos y se planta en cualquier 17 (incluso suave). */
  const crupierPide = cs => totalMano(cs).t < 17;
  const crupierRevisa = arriba => valorCarta(arriba) >= 10;   // As o 10 a la vista
  const puedeDividir = (mano, manosEnJuego, saldo) =>
    manosEnJuego === 1 && mano.cartas.length === 2 &&
    valorCarta(mano.cartas[0]) === valorCarta(mano.cartas[1]) && saldo >= mano.apuesta;
  const puedeDoblar = (mano, saldo) => mano.cartas.length === 2 && saldo >= mano.apuesta;

  /** Resultado y pago (incluye la apuesta devuelta) de cada mano. */
  function liquidarBlackjack(manos, crupier) {
    const d = totalMano(crupier).t, dBJ = esBlackjack(crupier), dividida = manos.length > 1;
    let pagado = 0, apostado = 0;
    const res = manos.map(m => {
      const p = totalMano(m.cartas).t, bj = !dividida && esBlackjack(m.cartas);
      let pago = 0, resultado;
      if (p > 21) resultado = "pasado";
      else if (bj && dBJ) { pago = m.apuesta; resultado = "empate"; }
      else if (bj) { pago = m.apuesta + Math.floor(m.apuesta * 1.5); resultado = "blackjack"; }
      else if (dBJ) resultado = "bjCrupier";
      else if (d > 21) { pago = m.apuesta * 2; resultado = "crupierPasado"; }
      else if (p > d) { pago = m.apuesta * 2; resultado = "gana"; }
      else if (p === d) { pago = m.apuesta; resultado = "empate"; }
      else resultado = "pierde";
      pagado += pago; apostado += m.apuesta;
      return { resultado, pago };
    });
    return { manos: res, pagado, apostado, neto: pagado - apostado };
  }

  // ------------------------------------------------------------
  // Tragamonedas pirata: 5 rodillos × 3 filas, 10 líneas
  // ------------------------------------------------------------
  const SIMBOLOS = {
    W: { emoji: "☠️", nombre: "Calavera", nota: "comodín: sustituye a todos menos al botín" },
    S: { emoji: "💰", nombre: "Botín", nota: "paga en cualquier lugar" },
    A: { emoji: "👑", nombre: "Corona" },
    B: { emoji: "💎", nombre: "Diamante" },
    C: { emoji: "🦜", nombre: "Loro" },
    D: { emoji: "🗺️", nombre: "Mapa" },
    E: { emoji: "🧭", nombre: "Brújula" },
    F: { emoji: "⚓", nombre: "Ancla" },
    G: { emoji: "⚔️", nombre: "Espadas" },
    H: { emoji: "🍾", nombre: "Ron" }
  };
  // Veces que aparece cada símbolo en cada rodillo (32 casillas por rodillo)
  const COMPOSICION = { W: 2, S: 2, A: 2, B: 3, C: 3, D: 4, E: 4, F: 4, G: 4, H: 4 };
  // Pago por línea en múltiplos de la apuesta por línea (apuesta total / 10)
  const TABLA = {
    W: { 3: 50, 4: 200, 5: 1000 },
    A: { 3: 30, 4: 120, 5: 500 },
    B: { 3: 25, 4: 75, 5: 300 },
    C: { 3: 20, 4: 60, 5: 200 },
    D: { 3: 12, 4: 40, 5: 125 },
    E: { 3: 10, 4: 25, 5: 100 },
    F: { 3: 7, 4: 20, 5: 60 },
    G: { 3: 7, 4: 20, 5: 60 },
    H: { 3: 6, 4: 12, 5: 50 }
  };
  // El botín paga en múltiplos de la apuesta total, esté donde esté
  const TABLA_BOTIN = { 3: 3, 4: 15, 5: 75 };
  const LINEAS = [
    [1, 1, 1, 1, 1], [0, 0, 0, 0, 0], [2, 2, 2, 2, 2], [0, 1, 2, 1, 0], [2, 1, 0, 1, 2],
    [0, 0, 1, 2, 2], [2, 2, 1, 0, 0], [1, 0, 0, 0, 1], [1, 2, 2, 2, 1], [1, 2, 1, 0, 1]
  ];
  const APUESTAS_SLOT = [10, 20, 50, 100];

  /** Rodillos fijos (siempre iguales) con los botines separados entre sí,
      para que un rodillo nunca muestre dos botines a la vez. */
  const TIRAS = Array.from({ length: 5 }, (_, i) => {
    const base = [];
    for (const [s, n] of Object.entries(COMPOSICION)) for (let k = 0; k < n; k++) base.push(s);
    const azar = crearAzar("rodillo:" + i);
    for (let intento = 0; intento < 1000; intento++) {
      const t = barajar(base, azar);
      const pos = t.map((s, j) => s === "S" ? j : -1).filter(j => j >= 0);
      const separados = pos.every(a => pos.every(b => a === b || Math.min(Math.abs(a - b), t.length - Math.abs(a - b)) >= 3));
      if (separados) return t;
    }
    throw new Error("No se pudo armar el rodillo " + i);
  });

  const girarRodillos = (azar = Math.random) => TIRAS.map(t => Math.floor(azar() * t.length));
  /** ventana[columna][fila] con lo que se ve tras parar en "paradas". */
  const ventana = paradas => paradas.map((p, c) => [0, 1, 2].map(f => TIRAS[c][(p + f) % TIRAS[c].length]));

  /** Mejor pago de una línea: corrida de comodines o del primer símbolo normal. */
  function evaluarLinea(seq) {
    let w = 0;
    while (w < 5 && seq[w] === "W") w++;
    const pagoW = w >= 3 ? TABLA.W[w] : 0;
    const base = seq.find(s => s !== "W");
    let n = 0, pagoB = 0;
    if (base && base !== "S") {
      while (n < 5 && (seq[n] === base || seq[n] === "W")) n++;
      pagoB = n >= 3 ? TABLA[base][n] : 0;
    }
    if (pagoW === 0 && pagoB === 0) return null;
    return pagoW >= pagoB ? { simbolo: "W", cuenta: w, mult: pagoW } : { simbolo: base, cuenta: n, mult: pagoB };
  }

  /** Evalúa una ventana con una apuesta total. Devuelve líneas ganadoras, botín y total. */
  function evaluarTiro(vent, apuesta) {
    const porLinea = apuesta / LINEAS.length;
    const lineas = [];
    LINEAS.forEach((filas, i) => {
      const seq = filas.map((f, c) => vent[c][f]);
      const r = evaluarLinea(seq);
      if (r) lineas.push({ linea: i, simbolo: r.simbolo, cuenta: r.cuenta, pago: r.mult * porLinea,
        posiciones: filas.slice(0, r.cuenta).map((f, c) => [c, f]) });
    });
    const posBotin = [];
    vent.forEach((col, c) => col.forEach((s, f) => { if (s === "S") posBotin.push([c, f]); }));
    const botin = posBotin.length >= 3 ? { cuenta: posBotin.length, pago: TABLA_BOTIN[Math.min(5, posBotin.length)] * apuesta, posiciones: posBotin } : null;
    const total = lineas.reduce((s, l) => s + l.pago, 0) + (botin ? botin.pago : 0);
    return { lineas, botin, total };
  }

  /** Retorno teórico exacto (RTP) de la máquina, para las pruebas. */
  function rtpTeorico() {
    const largo = TIRAS[0].length;
    const prob = TIRAS.map(t => { const p = {}; t.forEach(s => p[s] = (p[s] || 0) + 1 / largo); return p; });
    const simbolos = Object.keys(SIMBOLOS);
    let lineas = 0;
    const seq = [];
    (function rec(c, p) {
      if (c === 5) { const r = evaluarLinea(seq); if (r) lineas += p * r.mult; return; }
      for (const s of simbolos) { if (!prob[c][s]) continue; seq[c] = s; rec(c + 1, p * prob[c][s]); }
    })(0, 1);
    // pago por línea en múltiplos de la apuesta total: 10 líneas × (mult / 10)
    let dist = [1];
    TIRAS.forEach(t => {
      const cuenta = [0, 0];
      for (let p = 0; p < t.length; p++) cuenta[[0, 1, 2].some(f => t[(p + f) % t.length] === "S") ? 1 : 0]++;
      const nueva = Array(dist.length + 1).fill(0);
      dist.forEach((v, k) => { nueva[k] += v * cuenta[0] / t.length; nueva[k + 1] += v * cuenta[1] / t.length; });
      dist = nueva;
    });
    const botin = dist.reduce((s, v, k) => s + (k >= 3 ? v * TABLA_BOTIN[k] : 0), 0);
    return { lineas, botin, total: lineas + botin };
  }

  // ------------------------------------------------------------
  // Estado guardado
  // ------------------------------------------------------------
  const numeroValido = (v, min = 0) => typeof v === "number" && isFinite(v) && v >= min;
  /** Limpia lo que venga del navegador y completa lo que falte. */
  function normalizarEstado(crudo, cfg) {
    const e = crudo && typeof crudo === "object" ? crudo : {};
    const out = { version: 2, dias: {}, practica: {} };
    const dias = e.dias && typeof e.dias === "object" ? e.dias : {};
    for (const [k, v] of Object.entries(dias)) {
      const d = +k;
      if (!(d >= 1 && d <= 25) || !v || typeof v !== "object") continue;
      out.dias[d] = {
        etapa: ["ruleta", "gacha", "listo"].includes(v.etapa) ? v.etapa : "ruleta",
        saldo: numeroValido(v.saldo) ? Math.floor(v.saldo) : cfg.saldoInicial,
        historial: Array.isArray(v.historial) ? v.historial.filter(n => Number.isInteger(n) && n >= 0 && n <= 36).slice(-30) : [],
        visto: v.etapa === "listo" && v.visto === true
      };
    }
    const p = e.practica && typeof e.practica === "object" ? e.practica : {};
    const mesa = (x, extra) => Object.assign({ saldo: x && numeroValido(x.saldo) ? Math.floor(x.saldo) : cfg.saldoJuego }, extra(x || {}));
    out.practica.ruleta = mesa(p.ruleta, x => ({ historial: Array.isArray(x.historial) ? x.historial.filter(n => Number.isInteger(n) && n >= 0 && n <= 36).slice(-30) : [] }));
    out.practica.blackjack = mesa(p.blackjack, x => ({ enMano: numeroValido(x.enMano) ? Math.floor(x.enMano) : 0 }));
    out.practica.tragamonedas = mesa(p.tragamonedas, x => ({ apuesta: APUESTAS_SLOT.includes(x.apuesta) ? x.apuesta : APUESTAS_SLOT[1] }));
    // Mano de blackjack que quedó a medias al cerrar: se anula y se devuelve la apuesta.
    if (out.practica.blackjack.enMano > 0) {
      out.practica.blackjack.saldo += out.practica.blackjack.enMano;
      out.practica.blackjack.enMano = 0;
    }
    return out;
  }

  return {
    crearAzar, barajar, elegir, ordenCapsulas, puertaAbierta, esHoyDia,
    DISENO, formaDe, revisarDiseno,
    RUEDA, ROJOS, colorDe, CLAVES_RULETA, pagoRuleta, totalApostado, pagoTotalRuleta, elegirNumero,
    PALOS, RANGOS, crearZapato, valorCarta, totalMano, esBlackjack, crupierPide, crupierRevisa, puedeDividir, puedeDoblar, liquidarBlackjack,
    SIMBOLOS, COMPOSICION, TABLA, TABLA_BOTIN, LINEAS, APUESTAS_SLOT, TIRAS, girarRodillos, ventana, evaluarLinea, evaluarTiro, rtpTeorico,
    normalizarEstado
  };
});
