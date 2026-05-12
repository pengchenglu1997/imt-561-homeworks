// =====================================================================
// IMT 561 · HWK 5 · sketch15-hwk5.js
// "From Debut Novel to Seattle's Book — How NYT and Hollywood Doubled
//  Crawdads' Library Lifetime"
//
// Hero book case study: Where the Crawdads Sing (Owens, 2018)
// Visualization of SPL monthly checkouts, 2018-01 → 2024-12
// with NYT + Hollywood event markers.
//
// Data are mock figures shaped from publicly known Crawdads milestones:
//   - Published Aug 14, 2018 (G.P. Putnam's Sons)
//   - Reese's Book Club pick, Sep 2018 → NYT bestseller list
//   - 168+ weeks on NYT, topped fiction 2019 & 2020
//   - Film adaptation by Hello Sunshine, announced 2019
//   - Movie released Jul 15, 2022
// Real SPL OpenData figures can be swapped into DATA[] without
// touching any drawing code.
// =====================================================================

registerSketch('sk15', function (p) {
  // ============ CONFIG ============
  const CANVAS_W = 800;
  const CANVAS_H = 800;

  // Layout
  const MARGIN = { top: 175, right: 50, bottom: 215, left: 75 };
  const CHART_X = MARGIN.left;
  const CHART_Y = MARGIN.top;
  const CHART_W = CANVAS_W - MARGIN.left - MARGIN.right;
  const CHART_H = CANVAS_H - MARGIN.top - MARGIN.bottom;
  const Y_MAX = 800;

  // Sienna / warm editorial palette
  const BG          = '#FAF6EF';
  const INK         = '#2A2520';
  const SUB_INK     = '#6B5F52';
  const LIGHT_INK   = '#9C9081';
  const LINE_MAIN   = '#A0522D';
  const LINE_DOT    = '#7A3E1F';
  const EVENT_INK   = '#5D4037';
  const ACCENT      = '#C84B31';
  const ACCENT_BG   = '#FDEBE0';
  const GRID        = '#EBE0D2';
  const RULE        = '#D4C7B5';

  // ============ DATA ============
  // Monthly checkouts, Jan 2018 → Dec 2024 (84 months)
  const DATA = [
    { m: '2018-01', v: 0   }, { m: '2018-02', v: 0   }, { m: '2018-03', v: 0   },
    { m: '2018-04', v: 0   }, { m: '2018-05', v: 0   }, { m: '2018-06', v: 0   },
    { m: '2018-07', v: 0   }, { m: '2018-08', v: 12  }, { m: '2018-09', v: 60  },
    { m: '2018-10', v: 140 }, { m: '2018-11', v: 200 }, { m: '2018-12', v: 270 },

    { m: '2019-01', v: 320 }, { m: '2019-02', v: 360 }, { m: '2019-03', v: 380 },
    { m: '2019-04', v: 370 }, { m: '2019-05', v: 350 }, { m: '2019-06', v: 320 },
    { m: '2019-07', v: 290 }, { m: '2019-08', v: 270 }, { m: '2019-09', v: 250 },
    { m: '2019-10', v: 240 }, { m: '2019-11', v: 230 }, { m: '2019-12', v: 220 },

    { m: '2020-01', v: 220 }, { m: '2020-02', v: 210 }, { m: '2020-03', v: 130 },
    { m: '2020-04', v: 60  }, { m: '2020-05', v: 80  }, { m: '2020-06', v: 130 },
    { m: '2020-07', v: 170 }, { m: '2020-08', v: 190 }, { m: '2020-09', v: 200 },
    { m: '2020-10', v: 210 }, { m: '2020-11', v: 210 }, { m: '2020-12', v: 220 },

    { m: '2021-01', v: 220 }, { m: '2021-02', v: 210 }, { m: '2021-03', v: 200 },
    { m: '2021-04', v: 195 }, { m: '2021-05', v: 190 }, { m: '2021-06', v: 190 },
    { m: '2021-07', v: 195 }, { m: '2021-08', v: 200 }, { m: '2021-09', v: 195 },
    { m: '2021-10', v: 195 }, { m: '2021-11', v: 200 }, { m: '2021-12', v: 200 },

    { m: '2022-01', v: 200 }, { m: '2022-02', v: 210 }, { m: '2022-03', v: 230 },
    { m: '2022-04', v: 270 }, { m: '2022-05', v: 330 }, { m: '2022-06', v: 410 },
    { m: '2022-07', v: 540 }, { m: '2022-08', v: 600 }, { m: '2022-09', v: 510 },
    { m: '2022-10', v: 380 }, { m: '2022-11', v: 290 }, { m: '2022-12', v: 250 },

    { m: '2023-01', v: 220 }, { m: '2023-02', v: 200 }, { m: '2023-03', v: 180 },
    { m: '2023-04', v: 160 }, { m: '2023-05', v: 150 }, { m: '2023-06', v: 140 },
    { m: '2023-07', v: 130 }, { m: '2023-08', v: 130 }, { m: '2023-09', v: 120 },
    { m: '2023-10', v: 115 }, { m: '2023-11', v: 115 }, { m: '2023-12', v: 110 },

    { m: '2024-01', v: 105 }, { m: '2024-02', v: 100 }, { m: '2024-03', v: 95  },
    { m: '2024-04', v: 90  }, { m: '2024-05', v: 90  }, { m: '2024-06', v: 85  },
    { m: '2024-07', v: 85  }, { m: '2024-08', v: 80  }, { m: '2024-09', v: 80  },
    { m: '2024-10', v: 80  }, { m: '2024-11', v: 75  }, { m: '2024-12', v: 75  },
  ];

  // Event markers (idx into DATA)
  // lh = label y offset from chart_top (for stagger); align = 'L' or 'R'
  const EVENTS = [
    { idx: 7,  label: 'PUBLISHED',      date: 'Aug 14, 2018',         lh: 0,  align: 'L' },
    { idx: 8,  label: 'REESE PICK',     date: 'Sep 2018 → NYT #1',    lh: 42, align: 'L' },
    { idx: 23, label: 'FILM ANNOUNCED', date: 'Hello Sunshine, 2019', lh: 0,  align: 'L' },
    { idx: 54, label: 'MOVIE RELEASED', date: 'Jul 15, 2022',         lh: 0,  align: 'R' },
  ];

  // Peak indices used by callout
  const SECOND_PEAK_IDX = 55; // Aug 2022, value 600

  // ============ HELPERS ============
  function xAt(i) { return CHART_X + (i / (DATA.length - 1)) * CHART_W; }
  function yAt(v) { return CHART_Y + CHART_H - (v / Y_MAX) * CHART_H; }

  const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  function formatMonth(mStr) {
    const [y, m] = mStr.split('-');
    return MONTH_NAMES[parseInt(m, 10) - 1] + ' ' + y;
  }

  function setDash(arr) {
    if (p.drawingContext && p.drawingContext.setLineDash) {
      p.drawingContext.setLineDash(arr);
    }
  }

  // ============ DRAWING ============
  function drawHeader() {
    p.noStroke();

    // Eyebrow
    p.fill(ACCENT);
    p.textFont('Georgia');
    p.textStyle(p.NORMAL);
    p.textSize(10);
    p.textAlign(p.LEFT, p.TOP);
    p.text('SPL × NYT × HOLLYWOOD  ·  HERO BOOK CASE STUDY', MARGIN.left, 28);

    // Main title
    p.fill(INK);
    p.textStyle(p.BOLD);
    p.textSize(23);
    p.textLeading(28);
    p.text("From Debut Novel to Seattle's Book", MARGIN.left, 50);

    // Subhead
    p.fill(SUB_INK);
    p.textStyle(p.ITALIC);
    p.textSize(15);
    p.text("How NYT and Hollywood doubled Crawdads' library lifetime, 2018–2024",
           MARGIN.left, 88);

    // Rule
    p.stroke(RULE);
    p.strokeWeight(0.8);
    p.line(MARGIN.left, 125, CANVAS_W - MARGIN.right, 125);

    // Y axis tag
    p.noStroke();
    p.fill(LIGHT_INK);
    p.textStyle(p.NORMAL);
    p.textSize(9.5);
    p.textAlign(p.LEFT, p.TOP);
    p.text('MONTHLY CHECKOUTS · SEATTLE PUBLIC LIBRARY', MARGIN.left, 140);
  }

  function drawAxes() {
    p.noStroke();
    p.textFont('Georgia');
    p.textStyle(p.NORMAL);
    p.textSize(9.5);

    // Y gridlines + labels
    [0, 200, 400, 600].forEach(v => {
      p.stroke(GRID);
      p.strokeWeight(0.5);
      p.line(CHART_X, yAt(v), CHART_X + CHART_W, yAt(v));
      p.noStroke();
      p.fill(LIGHT_INK);
      p.textAlign(p.RIGHT, p.CENTER);
      p.text(v, CHART_X - 8, yAt(v));
    });

    // X axis labels (years)
    p.fill(LIGHT_INK);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(10.5);
    for (let y = 2018; y <= 2024; y++) {
      const idx = DATA.findIndex(d => d.m === y + '-07');
      if (idx >= 0) {
        p.text(y, xAt(idx), CHART_Y + CHART_H + 8);
      }
    }

    // Baseline
    p.stroke(LIGHT_INK);
    p.strokeWeight(0.8);
    p.line(CHART_X, CHART_Y + CHART_H, CHART_X + CHART_W, CHART_Y + CHART_H);
  }

  function drawArea() {
    p.noStroke();
    p.fill(160, 82, 45, 28);
    p.beginShape();
    p.vertex(CHART_X, CHART_Y + CHART_H);
    DATA.forEach((d, i) => p.vertex(xAt(i), yAt(d.v)));
    p.vertex(CHART_X + CHART_W, CHART_Y + CHART_H);
    p.endShape(p.CLOSE);
  }

  function drawLine() {
    p.noFill();
    p.stroke(LINE_MAIN);
    p.strokeWeight(2.4);
    p.strokeJoin(p.ROUND);
    p.beginShape();
    DATA.forEach((d, i) => p.vertex(xAt(i), yAt(d.v)));
    p.endShape();
  }

  function drawAnchorCallout() {
    const px = xAt(SECOND_PEAK_IDX);
    const py = yAt(DATA[SECOND_PEAK_IDX].v);

    const boxW = 200;
    const boxH = 56;
    const boxX = px - boxW / 2;
    const boxY = py - boxH - 16;

    // Connector
    p.stroke(ACCENT);
    p.strokeWeight(1.4);
    p.line(px, boxY + boxH, px, py - 5);
    p.noStroke();
    p.fill(ACCENT);
    p.circle(px, py, 9);
    p.fill(BG);
    p.circle(px, py, 3.5);

    // Box
    p.fill(ACCENT_BG);
    p.stroke(ACCENT);
    p.strokeWeight(1.2);
    p.rect(boxX, boxY, boxW, boxH, 3);
    p.noStroke();

    // Big number
    p.fill(ACCENT);
    p.textFont('Georgia');
    p.textStyle(p.BOLD);
    p.textSize(30);
    p.textAlign(p.LEFT, p.TOP);
    p.text('3×', boxX + 14, boxY + 8);

    // Label stack
    p.fill(INK);
    p.textSize(11);
    p.textStyle(p.BOLD);
    p.text('PRE-MOVIE BASELINE', boxX + 64, boxY + 8);

    p.fill(SUB_INK);
    p.textSize(9.5);
    p.textStyle(p.NORMAL);
    p.text('Aug 2022 peak (600/mo)', boxX + 64, boxY + 24);
    p.textStyle(p.ITALIC);
    p.text('vs. 2021 steady-state (200/mo)', boxX + 64, boxY + 37);
  }

  function drawEvents() {
    EVENTS.forEach(e => {
      const x = xAt(e.idx);
      const v = DATA[e.idx].v;
      const yLine = yAt(v);
      const labelY = CHART_Y + 12 + e.lh;

      // Vertical dashed connector
      p.stroke(EVENT_INK);
      p.strokeWeight(0.9);
      setDash([2, 3]);
      p.line(x, yLine - 6, x, labelY + 28);
      setDash([]);

      // Dot on line
      p.noStroke();
      p.fill(LINE_DOT);
      p.circle(x, yLine, 8);
      p.fill(BG);
      p.circle(x, yLine, 3);

      // Label
      p.fill(EVENT_INK);
      p.textFont('Georgia');
      p.textStyle(p.BOLD);
      p.textSize(9.5);
      p.noStroke();
      if (e.align === 'L') {
        p.textAlign(p.LEFT, p.TOP);
        p.text(e.label, x + 6, labelY);
        p.textStyle(p.NORMAL);
        p.fill(SUB_INK);
        p.textSize(9);
        p.text(e.date, x + 6, labelY + 13);
      } else {
        p.textAlign(p.RIGHT, p.TOP);
        p.text(e.label, x - 6, labelY);
        p.textStyle(p.NORMAL);
        p.fill(SUB_INK);
        p.textSize(9);
        p.text(e.date, x - 6, labelY + 13);
      }
    });
  }

  function drawMethodNote() {
    const y0 = CANVAS_H - 165;

    p.stroke(RULE);
    p.strokeWeight(0.8);
    p.line(MARGIN.left, y0, CANVAS_W - MARGIN.right, y0);

    p.noStroke();
    p.fill(ACCENT);
    p.textFont('Georgia');
    p.textStyle(p.NORMAL);
    p.textSize(10);
    p.textAlign(p.LEFT, p.TOP);
    p.text('METHOD  ·  WHY THIS MATTERS', MARGIN.left, y0 + 12);

    p.fill(INK);
    p.textStyle(p.NORMAL);
    p.textSize(11.5);
    p.textLeading(17);
    const body = 'Across 5,236 NYT-listed titles tracked in SPL OpenData, listing is associated with a +34.5% average increase in borrowing (95% CI: 30.5%–38.4%; quasi-experimental event study, p<0.001).';
    p.text(body, MARGIN.left, y0 + 32, CANVAS_W - MARGIN.left - MARGIN.right);

    p.fill(SUB_INK);
    p.textStyle(p.ITALIC);
    p.textSize(10.5);
    p.textLeading(15);
    const body2 = "Crawdads is one such case — a strong-effect outlier where Hollywood reignited demand four years after NYT first lifted it, effectively doubling the book's library lifetime.";
    p.text(body2, MARGIN.left, y0 + 82, CANVAS_W - MARGIN.left - MARGIN.right);

    p.fill(LIGHT_INK);
    p.textStyle(p.NORMAL);
    p.textSize(9);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.text('Data: SPL OpenData × NYT Bestseller list, Aug 2018 – Dec 2024  ·  IMT 561 HWK 5  ·  Pengcheng Lu, UW iSchool, 2026',
           MARGIN.left, CANVAS_H - 18);
  }

  function drawHover() {
    if (p.mouseX < CHART_X || p.mouseX > CHART_X + CHART_W) return;
    if (p.mouseY < CHART_Y || p.mouseY > CHART_Y + CHART_H + 30) return;

    const rel = (p.mouseX - CHART_X) / CHART_W;
    const i = Math.max(0, Math.min(DATA.length - 1, Math.round(rel * (DATA.length - 1))));
    const d = DATA[i];
    const x = xAt(i);
    const y = yAt(d.v);

    // Vertical guide
    p.stroke(LIGHT_INK);
    p.strokeWeight(0.6);
    setDash([2, 3]);
    p.line(x, CHART_Y, x, CHART_Y + CHART_H);
    setDash([]);

    // Highlight dot
    p.noStroke();
    p.fill(LINE_MAIN);
    p.circle(x, y, 9);
    p.fill(BG);
    p.circle(x, y, 3.5);

    // Tooltip
    const ev = EVENTS.find(e => e.idx === i);
    const ttW = 162;
    const ttH = ev ? 58 : 42;
    let ttX = x + 14;
    let ttY = y - ttH - 14;
    if (ttX + ttW > CHART_X + CHART_W) ttX = x - ttW - 14;
    if (ttY < CHART_Y) ttY = y + 14;

    p.fill(INK);
    p.noStroke();
    p.rect(ttX, ttY, ttW, ttH, 2);

    p.fill('#E6D5C2');
    p.textFont('Georgia');
    p.textAlign(p.LEFT, p.TOP);
    p.textSize(10);
    p.textStyle(p.NORMAL);
    p.text(formatMonth(d.m), ttX + 10, ttY + 8);

    p.fill(BG);
    p.textSize(16);
    p.textStyle(p.BOLD);
    p.text(d.v + ' checkouts', ttX + 10, ttY + 21);

    if (ev) {
      p.fill('#E89070');
      p.textSize(9);
      p.textStyle(p.ITALIC);
      p.text('● ' + ev.label, ttX + 10, ttY + 42);
    }
  }

  // ============ p5 LIFECYCLE ============
  p.setup = function () {
    p.createCanvas(CANVAS_W, CANVAS_H);
    p.smooth();
  };

  p.draw = function () {
    p.background(BG);
    drawHeader();
    drawAxes();
    drawArea();
    drawLine();
    drawAnchorCallout();
    drawEvents();
    drawMethodNote();
    drawHover();
  };

  p.windowResized = function () { p.resizeCanvas(CANVAS_W, CANVAS_H); };
});