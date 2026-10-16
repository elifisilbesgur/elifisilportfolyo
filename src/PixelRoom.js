import React, { useEffect, useRef } from 'react';

// Mantıksal çözünürlük: sahne 192×144 piksellik bir tuvale çizilir,
// CSS ile keskin piksellerle büyütülür.
const LW = 192;
const LH = 144;

const PALETTES = {
  night: {
    wall: '#262b52', wallShade: '#22274b', wainscot: '#1d2143', wainscotLine: '#191d3c',
    floor: '#4a3428', floorLine: '#3b291f', rug: '#3b3470', rugEdge: '#c9b8ff',
    wood: '#6b4a36', woodDark: '#4f3526', woodLight: '#82593f', shelfBack: '#2e2440',
    sky: ['#0d1233', '#121a42', '#18224f'], city: '#0a0f2c', cityLight: '#ffcf70',
    star: '#f5f0ff', moon: '#f6efd0', rain: '#6f83c9',
    desk: '#7a5640', deskTop: '#946a4f', deskDark: '#5c3f2e',
    laptop: '#3a3f63', bezel: '#2b3052', screen: '#141a33',
    pot: '#b0643f', potRim: '#c97a52', leaf: '#5aa36d', leafLight: '#7cc29a', bloom: '#f4a7c3',
    paper: '#e9e1cc', paperEdge: '#c9bfa6', mapLine: '#8aa3ad', mapDot: '#d6455d',
    mug: '#c9b8ff', steam: '#aab0d8', lampShade: '#c9b8ff', lampShadeDark: '#9d8ad6', bulb: '#fff3c4',
    cord: '#14172e', cat: '#8d8fb8', catDark: '#6d6f99',
  },
  day: {
    wall: '#dcd9f0', wallShade: '#d3d0ea', wainscot: '#c7c3e4', wainscotLine: '#bbb6dc',
    floor: '#9a7052', floorLine: '#86603f', rug: '#b9aef0', rugEdge: '#6a55d0',
    wood: '#8a6146', woodDark: '#6b4a36', woodLight: '#a3775a', shelfBack: '#5d4a63',
    sky: ['#8cc6f2', '#a9d6f6', '#cfe8f9'], city: '#9fadd2', cityLight: '#9fadd2',
    star: '#ffffff', moon: '#ffe08a', rain: '#ffffff',
    desk: '#9a7052', deskTop: '#b0855f', deskDark: '#7a5640',
    laptop: '#5c6290', bezel: '#474d7a', screen: '#1d2340',
    pot: '#c06e45', potRim: '#d98a5c', leaf: '#4f9a62', leafLight: '#78c294', bloom: '#ef8fb4',
    paper: '#f6f0de', paperEdge: '#d9cfb3', mapLine: '#7f98a3', mapDot: '#d6455d',
    mug: '#6a55d0', steam: '#ffffff', lampShade: '#8f7ad8', lampShadeDark: '#6f5bbd', bulb: '#e7e2f6',
    cord: '#3b3858', cat: '#7b7da6', catDark: '#5d5f88',
  },
};

// Basit, tekrarlanabilir sözde rastgele sayılar
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const BOOK_COLORS = ['#c9b8ff', '#7fb2e5', '#ffcf70', '#f4a7c3', '#7cc29a', '#e98b6d', '#a48bd6', '#5d8fd6', '#d9d2f5'];
const CODE_COLORS = ['#c9b8ff', '#7fb2e5', '#ffcf70', '#f4a7c3', '#7cc29a'];

// Kitaplık rafları bir kez üretilir
const shelfBooks = (() => {
  const r = rng(11);
  const rows = [];
  [[30, 47], [50, 67], [70, 87]].forEach(([top, bottom]) => {
    const books = [];
    let x = 14;
    while (x < 47) {
      const w = 2 + Math.floor(r() * 3);
      if (x + w > 48) break;
      const h = 10 + Math.floor(r() * (bottom - top - 9));
      books.push({ x, w, h, bottom, c: BOOK_COLORS[Math.floor(r() * BOOK_COLORS.length)] });
      x += w + (r() < 0.2 ? 2 : 0);
    }
    rows.push(books);
  });
  return rows;
})();

const stars = (() => {
  const r = rng(5);
  return Array.from({ length: 16 }, () => ({ x: 83 + Math.floor(r() * 46), y: 19 + Math.floor(r() * 22), p: r() * 6.28 }));
})();

const drops = (() => {
  const r = rng(9);
  return Array.from({ length: 26 }, () => ({ x: r() * 70, y: r() * 48, v: 70 + r() * 30 }));
})();

const buildings = [
  [82, 54, 7], [89, 50, 6], [95, 57, 5], [100, 47, 6], [108, 53, 7], [115, 49, 5], [120, 55, 6], [126, 51, 4],
];

const CAPY = [
  '..............G.......',
  '.............OOO......',
  '............OOOOO.....',
  '......CCCCCCCOOOCCC...',
  '....CCLLLLLLLLLLLCCDC.',
  '...CLLLLLLLLLLLLLLCCC.',
  '..CLLLLLLLLLLLLLLLCECC',
  '..CLLLLLLLLLLLLLLLCCCC',
  '.CCLLLLLLLLLLLLLLCCCCN',
  '.CCCLLLLLLLLLLLLCCCCCN',
  '.CCCCCCCCCCCCCCCCCCCC.',
  '..CCCCCCCCCCCCCCCCCC..',
  '..DDD.DDD.....DDD.DDD.',
  '..DD..DD......DD..DD..',
];
const CAT = [
  '..K.K.........',
  '.KKKKK...KKK..',
  'KKWWKKKKKKKKK.',
  'KKKKKKKKKKKKKT',
  '.KKKKKKKKKKKTT',
  '..KKKKKKKKKT..',
];
const CAPY_COLORS = { C: '#8a5a3a', L: '#a8744d', D: '#5c3a24', E: '#1a1214', N: '#3a2416', O: '#ff9a3c', G: '#5aa36d' };

function draw(ctx, t, theme, lightLevel) {
  const P = PALETTES[theme];
  const night = theme === 'night';
  const R = (x, y, w, h, c) => { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); };

  // Duvar
  R(0, 0, LW, 118, P.wall);
  for (let x = 0; x < LW; x += 24) R(x, 0, 12, 100, P.wallShade);
  R(0, 100, LW, 18, P.wainscot);
  for (let x = 4; x < LW; x += 10) R(x, 100, 1, 16, P.wainscotLine);
  R(0, 99, LW, 1, P.woodLight);
  R(0, 116, LW, 2, P.woodDark);

  // Zemin
  R(0, 118, LW, 26, P.floor);
  [124, 131, 138].forEach((y, i) => {
    R(0, y, LW, 1, P.floorLine);
    for (let x = (i * 17) % 40; x < LW; x += 40) R(x, y - 6, 1, 6, P.floorLine);
  });
  // Halı
  R(64, 126, 92, 12, P.rug);
  for (let x = 66; x < 154; x += 4) { R(x, 127, 2, 1, P.rugEdge); R(x + 2, 136, 2, 1, P.rugEdge); }

  // Pencere
  R(78, 14, 56, 56, P.wood);
  R(80, 16, 52, 52, P.woodDark);
  ctx.save();
  ctx.beginPath(); ctx.rect(82, 18, 48, 48); ctx.clip();
  R(82, 18, 48, 16, P.sky[0]); R(82, 34, 48, 16, P.sky[1]); R(82, 50, 48, 16, P.sky[2]);
  if (night) {
    stars.forEach((s) => {
      const a = 0.35 + 0.65 * Math.abs(Math.sin(t * 1.3 + s.p));
      ctx.globalAlpha = a; R(s.x, s.y, 1, 1, P.star);
    });
    ctx.globalAlpha = 1;
    // Ay
    R(118, 22, 6, 6, P.moon); R(117, 23, 8, 4, P.moon); R(119, 21, 4, 8, P.moon);
    R(120, 24, 2, 1, '#e2d7ae');
  } else {
    // Güneş ve bulutlar
    R(116, 22, 8, 8, P.moon); R(115, 23, 10, 6, P.moon); R(117, 21, 6, 10, P.moon);
    [[0, 26, 10], [34, 36, 8], [60, 22, 7]].forEach(([o, y, w]) => {
      const x = 82 + ((o + t * 3) % 70) - 12;
      R(x, y, w, 2, '#ffffff'); R(x + 2, y - 2, w - 4, 2, '#ffffff');
    });
  }
  // Şehir
  buildings.forEach(([x, y, w], i) => {
    R(x, y, w, 66 - y, P.city);
    if (night) {
      for (let wy = y + 2; wy < 64; wy += 3) {
        for (let wx = x + 1; wx < x + w - 1; wx += 2) {
          const on = Math.sin(wx * 12.9 + wy * 7.3 + i) > 0.25;
          const blink = Math.sin(t * 0.7 + wx + wy) > 0.96;
          if (on && !blink) R(wx, wy, 1, 1, P.cityLight);
        }
      }
    }
  });
  // Yağmur
  if (night) {
    ctx.globalAlpha = 0.75;
    drops.forEach((d) => {
      const y = 18 + ((d.y + t * d.v) % 52) - 4;
      const x = 82 + ((d.x - (y - 18) * 0.25) % 60 + 60) % 60 - 4;
      R(Math.round(x), Math.round(y), 1, 3, P.rain);
    });
    ctx.globalAlpha = 1;
  }
  ctx.restore();
  // Pencere kayıtları
  R(105, 18, 2, 48, P.wood); R(82, 41, 48, 2, P.wood);
  R(75, 68, 62, 4, P.woodLight); R(76, 72, 60, 1, P.woodDark);

  // Kitaplık
  R(10, 28, 42, 90, P.wood);
  R(13, 30, 36, 86, P.shelfBack);
  R(10, 28, 42, 2, P.woodLight);
  [47, 67, 87, 107].forEach((y) => { R(12, y, 38, 2, P.woodLight); R(12, y + 2, 38, 1, P.woodDark); });
  shelfBooks.forEach((row) => row.forEach((b) => {
    R(b.x, b.bottom - b.h, b.w, b.h, b.c);
    R(b.x, b.bottom - b.h + 2, b.w, 1, 'rgba(0,0,0,.18)');
  }));
  // Alt bölmede yatay yığın
  [['#7fb2e5', 22], ['#ffcf70', 18], ['#f4a7c3', 24], ['#7cc29a', 20]].forEach(([c, w], i) => R(16 + (i % 2) * 2, 104 - i * 3, w, 3, c));
  R(36, 92, 10, 15, '#c9b8ff'); R(37, 94, 8, 1, 'rgba(0,0,0,.2)');

  // Duvardaki harita (Bursa)
  R(159, 38, 30, 24, P.paperEdge);
  R(160, 39, 28, 22, P.paper);
  ctx.fillStyle = P.mapLine;
  [[162, 50, 6], [168, 46, 7], [175, 44, 6], [181, 47, 5], [164, 54, 8], [172, 52, 9], [181, 53, 5]].forEach(([x, y, w]) => ctx.fillRect(x, y, w, 1));
  [[168, 46, 8], [175, 44, 12], [172, 52, 6], [181, 47, 10]].forEach(([x, y, h]) => ctx.fillRect(x, y, 1, h));
  [[171, 49], [173, 50], [176, 49], [165, 52], [183, 50], [178, 56], [169, 57]].forEach(([x, y], i) => {
    const pulse = Math.sin(t * 2 + i) > 0.6 ? 2 : 1;
    R(x, y, pulse, pulse, P.mapDot);
  });
  R(173, 37, 2, 2, '#d6455d');

  // Asılı lamba
  R(150, 0, 1, 22, P.cord);
  R(144, 22, 13, 2, P.lampShadeDark);
  R(143, 24, 15, 3, P.lampShade);
  R(142, 27, 17, 2, P.lampShadeDark);
  R(148, 29, 5, 2, P.bulb);

  // Masa
  R(92, 92, 98, 2, P.deskTop);
  R(92, 94, 98, 3, P.desk);
  R(96, 97, 3, 21, P.deskDark);
  R(183, 97, 3, 21, P.deskDark);
  R(160, 97, 22, 10, P.desk);
  R(161, 106, 20, 1, P.deskDark);
  R(169, 101, 4, 1, P.woodLight);

  // Dizüstü bilgisayar
  R(120, 72, 28, 19, P.bezel);
  R(122, 74, 24, 15, P.screen);
  const step = Math.floor(t * 1.6);
  for (let i = 0; i < 5; i++) {
    const n = step + i;
    const r = rng(n * 31 + 7);
    let x = 123 + (Math.floor(r() * 3) * 2);
    const y = 75 + i * 3;
    while (x < 144) {
      const w = 2 + Math.floor(r() * 6);
      if (x + w > 145) break;
      R(x, y, w, 1, CODE_COLORS[Math.floor(r() * CODE_COLORS.length)]);
      x += w + 1;
    }
  }
  if (Math.floor(t * 2) % 2 === 0) R(123 + ((step * 5) % 18), 87, 2, 1, '#f5f0ff');
  R(116, 91, 36, 2, P.laptop);
  R(130, 92, 8, 1, P.bezel);

  // Kupa ve buhar
  R(153, 85, 6, 7, P.mug); R(159, 87, 2, 3, P.mug); R(154, 86, 4, 1, 'rgba(255,255,255,.35)');
  if (night) {
    ctx.globalAlpha = 0.6;
    for (let i = 0; i < 3; i++) {
      const ph = (t * 0.8 + i / 3) % 1;
      R(155 + Math.round(Math.sin((ph + i) * 6) * 1.5), 84 - Math.round(ph * 10), 1, 2, P.steam);
    }
    ctx.globalAlpha = 1;
  }

  // Saksı bitkisi (LumaNote)
  const sway = Math.round(Math.sin(t * 1.2) * 1);
  R(165, 84, 11, 8, P.pot); R(164, 83, 13, 2, P.potRim);
  R(170, 68, 1, 15, P.leaf);
  [
    [163, 78, 7, 3], [171, 76, 7, 3], [164, 73, 6, 2], [172, 71, 6, 3],
    [165, 69, 5, 2], [171, 66, 5, 2], [166, 64, 4, 2],
  ].forEach(([x, y, w, h], i) => {
    const s = i > 3 ? sway : 0;
    R(x + s, y, w, h, i % 2 ? P.leafLight : P.leaf);
    R(x + s + (i % 2 ? 0 : w - 2), y, 2, 1, P.leafLight);
  });
  R(168 + sway, 60, 5, 4, P.bloom); R(169 + sway, 59, 3, 6, P.bloom); R(170 + sway, 61, 1, 2, '#ffcf70');

  // Kapibara peluş
  CAPY.forEach((row, j) => {
    for (let i = 0; i < row.length; i++) {
      const ch = row[i];
      if (ch !== '.') R(93 + i, 79 + j, 1, 1, CAPY_COLORS[ch]);
    }
  });

  // Halının kenarında uyuyan kedi
  const breath = Math.sin(t * 1.4) > 0.3 ? 1 : 0;
  CAT.forEach((row, j) => {
    for (let i = 0; i < row.length; i++) {
      const ch = row[i];
      if (ch === '.') continue;
      const c = ch === 'W' ? '#2b2342' : ch === 'T' ? P.catDark : P.cat;
      R(58 + i, 121 + j - (j < 2 ? breath : 0), 1, 1, c);
    }
  });

  // Lamba ışığı (geceleri)
  if (night && lightLevel > 0) {
    const g = ctx.createRadialGradient(150, 32, 2, 150, 60, 70);
    g.addColorStop(0, `rgba(255, 214, 130, ${0.28 * lightLevel})`);
    g.addColorStop(1, 'rgba(255, 214, 130, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, LW, LH);
    R(148, 29, 5, 2, '#fff3c4');
  }
  if (night && lightLevel < 1) {
    ctx.fillStyle = `rgba(6, 8, 24, ${0.45 * (1 - lightLevel)})`;
    ctx.fillRect(0, 0, LW, LH);
  }
}

// Odadaki tıklanabilir eşyalar (mantıksal koordinatlar)
export const ROOM_OBJECTS = [
  { id: 'lumaraf', label: 'Kitaplık: LumaRaf', x: 10, y: 28, w: 42, h: 90 },
  { id: 'kapibara', label: 'Kapibara: Kapibara Uçuşu', x: 91, y: 75, w: 25, h: 18 },
  { id: 'lumanote', label: 'Saksı: LumaNote', x: 161, y: 59, w: 18, h: 33 },
  { id: 'bursa', label: 'Harita: Bursa Hazırlık Atlası', x: 157, y: 35, w: 34, h: 24 },
];

export default function PixelRoom({ theme, onPick }) {
  const canvasRef = useRef(null);
  const themeRef = useRef(theme);
  themeRef.current = theme;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const start = performance.now();
    let raf = 0;
    let last = 0;
    let visible = true;

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      if (!visible || now - last < 1000 / 14) return;
      last = now;
      const t = (now - start) / 1000;
      const light = Math.min(1, Math.max(0, (t - 0.4) / 1.2));
      draw(ctx, t, themeRef.current === 'light' ? 'day' : 'night', light);
    };

    if (reduce) {
      draw(ctx, 0, themeRef.current === 'light' ? 'day' : 'night', 1);
      const id = setInterval(() => draw(ctx, 0, themeRef.current === 'light' ? 'day' : 'night', 1), 300);
      return () => clearInterval(id);
    }

    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    io.observe(canvas);
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, []);

  return (
    <div className="room">
      <canvas
        ref={canvasRef}
        width={LW}
        height={LH}
        className="room-canvas"
        role="img"
        aria-label="Piksel bir çalışma odası: yağmurlu pencere, kitaplık, masada dizüstü bilgisayar, kapibara peluşu ve saksı, duvarda bir harita, halının kenarında uyuyan bir kedi."
      />
      {ROOM_OBJECTS.map((o) => (
        <button
          key={o.id}
          type="button"
          className="room-hotspot"
          style={{
            left: `${(o.x / LW) * 100}%`,
            top: `${(o.y / LH) * 100}%`,
            width: `${(o.w / LW) * 100}%`,
            height: `${(o.h / LH) * 100}%`,
          }}
          onClick={() => onPick(o.id)}
          aria-label={`${o.label} projesine git`}
        >
          <span className="room-tip">{o.label}</span>
        </button>
      ))}
    </div>
  );
}
