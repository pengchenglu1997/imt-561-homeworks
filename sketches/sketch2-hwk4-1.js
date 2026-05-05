registerSketch('sk2', function (p) {
  const CANVAS_SIZE = 800;

  const watchW = 380;
  const watchH = 480;
  const watchX = (CANVAS_SIZE - watchW) / 2;
  const watchY = 160;

  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
                      'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  const location = 'SEATTLE';
  const tempC = 12;
  const condition = 'CLOUDY';

  p.setup = function () {
    p.createCanvas(CANVAS_SIZE, CANVAS_SIZE);
    p.textFont('sans-serif');
  };

  // map current hour to a day/night background color
  // night (deep navy) → dawn (cool blue) → day (warm gray) → dusk (warm purple) → night
  function faceColor(hour, minute) {
    const t = hour + minute / 60; // 0–24 fractional hour
    // anchor points: midnight, dawn, noon, dusk, midnight
    const stops = [
      { t: 0,  c: [15, 20, 35] },   // midnight — deep navy
      { t: 6,  c: [40, 60, 90] },   // dawn — cool blue
      { t: 12, c: [60, 65, 75] },   // noon — neutral
      { t: 18, c: [70, 50, 70] },   // dusk — warm purple
      { t: 24, c: [15, 20, 35] },   // midnight again
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

  p.draw = function () {
    p.background(245);

    p.noStroke();
    p.fill(30);
    p.textSize(22);
    p.textStyle(p.BOLD);
    p.textAlign(p.CENTER, p.CENTER);
    p.text('Big Character Watch', CANVAS_SIZE / 2, 60);

    p.fill(120);
    p.textSize(12);
    p.textStyle(p.NORMAL);
    p.text('smartwatch  ·  glanceable info  ·  knowledge workers', CANVAS_SIZE / 2, 86);

    // ── smartwatch frame ──
    p.fill(40);
    p.noStroke();
    p.rect(watchX - 8, watchY - 8, watchW + 16, watchH + 16, 56);

    // ── face background: day/night gradient color ──
    const fc = faceColor(p.hour(), p.minute());
    p.fill(fc[0], fc[1], fc[2]);
    p.rect(watchX, watchY, watchW, watchH, 48);

    p.fill(60);
    p.rect(watchX + watchW + 8, watchY + 80, 6, 30, 3);

    // ── PROGRESS ARC: continuous seconds (no jump) ──
    const cx = watchX + watchW / 2;
    const cy = watchY + watchH / 2;
    const arcW = watchW - 30;
    const arcH = watchH - 30;

    // use Date.now() so seconds + ms come from one source — no jump on rollover
    const ms = Date.now() % 60000;          // ms within current minute
    const secProgress = ms / 60000;         // 0..1 smoothly

    p.noFill();
    p.stroke(255, 255, 255, 30);
    p.strokeWeight(2);
    p.rect(watchX + 15, watchY + 15, arcW, arcH, 36);

    p.stroke(80, 200, 220);
    p.strokeWeight(2.5);
    p.strokeCap(p.ROUND);
    p.arc(cx, cy, arcW, arcH,
          -p.HALF_PI,
          -p.HALF_PI + secProgress * p.TWO_PI);

    // ── DATE ──
    const now = new Date();
    const dayName = dayNames[now.getDay()];
    const monName = monthNames[now.getMonth()];
    const dayNum = now.getDate();
    const dateStr = dayName + ' · ' + monName + ' ' + dayNum;

    p.noStroke();
    p.fill(200);
    p.textSize(16);
    p.textStyle(p.NORMAL);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(dateStr, cx, watchY + 90);

    // ── BIG TIME ──
    const hh = p.nf(p.hour(), 2);
    const mm = p.nf(p.minute(), 2);

    p.fill(255);
    p.textSize(120);
    p.textStyle(p.BOLD);
    p.text(hh + ':' + mm, cx, cy);

    // ── LOCATION + WEATHER ──
    p.fill(200);
    p.textSize(14);
    p.textStyle(p.BOLD);
    p.text(location + '  ·  ' + tempC + '°C', cx, watchY + watchH - 90);

    p.fill(160);
    p.textSize(11);
    p.textStyle(p.NORMAL);
    p.text(condition, cx, watchY + watchH - 70);

    // border frame
    p.noFill();
    p.stroke(0);
    p.strokeWeight(1);
    p.rect(0, 0, p.width - 1, p.height - 1);
  };

  p.windowResized = function () { p.resizeCanvas(CANVAS_SIZE, CANVAS_SIZE); };
});