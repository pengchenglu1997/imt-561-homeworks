registerSketch('sk3', function (p) {
  const CANVAS_SIZE = 800;

  // ── workday presets (click to cycle) ──
  const presets = [
    { label: 'STANDARD', start: 9,  end: 18 },
    { label: 'EARLY',    start: 8,  end: 17 },
    { label: 'LATE',     start: 10, end: 19 },
  ];
  let presetIdx = 0;

  const barW = 600;
  const barH = 48;
  const barX = (CANVAS_SIZE - barW) / 2;
  const barY = 340;

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

  function getBlocks() {
    const { start, end } = presets[presetIdx];
    const total = end - start;
    return [
      { name: 'MORNING',   start: start,                end: start + total / 3 },
      { name: 'AFTERNOON', start: start + total / 3,    end: start + 2 * total / 3 },
      { name: 'EVENING',   start: start + 2 * total / 3, end: end },
    ];
  }

  function workdayProgress() {
    const { start, end } = presets[presetIdx];
    const now = new Date();
    const cur = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
    const total = end - start;
    return p.constrain((cur - start) / total, 0, 1);
  }

  function currentBlockIdx() {
    const blocks = getBlocks();
    const now = new Date();
    const cur = now.getHours() + now.getMinutes() / 60;
    for (let i = 0; i < blocks.length; i++) {
      if (cur >= blocks[i].start && cur < blocks[i].end) return i;
    }
    return -1;
  }

  function remainingTime() {
    const { end } = presets[presetIdx];
    const now = new Date();
    const cur = now.getHours() * 60 + now.getMinutes();
    const endMin = end * 60;
    const diff = Math.max(0, endMin - cur);
    return [Math.floor(diff / 60), diff % 60];
  }

  function progressColor(prog) {
    const stops = [
      { t: 0,    c: [70, 140, 230] },
      { t: 0.5,  c: [50, 180, 200] },
      { t: 0.8,  c: [230, 150, 60] },
      { t: 1,    c: [220, 80, 70] },
    ];
    for (let i = 0; i < stops.length - 1; i++) {
      const a = stops[i], b = stops[i + 1];
      if (prog >= a.t && prog <= b.t) {
        const k = (prog - a.t) / (b.t - a.t);
        return [
          a.c[0] + (b.c[0] - a.c[0]) * k,
          a.c[1] + (b.c[1] - a.c[1]) * k,
          a.c[2] + (b.c[2] - a.c[2]) * k,
        ];
      }
    }
    return [60, 130, 220];
  }

  function isOverBar() {
    return (
      p.mouseX >= barX && p.mouseX <= barX + barW &&
      p.mouseY >= barY - 10 && p.mouseY <= barY + barH + 10
    );
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

    p.fill(150);
    p.textSize(11);
    p.text('click progress bar to cycle:  ' + presets.map(x => x.label).join('  →  '), CANVAS_SIZE / 2, 118);

    const preset = presets[presetIdx];
    const startHour = preset.start;
    const endHour = preset.end;
    const blocks = getBlocks();
    const prog = workdayProgress();
    const pct = Math.floor(prog * 100);
    const activeIdx = currentBlockIdx();
    const pc = progressColor(prog);
    const accent = p.color(pc[0], pc[1], pc[2]);
    const accentDark = p.color(pc[0] * 0.7, pc[1] * 0.7, pc[2] * 0.7);

    // ── BIG % ──
    p.fill(30);
    p.textSize(96);
    p.textStyle(p.BOLD);
    p.textAlign(p.CENTER, p.BASELINE);
    p.text(pct + '%', CANVAS_SIZE / 2, barY - 50);

    p.fill(140);
    p.textSize(11);
    p.textStyle(p.BOLD);
    p.text('OF WORKDAY COMPLETE', CANVAS_SIZE / 2, barY - 28);

    // preset badge near percentage
    p.fill(accent);
    p.rect(CANVAS_SIZE / 2 - 50, barY - 12, 100, 16, 8);
    p.fill(255);
    p.textSize(9);
    p.textStyle(p.BOLD);
    p.textAlign(p.CENTER, p.CENTER);
    p.text(preset.label + ' · ' + fmtHour(startHour) + '–' + fmtHour(endHour),
           CANVAS_SIZE / 2, barY - 4);

    // ── BAR ──
    p.noStroke();
    p.fill(isOverBar() ? p.color(210) : p.color(220));
    p.rect(barX, barY, barW, barH, barH / 2);

    const fillW = barW * prog;
    if (fillW > 4) {
      p.fill(accent);
      p.rect(barX, barY, fillW, barH, barH / 2);
      p.fill(255, 255, 255, 40);
      p.rect(barX + 2, barY + 2, fillW - 4, barH / 2 - 2, barH / 2);
    }

    p.noFill();
    p.stroke(isOverBar() ? accentDark : p.color(180));
    p.strokeWeight(isOverBar() ? 2 : 1);
    p.rect(barX, barY, barW, barH, barH / 2);

    // hour labels
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

    p.stroke(150);
    p.strokeWeight(1);
    p.line(barX, barY - 10, barX, barY - 4);
    p.line(barX + barW / 2, barY - 10, barX + barW / 2, barY - 4);
    p.line(barX + barW, barY - 10, barX + barW, barY - 4);

    // ── BLOCK CARDS ──
    const blockY = barY + barH + 70;
    const blockH = 70;
    const blockGap = 16;
    const blockW = (barW - blockGap * (blocks.length - 1)) / blocks.length;

    blocks.forEach((b, i) => {
      const bx = barX + i * (blockW + blockGap);
      const isActive = i === activeIdx;

      p.noStroke();
      p.fill(isActive ? accent : p.color(235));
      p.rect(bx, blockY, blockW, blockH, 8);

      p.noFill();
      p.stroke(isActive ? accentDark : p.color(200));
      p.strokeWeight(1);
      p.rect(bx, blockY, blockW, blockH, 8);

      p.noStroke();
      p.fill(isActive ? 255 : 80);
      p.textSize(13);
      p.textStyle(p.BOLD);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(b.name, bx + blockW / 2, blockY + 24);

      p.fill(isActive ? p.color(255, 255, 255, 200) : p.color(140));
      p.textSize(11);
      p.textStyle(p.NORMAL);
      p.text(fmtHour(Math.floor(b.start)) + ' – ' + fmtHour(Math.floor(b.end)),
             bx + blockW / 2, blockY + 46);
    });

    // ── INFO BOX ──
    const infoY = blockY + blockH + 30;
    const infoH = 90;

    p.noStroke();
    p.fill(255);
    p.rect(barX, infoY, barW, infoH, 10);

    p.noFill();
    p.stroke(200);
    p.strokeWeight(1);
    p.rect(barX, infoY, barW, infoH, 10);

    const now = new Date();
    const hh = p.nf(now.getHours(), 2);
    const mm = p.nf(now.getMinutes(), 2);
    const ss = p.nf(now.getSeconds(), 2);

    p.noStroke();
    p.fill(140);
    p.textSize(10);
    p.textStyle(p.BOLD);
    p.textAlign(p.LEFT, p.CENTER);
    p.text('CURRENT TIME', barX + 24, infoY + 22);

    p.fill(30);
    p.textSize(32);
    p.textStyle(p.BOLD);
    p.text(hh + ':' + mm + ':' + ss, barX + 24, infoY + 58);

    p.stroke(220);
    p.strokeWeight(1);
    p.line(barX + barW / 2, infoY + 16, barX + barW / 2, infoY + infoH - 16);

    const [remH, remM] = remainingTime();
    p.noStroke();
    p.fill(140);
    p.textSize(10);
    p.textStyle(p.BOLD);
    p.textAlign(p.LEFT, p.CENTER);
    p.text('REMAINING', barX + barW / 2 + 24, infoY + 22);

    p.fill(accent);
    p.textSize(32);
    p.textStyle(p.BOLD);
    if (remH === 0 && remM === 0) {
      p.text('DONE', barX + barW / 2 + 24, infoY + 58);
    } else {
      p.text(remH + 'h ' + p.nf(remM, 2) + 'm', barX + barW / 2 + 24, infoY + 58);
    }

    // border
    p.noFill();
    p.stroke(0);
    p.strokeWeight(1);
    p.rect(0, 0, p.width - 1, p.height - 1);
  };

  p.mousePressed = function () {
    if (isOverBar()) {
      presetIdx = (presetIdx + 1) % presets.length;
    }
  };

  p.windowResized = function () { p.resizeCanvas(CANVAS_SIZE, CANVAS_SIZE); };
});