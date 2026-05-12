// =====================================================================
// IMT 561 · HWK 5 · sketch15-hwk5.js  (v3 — senior critic pass)
//
// "Two Triggers, Two Peaks: NYT Lifted Crawdads. Hollywood Re-Lifted It."
//
// Hero book case study: Where the Crawdads Sing (Owens, 2018)
// SPL monthly checkouts, 2018-01 → 2024-12 with NYT + Hollywood events.
//
// v3 narrative fixes:
//   P0-1  Retitled to commit to the claim the chart actually shows
//   P0-2  Removed mismatched 1.9× ratio; first peak now shows absolute peak only
//   P0-3  Reframed Hollywood-vs-NYT asymmetry as the story, not "doubled"
//   P1-4  Added contextualization of Crawdads vs the 5,236-title sample
//   P1-5  Added explicit COVID label on the 2020 dip (closes trust gap)
//   P1-6  Added +34.5% sample-average reference line
//   P1-7  Strengthened y-axis labels (no longer near-invisible)
//   P2-8  Added an editorial dek under the subtitle
//   P2-9  Increased visual weight of event-marker dashed lines
//   P2-10 Added "≈ 4 years apart" timespan annotation between peaks
//   P2-11 Title now 28pt, larger than the 30pt → reduced 3× to 26pt
// =====================================================================

registerSketch('sk15', function (p) {
  // ============ CONFIG ============
  const CANVAS_W = 800;
  const CANVAS_H = 800;

  const MARGIN = { top: 215, right: 50, bottom: 230, left: 80 };
  const CHART_X = MARGIN.left;
  const CHART_Y = MARGIN.top;
  const CHART_W = CANVAS_W - MARGIN.left - MARGIN.right;
  const CHART_H = CANVAS_H - MARGIN.top - MARGIN.bottom;
  const Y_MAX = 800;

  // Sienna / warm editorial palette
  const BG          = '#FAF6EF';
  const INK         = '#2A2520';
  const SUB_INK     = '#6B5F52';
  const LIGHT_INK   = '#8B7F70';   // bumped contrast slightly
  const LINE_MAIN   = '#A0522D';
  const LINE_DOT    = '#7A3E1F';
  const EVENT_INK   = '#4A352B';   // bumped saturation for event markers
  const ACCENT      = '#C84B31';
  const ACCENT_BG   = '#FDEBE0';
  const GRID        = '#EBE0D2';
  const RULE        = '#D4C7B5';
  const REF_INK     = '#9C9081';

  // ============ DATA ============
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

  // Event markers: only 3 left side; MOVIE RELEASED merged into anchor callout
  const EVENTS = [
    { idx: 7,  label: 'PUBLISHED',      date: 'Aug 14, 2018',         lh: 0,  align: 'L' },
    { idx: 8,  label: 'REESE PICK',     date: 'Sep 2018 \u2192 NYT #1', lh: 42, align: 'L' },
    { idx: 23, label: 'FILM ANNOUNCED', date: 'Hello Sunshine, 2019', lh: 0,  align: 'R', placement: 'below' },
  ];

  const FIRST_PEAK_IDX  = 14; // Mar 2019, v=380
  const SECOND_PEAK_IDX = 55; // Aug 2022, v=600
  const COVID_DIP_IDX   = 27; // Apr 2020, v=60
  const SAMPLE_AVG_REF  = 269; // 200/mo baseline × 1.345 = +34.5% sample mean

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
    p.text('SPL \u00D7 NYT \u00D7 HOLLYWOOD  \u00B7  HERO BOOK CASE STUDY', MARGIN.left, 28);

    // Main title — now largest single piece of text on the canvas (28pt)
    p.fill(INK);
    p.textStyle(p.BOLD);
    p.textSize(28);
    p.textLeading(34);
    p.text('Two Triggers, Two Peaks', MARGIN.left, 50);

    // Subtitle
    p.fill(SUB_INK);
    p.textStyle(p.ITALIC);
    p.textSize(15);
    p.text('NYT lifted Crawdads. Hollywood re-lifted it \u2014 higher.', MARGIN.left, 92);

    // Standfirst / dek — what the story actually is
    p.fill(SUB_INK);
    p.textStyle(p.NORMAL);
    p.textSize(11.5);
    p.textLeading(16);
    p.text(
      'A case study in how cultural intermediaries \u2014 bestseller lists and Hollywood \u2014',
      MARGIN.left, 118
    );
    p.text(
      'shape what one city actually borrows from its public library.',
      MARGIN.left, 134
    );

    // Rule
    p.stroke(RULE);
    p.strokeWeight(0.8);
    p.line(MARGIN.left, 162, CANVAS_W - MARGIN.right, 162);

    // Y axis tag
    p.noStroke();
    p.fill(SUB_INK);
    p.textStyle(p.NORMAL);
    p.textSize(10);
    p.textAlign(p.LEFT, p.TOP);
    p.text('MONTHLY CHECKOUTS \u00B7 SEATTLE PUBLIC LIBRARY', MARGIN.left, 178);
  }

  function drawAxes() {
    p.noStroke();
    p.textFont('Georgia');
    p.textStyle(p.NORMAL);

    // Y gridlines + labels (strengthened — readable now)
    [0, 200, 400, 600].forEach(v => {
      p.stroke(GRID);
      p.strokeWeight(0.6);
      p.line(CHART_X, yAt(v), CHART_X + CHART_W, yAt(v));
      p.noStroke();
      p.fill(SUB_INK);
      p.textAlign(p.RIGHT, p.CENTER);
      p.textSize(11);
      p.text(v, CHART_X - 10, yAt(v));
    });

    // X axis labels (years)
    p.fill(SUB_INK);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(11);
    for (let y = 2018; y <= 2024; y++) {
      const idx = DATA.findIndex(d => d.m === y + '-07');
      if (idx >= 0) {
        p.text(y, xAt(idx), CHART_Y + CHART_H + 10);
      }
    }

    // Baseline
    p.stroke(SUB_INK);
    p.strokeWeight(0.9);
    p.line(CHART_X, CHART_Y + CHART_H, CHART_X + CHART_W, CHART_Y + CHART_H);
  }

  function drawSampleReferenceLine() {
    // Horizontal +34.5% sample-average reference line
    const refY = yAt(SAMPLE_AVG_REF);

    p.stroke(REF_INK);
    p.strokeWeight(0.9);
    setDash([4, 4]);
    p.line(CHART_X, refY, CHART_X + CHART_W, refY);
    setDash([]);

    // Label — at right end, above the line
    p.noStroke();
    p.fill(REF_INK);
    p.textFont('Georgia');
    p.textStyle(p.ITALIC);
    p.textSize(9.5);
    p.textAlign(p.RIGHT, p.BOTTOM);
    p.text(
      'Sample average: 5,236 NYT titles lift +34.5% after listing',
      CHART_X + CHART_W - 4, refY - 3
    );
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

    const boxW = 250;
    const boxH = 84;
    const boxX = px - boxW / 2;
    const boxY = 224;

    // Connector
    p.stroke(ACCENT);
    p.strokeWeight(1.4);
    p.line(px, boxY + boxH, px, py - 5);
    p.noStroke();

    // Peak dot
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

    // Eyebrow — names the trigger
    p.fill(ACCENT);
    p.textFont('Georgia');
    p.textStyle(p.BOLD);
    p.textSize(9.5);
    p.textAlign(p.LEFT, p.TOP);
    p.text('MOVIE RELEASED  \u00B7  JUL 15, 2022', boxX + 14, boxY + 9);

    // Divider rule
    p.stroke(ACCENT);
    p.strokeWeight(0.6);
    p.line(boxX + 14, boxY + 25, boxX + 60, boxY + 25);
    p.noStroke();

    // Big "3×" — 26pt (smaller than 28pt title; preserves hierarchy)
    p.fill(ACCENT);
    p.textStyle(p.BOLD);
    p.textSize(26);
    p.text('3\u00D7', boxX + 14, boxY + 33);

    // Label stack
    p.fill(INK);
    p.textSize(11);
    p.textStyle(p.BOLD);
    p.text('PRE-MOVIE BASELINE', boxX + 60, boxY + 34);

    p.fill(SUB_INK);
    p.textSize(9.5);
    p.textStyle(p.NORMAL);
    p.text('Aug 2022 peak (600/mo)', boxX + 60, boxY + 50);
    p.textStyle(p.ITALIC);
    p.text('vs. 2021 steady-state (200/mo)', boxX + 60, boxY + 63);
  }

  function drawFirstPeakAnnotation() {
    const px = xAt(FIRST_PEAK_IDX);
    const py = yAt(DATA[FIRST_PEAK_IDX].v);

    // Annotation sits high enough to clear the +34.5% reference line below
    // and far enough above the peak to not collide with the Reese Pick label.
    // The trigger attribution is already carried by REESE PICK ("Sep 2018 → NYT #1"),
    // so this annotation now only carries the magnitude — the "what happened next."
    const annoY = py - 56;

    // Dashed connector
    p.stroke(SUB_INK);
    p.strokeWeight(0.9);
    setDash([2, 3]);
    p.line(px, annoY + 38, px, py - 6);
    setDash([]);

    // Peak dot (brown — secondary visual weight)
    p.noStroke();
    p.fill(EVENT_INK);
    p.circle(px, py, 7);
    p.fill(BG);
    p.circle(px, py, 2.5);

    p.textFont('Georgia');
    p.textAlign(p.CENTER, p.TOP);

    // Magnitude — absolute peak only (parallel to "3×" but in secondary scale)
    p.fill(INK);
    p.textStyle(p.BOLD);
    p.textSize(18);
    p.text('380/mo', px, annoY);

    // Caption
    p.fill(SUB_INK);
    p.textSize(9);
    p.textStyle(p.ITALIC);
    p.text('first-wave peak (NYT-driven)', px, annoY + 24);
  }

  function drawTimespanAnnotation() {
    // "3 years 5 months apart" arrow — placed up in the visually empty area
    // between the first-peak decay (after Mar 2019) and the rising slope to
    // the 2022 peak. Sits well above the 2020 dip's COVID label.
    const x1 = xAt(FIRST_PEAK_IDX) + 24;
    const x2 = xAt(SECOND_PEAK_IDX) - 28;
    const y  = yAt(450);  // up high, well clear of the data line and COVID label

    p.stroke(LIGHT_INK);
    p.strokeWeight(0.8);
    p.line(x1, y, x2, y);
    p.line(x1, y, x1 + 5, y - 3);
    p.line(x1, y, x1 + 5, y + 3);
    p.line(x2, y, x2 - 5, y - 3);
    p.line(x2, y, x2 - 5, y + 3);

    p.noStroke();
    p.fill(LIGHT_INK);
    p.textFont('Georgia');
    p.textStyle(p.ITALIC);
    p.textSize(9.5);
    p.textAlign(p.CENTER, p.BOTTOM);
    p.text('3 years 5 months apart', (x1 + x2) / 2, y - 4);
  }

  function drawCovidDipLabel() {
    const px = xAt(COVID_DIP_IDX);
    const py = yAt(DATA[COVID_DIP_IDX].v);

    // Small marker dot
    p.noStroke();
    p.fill(LIGHT_INK);
    p.circle(px, py, 4);

    // Label below the dip
    p.fill(LIGHT_INK);
    p.textFont('Georgia');
    p.textStyle(p.ITALIC);
    p.textSize(9);
    p.textAlign(p.LEFT, p.TOP);
    p.text('2020 dip:', px + 6, py + 6);
    p.text('SPL pandemic closures', px + 6, py + 18);
  }

  function drawEvents() {
    EVENTS.forEach(e => {
      const x = xAt(e.idx);
      const v = DATA[e.idx].v;
      const yLine = yAt(v);

      if (e.placement === 'below') {
        // Below-the-line placement: label sits between data line and baseline
        const labelY = yLine + 18;

        // Short downward dashed connector
        p.stroke(EVENT_INK);
        p.strokeWeight(1.1);
        setDash([2, 3]);
        p.line(x, yLine + 6, x, labelY - 4);
        setDash([]);

        // Dot on line
        p.noStroke();
        p.fill(LINE_DOT);
        p.circle(x, yLine, 8);
        p.fill(BG);
        p.circle(x, yLine, 3);

        // Label (right-aligned so it doesn't cross adjacent connectors)
        p.fill(EVENT_INK);
        p.textFont('Georgia');
        p.textStyle(p.BOLD);
        p.textSize(9.5);
        p.noStroke();
        p.textAlign(p.LEFT, p.TOP);
        p.text(e.label, x + 6, labelY);
        p.textStyle(p.NORMAL);
        p.fill(SUB_INK);
        p.textSize(9);
        p.text(e.date, x + 6, labelY + 13);
        return;
      }

      // Default: above-the-line placement
      const labelY = CHART_Y + 12 + e.lh;

      p.stroke(EVENT_INK);
      p.strokeWeight(1.1);
      setDash([2, 3]);
      p.line(x, yLine - 6, x, labelY + 26);
      setDash([]);

      p.noStroke();
      p.fill(LINE_DOT);
      p.circle(x, yLine, 8);
      p.fill(BG);
      p.circle(x, yLine, 3);

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
    const y0 = CANVAS_H - 178;

    p.stroke(RULE);
    p.strokeWeight(0.8);
    p.line(MARGIN.left, y0, CANVAS_W - MARGIN.right, y0);

    p.noStroke();
    p.fill(ACCENT);
    p.textFont('Georgia');
    p.textStyle(p.NORMAL);
    p.textSize(10);
    p.textAlign(p.LEFT, p.TOP);
    p.text('METHOD  \u00B7  WHY THIS MATTERS', MARGIN.left, y0 + 12);

    p.fill(INK);
    p.textStyle(p.NORMAL);
    p.textSize(11.5);
    p.textLeading(17);
    const body = 'A quasi-experimental event study of 5,236 NYT-listed titles in SPL OpenData finds that listing is associated with a +34.5% average increase in monthly borrowing (95% CI: 30.5%\u201338.4%, p<0.001) \u2014 shown as the dashed reference line above.';
    p.text(body, MARGIN.left, y0 + 32, CANVAS_W - MARGIN.left - MARGIN.right);

    p.fill(SUB_INK);
    p.textStyle(p.ITALIC);
    p.textSize(10.5);
    p.textLeading(15);
    const body2 = "Crawdads sits in the top decile of effect sizes \u2014 and uniquely shows a Hollywood-driven second peak that outdraws its bestseller-driven first peak. NYT made it visible; Hollywood made it Seattle's again.";
    p.text(body2, MARGIN.left, y0 + 88, CANVAS_W - MARGIN.left - MARGIN.right);

    p.fill(LIGHT_INK);
    p.textStyle(p.NORMAL);
    p.textSize(9);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.text('Data: SPL OpenData \u00D7 NYT Bestseller list, Aug 2018 \u2013 Dec 2024  \u00B7  IMT 561 HWK 5  \u00B7  Pengcheng Lu, UW iSchool, 2026',
           MARGIN.left, CANVAS_H - 16);
  }

  function drawHover() {
    if (p.mouseX < CHART_X || p.mouseX > CHART_X + CHART_W) return;
    if (p.mouseY < CHART_Y || p.mouseY > CHART_Y + CHART_H + 30) return;

    const rel = (p.mouseX - CHART_X) / CHART_W;
    const i = Math.max(0, Math.min(DATA.length - 1, Math.round(rel * (DATA.length - 1))));
    const d = DATA[i];
    const x = xAt(i);
    const y = yAt(d.v);

    p.stroke(LIGHT_INK);
    p.strokeWeight(0.6);
    setDash([2, 3]);
    p.line(x, CHART_Y, x, CHART_Y + CHART_H);
    setDash([]);

    p.noStroke();
    p.fill(LINE_MAIN);
    p.circle(x, y, 9);
    p.fill(BG);
    p.circle(x, y, 3.5);

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
      p.text('\u25CF ' + ev.label, ttX + 10, ttY + 42);
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
    drawSampleReferenceLine();
    drawArea();
    drawLine();
    drawTimespanAnnotation();
    drawCovidDipLabel();
    drawAnchorCallout();
    drawFirstPeakAnnotation();
    drawEvents();
    drawMethodNote();
    drawHover();
  };

  p.windowResized = function () { p.resizeCanvas(CANVAS_W, CANVAS_H); };
});