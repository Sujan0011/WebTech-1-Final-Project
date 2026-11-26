(function () {
  var canvas = document.getElementById("board");
  if (!canvas) return;
  var ctx = canvas.getContext("2d");
  var scoreEl = document.getElementById("score");
  var bestEl = document.getElementById("best");
  var speedEl = document.getElementById("speed");
  var overlay = document.getElementById("overlay");
  var title = document.getElementById("title");
  var note = document.getElementById("note");
  var startBtn = document.getElementById("start");
  var pauseBtn = document.getElementById("pause");
  var best = Number(localStorage.getItem("nikhil-best") || 0);
  bestEl.textContent = best;

  var W = canvas.width, H = canvas.height;
  var bin = { x: W / 2, w: 120, h: 54 };
  var bottles = [];
  var running = false, paused = false, raf = 0;
  var score = 0, fall = 1.6, spawn = 0, keys = {};

  function reset() {
    bottles = [];
    score = 0;
    fall = 1.6;
    spawn = 0;
    bin.x = W / 2;
    scoreEl.textContent = "0";
    speedEl.textContent = "1";
  }

  function spawnBottle() {
    bottles.push({
      x: 40 + Math.random() * (W - 80),
      y: -40,
      r: 14 + Math.random() * 6,
      vy: fall + Math.random() * 0.4
    });
  }

  function drawBottle(b) {
    ctx.save();
    ctx.translate(b.x, b.y);
    ctx.fillStyle = "#7ec8e3";
    ctx.strokeStyle = "#1d4e6b";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-b.r * 0.35, -b.r * 1.35);
    ctx.lineTo(b.r * 0.35, -b.r * 1.35);
    ctx.lineTo(b.r * 0.55, -b.r * 0.85);
    ctx.lineTo(b.r * 0.7, b.r);
    ctx.quadraticCurveTo(0, b.r * 1.25, -b.r * 0.7, b.r);
    ctx.lineTo(-b.r * 0.55, -b.r * 0.85);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = "#146b3a";
    ctx.fillRect(-b.r * 0.32, -b.r * 0.2, b.r * 0.64, b.r * 0.45);
    ctx.restore();
  }

  function drawBin() {
    var x = bin.x - bin.w / 2, y = H - bin.h - 8;
    ctx.fillStyle = "#146b3a";
    ctx.beginPath();
    ctx.moveTo(x + 8, y);
    ctx.lineTo(x + bin.w - 8, y);
    ctx.lineTo(x + bin.w - 16, y + bin.h);
    ctx.lineTo(x + 16, y + bin.h);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#e7f3ea";
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.fillStyle = "#0d3b28";
    ctx.fillRect(x + 10, y - 8, bin.w - 20, 10);
  }

  function loop() {
    if (!running) return;
    raf = requestAnimationFrame(loop);
    if (paused) return;
    if (keys.ArrowLeft) bin.x -= 8;
    if (keys.ArrowRight) bin.x += 8;
    bin.x = Math.max(bin.w / 2, Math.min(W - bin.w / 2, bin.x));
    spawn += 1;
    if (spawn > Math.max(48, 110 - score * 2)) { spawn = 0; spawnBottle(); }
    ctx.clearRect(0, 0, W, H);
    bottles.forEach(function (b) { b.y += b.vy; drawBottle(b); });
    drawBin();
    var top = H - bin.h - 8;
    for (var i = bottles.length - 1; i >= 0; i--) {
      var b = bottles[i];
      var caught = b.y + b.r > top && b.y < H && Math.abs(b.x - bin.x) < bin.w / 2 - 6;
      if (caught) {
        bottles.splice(i, 1);
        score += 1;
        scoreEl.textContent = String(score);
        if (score > best) {
          best = score;
          localStorage.setItem("nikhil-best", String(best));
          bestEl.textContent = String(best);
        }
        if (score % 5 === 0) {
          fall = Math.min(fall + 0.25, 5);
          speedEl.textContent = String(Math.round(fall * 10) / 10);
        }
      } else if (b.y - b.r > H) {
        running = false;
        cancelAnimationFrame(raf);
        title.textContent = "Missed. Game stopped.";
        note.textContent = "Score " + score + ". Catch every bottle to keep going.";
        startBtn.textContent = "Play again";
        overlay.hidden = false;
        return;
      }
    }
  }

  function aim(clientX) {
    var rect = canvas.getBoundingClientRect();
    bin.x = ((clientX - rect.left) / rect.width) * W;
  }

  canvas.addEventListener("pointermove", function (e) {
    if (running && !paused) aim(e.clientX);
  });
  canvas.addEventListener("pointerdown", function (e) { aim(e.clientX); });
  window.addEventListener("keydown", function (e) { keys[e.key] = true; });
  window.addEventListener("keyup", function (e) { keys[e.key] = false; });

  function begin() {
    reset();
    overlay.hidden = true;
    running = true;
    paused = false;
    pauseBtn.textContent = "Pause";
    spawnBottle();
    cancelAnimationFrame(raf);
    loop();
  }
  startBtn.addEventListener("click", begin);
  pauseBtn.addEventListener("click", function () {
    if (!running) return;
    paused = !paused;
    pauseBtn.textContent = paused ? "Resume" : "Pause";
  });
})();
