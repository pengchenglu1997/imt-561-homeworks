registerSketch('sk2', function (p) {
  const CANVAS_SIZE = 800;

  // smartwatch frame
  const watchW = 380;
  const watchH = 480;
  const watchX = (CANVAS_SIZE - watchW) / 2;
  const watchY = 160;

  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
                      'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  // mock weather
  const location = 'SEATTLE';
  const tempC = 12;
  const condition = 'CLOUDY';

  p.setup = function () {
    p.createCanvas(CANVAS_SIZE, CANVAS_SIZE);
    p.textFont('sans-serif');
  };

  p.draw = function () {
    p.background(245);

    // title
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

    // smartwatch frame
    p.fill(40);
    p.noStroke();
    p.rect(watchX - 8, watchY - 8, watchW + 16, watchH + 16, 56);

    p.fill(20);
    p.rect(watchX, watchY, watchW, watchH, 48);

    p.fill(60);
    p.rect(watchX + watchW + 8, watchY + 80, 6, 30, 3);

    // ── PROGRESS ARC: smooth seconds sweep around inner border ──
    const cx = watchX + watchW / 2;
    const cy = watchY + watchH / 2;
    const arcW = watchW - 30;
    const arcH = watchH - 30;
    const secProgress = (p.second() + p.millis() % 1000 / 1000) / 60;

    // background track (full ring)
    p.noFill();
    p.stroke(50);
    p.strokeWeight(2);
    p.rect(watchX + 15, watchY + 15, arcW, arcH, 36);

    // active progress (cyan accent)
    p.stroke(80, 200, 220);
    p.strokeWeight(2.5);
    p.strokeCap(p.ROUND);

    // we draw the progress as a partial rounded rect path using arc
    // simpler: draw a thin colored arc on top
    const arcRadius = (Math.min(arcW, arcH)) / 2;
    p.noFill();
    p.stroke(80, 200, 220);
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
    p.fill(180);
    p.textSize(16);
    p.textStyle(p.NORMAL);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(dateStr, cx, watchY + 90);

    // ── BIG TIME ──
    const hh = p.nf(p.hour(), 2);
    const mm = p.nf(p.minute(), 2);

    p.fill(240);
    p.textSize(120);
    p.textStyle(p.BOLD);
    p.text(hh + ':' + mm, cx, cy);

    // ── LOCATION + WEATHER ──
    p.fill(160);
    p.textSize(14);
    p.textStyle(p.BOLD);
    p.text(location + '  ·  ' + tempC + '°C', cx, watchY + watchH - 90);

    p.fill(120);
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