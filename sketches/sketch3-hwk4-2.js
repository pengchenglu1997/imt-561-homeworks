registerSketch('sk3', function (p) {
  const CANVAS_SIZE = 800;

  // workday range
  const startHour = 9;   // 9 AM
  const endHour = 18;    // 6 PM

  // progress bar dimensions
  const barW = 600;
  const barH = 48;
  const barX = (CANVAS_SIZE - barW) / 2;
  const barY = 280;

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

  p.draw = function () {
    p.background(245);

    // title
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

    // ── PROGRESS BAR FRAME ──
    // outer track
    p.noStroke();
    p.fill(220);
    p.rect(barX, barY, barW, barH, barH / 2);

    // inner highlight (subtle)
    p.fill(235);
    p.rect(barX + 2, barY + 2, barW - 4, barH / 2 - 2, barH / 2);

    // ── HOUR TICK LABELS (below bar) ──
    p.fill(100);
    p.textSize(13);
    p.textStyle(p.BOLD);
    p.textAlign(p.LEFT, p.CENTER);
    p.text(fmtHour(startHour), barX, barY + barH + 24);

    p.textAlign(p.CENTER, p.CENTER);
    p.text(fmtHour((startHour + endHour) / 2), barX + barW / 2, barY + barH + 24);

    p.textAlign(p.RIGHT, p.CENTER);
    p.text(fmtHour(endHour), barX + barW, barY + barH + 24);

    // tick marks above bar (start, mid, end)
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