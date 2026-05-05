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

  const faceNames = ['BIG TIME', 'DATE FOCUS', 'WEATHER FOCUS'];
  let faceIdx = 0;

  p.setup = function () {
    p.createCanvas(CANVAS_SIZE, CANVAS_SIZE);
    p.textFont('sans-serif');
  };

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

  function isOverWatch() {
    return (
      p.mouseX >= watchX && p.mouseX <= watchX + watchW &&
      p.mouseY >= watchY && p.mouseY <= watchY + watchH
    );
  }

  // ── face renderers ──

  function drawBigTime(cx, cy) {
    // small date at top
    const now = new Date();
    const dateStr = dayNames[now.getDay()] + ' · ' + monthNames[now.getMonth()] + ' ' + now.getDate();
    p.fill(200); p.textSize(16); p.textStyle(p.NORMAL);
    p.text(dateStr, cx, watchY + 100);

    // big time (center)
    p.fill(255); p.textSize(120); p.textStyle(p.BOLD);
    p.text(p.nf(p.hour(), 2) + ':' + p.nf(p.minute(), 2), cx, cy);

    // small weather at bottom
    p.fill(200); p.textSize(14); p.textStyle(p.BOLD);
    p.text(location + '  ·  ' + tempC + '°C', cx, watchY + watchH - 90);
    p.fill(160); p.textSize(11); p.textStyle(p.NORMAL);
    p.text(condition, cx, watchY + watchH - 70);
  }

  function drawDateFocus(cx, cy) {
    const now = new Date();

    // small time at top
    p.fill(200); p.textSize(20); p.textStyle(p.BOLD);
    p.text(p.nf(p.hour(), 2) + ':' + p.nf(p.minute(), 2), cx, watchY + 100);

    // BIG day-of-week (center top)
    p.fill(255); p.textSize(64); p.textStyle(p.BOLD);
    p.text(dayNames[now.getDay()], cx, cy - 50);

    // BIG day number (center bottom)
    p.fill(255); p.textSize(110); p.textStyle(p.BOLD);
    p.text(now.getDate(), cx, cy + 40);

    // month name
    p.fill(200); p.textSize(18); p.textStyle(p.BOLD);
    p.text(monthNames[now.getMonth()] + ' ' + now.getFullYear(), cx, watchY + watchH - 80);
  }

  function drawWeatherFocus(cx, cy) {
    const now = new Date();

    // small time at top
    p.fill(200); p.textSize(20); p.textStyle(p.BOLD);
    p.text(p.nf(p.hour(), 2) + ':' + p.nf(p.minute(), 2), cx, watchY + 100);

    // big temperature (center)
    p.fill(255); p.textSize(140); p.textStyle(p.BOLD);
    p.text(tempC + '°', cx, cy);

    // condition + location below
    p.fill(220); p.textSize(20); p.textStyle(p.BOLD);
    p.text(condition, cx, cy + 90);

    p.fill(160); p.textSize(13); p.textStyle(p.NORMAL);
    p.text(location, cx, watchY + watchH - 80);
  }

  p.draw = function () {
    p.background(245);

    // title
    p.noStroke();
    p.fill(30); p.textSize(22); p.textStyle(p.BOLD);
    p.textAlign(p.CENTER, p.CENTER);
    p.text('Big Character Watch', CANVAS_SIZE / 2, 60);

    p.fill(120); p.textSize(12); p.textStyle(p.NORMAL);
    p.text('smartwatch  ·  glanceable info  ·  knowledge workers', CANVAS_SIZE / 2, 86);

    p.fill(150); p.textSize(11);
    p.text('click watch face to cycle:  ' + faceNames.join('  →  '), CANVAS_SIZE / 2, 110);

    // smartwatch frame
    p.fill(40);
    p.rect(watchX - 8, watchY - 8, watchW + 16, watchH + 16, 56);

    // face background
    const fc = faceColor(p.hour(), p.minute());
    if (isOverWatch()) {
      p.fill(fc[0] + 15, fc[1] + 15, fc[2] + 15); // slight brighten on hover
    } else {
      p.fill(fc[0], fc[1], fc[2]);
    }
    p.rect(watchX, watchY, watchW, watchH, 48);

    p.fill(60);
    p.rect(watchX + watchW + 8, watchY + 80, 6, 30, 3);

    // progress arc
    const cx = watchX + watchW / 2;
    const cy = watchY + watchH / 2;
    const arcW = watchW - 30;
    const arcH = watchH - 30;
    const ms = Date.now() % 60000;
    const secProgress = ms / 60000;

    p.noFill();
    p.stroke(255, 255, 255, 30); p.strokeWeight(2);
    p.rect(watchX + 15, watchY + 15, arcW, arcH, 36);

    p.stroke(80, 200, 220);
    p.strokeWeight(2.5); p.strokeCap(p.ROUND);
    p.arc(cx, cy, arcW, arcH, -p.HALF_PI, -p.HALF_PI + secProgress * p.TWO_PI);

    // face label badge (top of watch)
    p.noStroke();
    p.fill(80, 200, 220, 180);
    p.rect(cx - 50, watchY + 30, 100, 18, 9);
    p.fill(20); p.textSize(9); p.textStyle(p.BOLD);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(faceNames[faceIdx], cx, watchY + 39);

    // ── render selected face ──
    p.textAlign(p.CENTER, p.CENTER);
    if (faceIdx === 0) drawBigTime(cx, cy);
    else if (faceIdx === 1) drawDateFocus(cx, cy);
    else if (faceIdx === 2) drawWeatherFocus(cx, cy);

    // border
    p.noFill();
    p.stroke(0); p.strokeWeight(1);
    p.rect(0, 0, p.width - 1, p.height - 1);
  };

  p.mousePressed = function () {
    if (isOverWatch()) {
      faceIdx = (faceIdx + 1) % 3;
    }
  };

  p.windowResized = function () { p.resizeCanvas(CANVAS_SIZE, CANVAS_SIZE); };
});