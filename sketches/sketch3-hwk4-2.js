registerSketch('sk3', function (p) {
  const CANVAS_SIZE = 800;

  const startHour = 9;
  const endHour = 18;

  const barW = 600;
  const barH = 48;
  const barX = (CANVAS_SIZE - barW) / 2;
  const barY = 340;  // moved down to make room for big % display

  p.setup = function () {
    p.createCanvas(CANVAS_SIZE, CANVAS_SIZE);
    p.textFont('sans-serif');
  };

  function fmtHour(h) {
    if (h === 0) return '12 AM';
    if (h === 12) return '12 PM';
    if (h < 12) return h + ' AM';
    return (h - 12) + ' PM';
  }

  function workdayProgress() {
    const now = new Date();
    const cur = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
    const total = endHour - startHour;
    return p.constrain((cur - startHour) / total, 0, 1);
  }

  p.draw = function () {
    p.background(245);

    p.noStroke();
    p.fill(30);
    p.textSize(22);
    p.textStyle(p.BOLD);
    p.textAlign(p.CENTER, p.CENTER);
    p.text('Workday Progress Bar', CANVAS_SIZE / 2, 70);

    p.fill(120);
    p.textSize(12);
    p.textStyle(p.NORMAL);
    p.text('desktop screen  ·  remote workers  ·  workday tracker', CANVAS_SIZE / 2, 96);

    const prog = workdayProgress();
    const pct = Math.floor(prog * 100);

    // ── BIG PERCENTAGE DISPLAY ──
    p.fill(30);
    p.textSize(96);
    p.textStyle(p.BOLD);
    p.textAlign(p.CENTER, p.BASELINE);
    p.text(pct + '%', CANVAS_SIZE / 2, barY - 50);

    // small label "OF WORKDAY COMPLETE"
    p.fill(140);
    p.textSize(11);
    p.textStyle(p.BOLD);
    p.text('OF WORKDAY COMPLETE', CANVAS_SIZE / 2, barY - 28);

    // ── BAR TRACK ──
    p.noStroke();
    p.fill(220);
    p.rect(barX, barY, barW, barH, barH / 2);

    // ── PROGRESS FILL ──
    const fillW = barW * prog;

    if (fillW > 4) {
      p.fill(60, 130, 220);
      p.rect(barX, barY, fillW, barH, barH / 2);

      p.fill(255, 255, 255, 40);
      p.rect(barX + 2, barY + 2, fillW - 4, barH / 2 - 2, barH / 2);
    }

    // bar outline
    p.noFill();
    p.stroke(180);
    p.strokeWeight(1);
    p.rect(barX, barY, barW, barH, barH / 2);

    // ── HOUR LABELS ──
    p.noStroke();
    p.fill(100);
    p.textSize(13);
    p.textStyle(p.BOLD);
    p.textAlign(p.LEFT, p.CENTER);
    p.text(fmtHour(startHour), barX, barY + barH + 24);

    p.textAlign(p.CENTER, p.CENTER);
    p.text(fmtHour((startHour + endHour) / 2), barX + barW / 2, barY + barH + 24);

    p.textAlign(p.RIGHT, p.CENTER);
    p.text(fmtHour(endHour), barX + barW, barY + barH + 24);

    // tick marks
    p.stroke(150);
    p.strokeWeight(1);
    p.line(barX, barY - 10, barX, barY - 4);
    p.line(barX + barW / 2, barY - 10, barX + barW / 2, barY - 4);
    p.line(barX + barW, barY - 10, barX + barW, barY - 4);

    // border
    p.noFill();
    p.stroke(0);
    p.strokeWeight(1);
    p.rect(0, 0, p.width - 1, p.height - 1);
  };

  p.windowResized = function () { p.resizeCanvas(CANVAS_SIZE, CANVAS_SIZE); };
});