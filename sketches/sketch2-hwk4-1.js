registerSketch('sk2', function (p) {
  const CANVAS_SIZE = 800;

  // smartwatch frame dimensions
  const watchW = 380;
  const watchH = 480;
  const watchX = (CANVAS_SIZE - watchW) / 2;
  const watchY = 160;

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

    // smartwatch outer frame (metal bezel)
    p.fill(40);
    p.noStroke();
    p.rect(watchX - 8, watchY - 8, watchW + 16, watchH + 16, 56);

    // smartwatch inner screen
    p.fill(20);
    p.rect(watchX, watchY, watchW, watchH, 48);

    // crown (right-side button)
    p.fill(60);
    p.rect(watchX + watchW + 8, watchY + 80, 6, 30, 3);

    // placeholder inside watch
    p.fill(120);
    p.textSize(11);
    p.textStyle(p.NORMAL);
    p.textAlign(p.CENTER, p.CENTER);
    p.text('Watch face — empty', CANVAS_SIZE / 2, watchY + watchH / 2);

    // border frame
    p.noFill();
    p.stroke(0);
    p.strokeWeight(1);
    p.rect(0, 0, p.width - 1, p.height - 1);
  };

  p.windowResized = function () { p.resizeCanvas(CANVAS_SIZE, CANVAS_SIZE); };
});