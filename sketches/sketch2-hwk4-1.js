registerSketch('sk2', function (p) {
  const CANVAS_SIZE = 800;

  const watchW = 380;
  const watchH = 480;
  const watchX = (CANVAS_SIZE - watchW) / 2;
  const watchY = 160;

  // ── number-to-word helpers ──
  const ONES = ['ZERO', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN',
                'EIGHT', 'NINE', 'TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN',
                'FOURTEEN', 'FIFTEEN', 'SIXTEEN', 'SEVENTEEN', 'EIGHTEEN',
                'NINETEEN'];
  const TENS = ['', '', 'TWENTY', 'THIRTY', 'FORTY', 'FIFTY'];

  function numWord(n) {
    if (n < 20) return ONES[n];
    const t = TENS[Math.floor(n / 10)];
    const o = n % 10;
    return o ? t + '-' + ONES[o] : t;
  }

  function hourWord(h) {
    return numWord(((h % 12) + 11) % 12 + 1); // 0→TWELVE, 13→ONE …
  }

  function daypart(h) {
    if (h < 5) return 'AT NIGHT';
    if (h < 12) return 'IN THE MORNING';
    if (h < 17) return 'IN THE AFTERNOON';
    if (h < 21) return 'IN THE EVENING';
    return 'AT NIGHT';
  }

  // ── casual phrasing: time the way a colleague would say it ──
  // returns { modifier, lines }  e.g. { 'ALMOST', ['HALF PAST', 'TEN'] }
  function casualPhrase(h, m) {
    let r = Math.round(m / 5) * 5;
    let modifier = '';
    if (r > m) modifier = 'ALMOST';
    else if (r < m) modifier = 'JUST PAST';

    if (r === 60) { r = 0; h = h + 1; }

    const hw = hourWord(h);
    const nhw = hourWord(h + 1);

    if (r === 0)  return { modifier, lines: [hw, "O'CLOCK"] };
    if (r === 15) return { modifier, lines: ['QUARTER PAST', hw] };
    if (r === 30) return { modifier, lines: ['HALF PAST', hw] };
    if (r === 45) return { modifier, lines: ['QUARTER TO', nhw] };
    if (r < 30)   return { modifier, lines: [numWord(r), 'PAST ' + hw] };
    return { modifier, lines: [numWord(60 - r), 'TO ' + nhw] };
  }

  p.setup = function () {
    p.createCanvas(CANVAS_SIZE, CANVAS_SIZE);
    p.textFont('sans-serif');
  };

  // day/night background gradient (kept from previous iteration)
  function faceColor(hour, minute) {
    const t = hour + minute / 60;
    const stops = [
      { t: 0,  c: [15, 20, 35] },
      { t: 6,  c: [40, 60, 90] },
      { t: 12, c: [60, 65, 75] },
      { t: 18, c: [70, 50, 70] },
      { t: 24, c: [15, 20, 35] },
    ];
    for (let i = 0; i < stops.length - 1; i++) {
      const a = stops[i], b = stops[i + 1];
      if (t >= a.t && t <= b.t) {
        const k = (t - a.t) / (b.t - a.t);
        return [
          a.c[0] + (b.c[0] - a.c[0]) * k,
          a.c[1] + (b.c[1] - a.c[1]) * k,
          a.c[2] + (b.c[2] - a.c[2]) * k,
        ];
      }
    }
    return [20, 20, 20];
  }

  // shrink text size until str fits maxW
  function fitSize(str, maxW, maxSize) {
    let s = maxSize;
    p.textStyle(p.BOLD);
    p.textSize(s);
    while (p.textWidth(str) > maxW && s > 12) {
      s -= 2;
      p.textSize(s);
    }
    return s;
  }

  p.draw = function () {
    p.background(245);

    // title
    p.noStroke();
    p.fill(30); p.textSize(22); p.textStyle(p.BOLD);
    p.textAlign(p.CENTER, p.CENTER);
    p.text('Spoken Time', CANVAS_SIZE / 2, 60);

    p.fill(120); p.textSize(12); p.textStyle(p.NORMAL);
    p.text('smartwatch  ·  time as you would say it aloud  ·  knowledge workers',
           CANVAS_SIZE / 2, 86);

    // smartwatch frame
    p.fill(40);
    p.rect(watchX - 8, watchY - 8, watchW + 16, watchH + 16, 56);

    const fc = faceColor(p.hour(), p.minute());
    p.fill(fc[0], fc[1], fc[2]);
    p.rect(watchX, watchY, watchW, watchH, 48);

    p.fill(60);
    p.rect(watchX + watchW + 8, watchY + 80, 6, 30, 3);

    const cx = watchX + watchW / 2;
    const cy = watchY + watchH / 2;
    const maxW = watchW - 60;

    // ── spoken-time phrase ──
    const { modifier, lines } = casualPhrase(p.hour(), p.minute());

    p.textAlign(p.CENTER, p.CENTER);

    // "IT IS" lead-in
    p.fill(160); p.textSize(18); p.textStyle(p.NORMAL);
    p.text('IT IS', cx, watchY + 90);

    // modifier (ALMOST / JUST PAST) in accent color
    if (modifier) {
      p.fill(80, 200, 220); p.textStyle(p.BOLD);
      p.textSize(fitSize(modifier, maxW, 28));
      p.text(modifier, cx, cy - 90);
    }

    // main phrase, big words
    p.fill(255); p.textStyle(p.BOLD);
    const lineGap = 70;
    const startY = cy - ((lines.length - 1) * lineGap) / 2 + 10;
    lines.forEach((ln, i) => {
      p.textSize(fitSize(ln, maxW, 54));
      p.text(ln, cx, startY + i * lineGap);
    });

    // daypart suffix
    p.fill(160); p.textSize(16); p.textStyle(p.NORMAL);
    p.text(daypart(p.hour()), cx, watchY + watchH - 70);

    // border
    p.noFill();
    p.stroke(0); p.strokeWeight(1);
    p.rect(0, 0, p.width - 1, p.height - 1);
  };

  p.windowResized = function () { p.resizeCanvas(CANVAS_SIZE, CANVAS_SIZE); };
});
