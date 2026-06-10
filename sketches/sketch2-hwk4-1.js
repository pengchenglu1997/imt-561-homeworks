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

  // ── exact phrasing: full-precision time, still in words ──
  function exactPhrase(h, m) {
    const hw = hourWord(h);
    if (m === 0)  return { modifier: '', lines: [hw, "O'CLOCK"] };
    if (m < 10)   return { modifier: '', lines: [hw, 'OH ' + numWord(m)] };
    return { modifier: '', lines: [hw, numWord(m)] };
  }

  // ── vague phrasing: the precision you use with friends ──
  function vaguePhrase(h) {
    if (h < 5)  return { modifier: '', lines: ['THE SMALL', 'HOURS'] };
    if (h < 8)  return { modifier: '', lines: ['EARLY', 'MORNING'] };
    if (h < 11) return { modifier: '', lines: ['MID-', 'MORNING'] };
    if (h < 13) return { modifier: '', lines: ['AROUND', 'MIDDAY'] };
    if (h < 15) return { modifier: '', lines: ['EARLY', 'AFTERNOON'] };
    if (h < 17) return { modifier: '', lines: ['LATE', 'AFTERNOON'] };
    if (h < 21) return { modifier: '', lines: ['EVENING'] };
    return { modifier: '', lines: ['NIGHT-TIME'] };
  }

  // precision levels mirror how people speak time in different social contexts
  const MODES = ['EXACT', 'CASUAL', 'VAGUE'];
  let modeIdx = 1; // default: CASUAL — how you'd answer "what time is it?"

  function currentPhrase() {
    const h = p.hour(), m = p.minute();
    if (MODES[modeIdx] === 'EXACT') return exactPhrase(h, m);
    if (MODES[modeIdx] === 'VAGUE') return vaguePhrase(h);
    return casualPhrase(h, m);
  }

  function isOverWatch() {
    return (
      p.mouseX >= watchX && p.mouseX <= watchX + watchW &&
      p.mouseY >= watchY && p.mouseY <= watchY + watchH
    );
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

    p.fill(150); p.textSize(11);
    p.text('click watch face to change precision:  ' + MODES.join('  →  '),
           CANVAS_SIZE / 2, 110);

    // smartwatch frame
    p.fill(40);
    p.rect(watchX - 8, watchY - 8, watchW + 16, watchH + 16, 56);

    const fc = faceColor(p.hour(), p.minute());
    if (isOverWatch()) {
      p.fill(fc[0] + 15, fc[1] + 15, fc[2] + 15); // slight brighten on hover
    } else {
      p.fill(fc[0], fc[1], fc[2]);
    }
    p.rect(watchX, watchY, watchW, watchH, 48);

    p.fill(60);
    p.rect(watchX + watchW + 8, watchY + 80, 6, 30, 3);

    const cx = watchX + watchW / 2;
    const cy = watchY + watchH / 2;
    const maxW = watchW - 60;

    // ── progress arc: how soon the spoken phrase will change ──
    // EXACT changes every minute, CASUAL every 5-min bucket (centered on
    // multiples of 5), VAGUE roughly every hour. The arc completes exactly
    // when the words flip — motion is mapped to the display's own refresh.
    const now = new Date();
    const secNow = now.getSeconds() + now.getMilliseconds() / 1000;
    const minSec = now.getMinutes() * 60 + secNow;
    let phraseProg;
    if (MODES[modeIdx] === 'EXACT')       phraseProg = secNow / 60;
    else if (MODES[modeIdx] === 'CASUAL') phraseProg = ((minSec + 150) % 300) / 300;
    else                                  phraseProg = minSec / 3600;

    const arcW = watchW - 30;
    const arcH = watchH - 30;
    p.noFill();
    p.stroke(255, 255, 255, 30); p.strokeWeight(2);
    p.rect(watchX + 15, watchY + 15, arcW, arcH, 36);

    p.stroke(80, 200, 220);
    p.strokeWeight(2.5); p.strokeCap(p.ROUND);
    p.arc(cx, cy, arcW, arcH, -p.HALF_PI, -p.HALF_PI + phraseProg * p.TWO_PI);
    p.noStroke();

    // ── precision badge (top of watch) ──
    p.textAlign(p.CENTER, p.CENTER);
    p.fill(80, 200, 220, 180);
    p.rect(cx - 45, watchY + 30, 90, 18, 9);
    p.fill(20); p.textSize(9); p.textStyle(p.BOLD);
    p.text(MODES[modeIdx], cx, watchY + 39);

    // ── spoken-time phrase ──
    const { modifier, lines } = currentPhrase();

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

    // daypart suffix (redundant in VAGUE mode — the phrase IS the daypart)
    if (MODES[modeIdx] !== 'VAGUE') {
      p.fill(160); p.textSize(16); p.textStyle(p.NORMAL);
      p.text(daypart(p.hour()), cx, watchY + watchH - 70);
    }

    // border
    p.noFill();
    p.stroke(0); p.strokeWeight(1);
    p.rect(0, 0, p.width - 1, p.height - 1);
  };

  p.mousePressed = function () {
    if (isOverWatch()) {
      modeIdx = (modeIdx + 1) % MODES.length;
    }
  };

  p.windowResized = function () { p.resizeCanvas(CANVAS_SIZE, CANVAS_SIZE); };
});
