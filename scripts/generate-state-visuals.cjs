const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const electron = require("electron");

if (typeof electron === "string") {
  const result = spawnSync(electron, [__filename], { stdio: "inherit", windowsHide: true });
  process.exit(result.status ?? 0);
}

const { app, BrowserWindow } = electron;

app.commandLine.appendSwitch("disable-background-timer-throttling");
app.commandLine.appendSwitch("disable-renderer-backgrounding");
app.commandLine.appendSwitch("autoplay-policy", "no-user-gesture-required");

const outDir = path.join(__dirname, "..", "src", "ui", "jarvis-react", "public", "visuals");
const mirrorOutDir = path.join(__dirname, "..", "src", "ui", "jarvis", "visuals");
const baseImagePath = resolveBaseImagePath();
const baseImageDataUrl = `data:image/png;base64,${fs.readFileSync(baseImagePath).toString("base64")}`;

const states = [
  {
    id: "idle",
    label: "standby",
    seed: 1701,
    energy: 0.22,
    pulseRate: 1,
    drift: 0.2,
    dust: 0.45,
    rings: 0.38,
    ribbons: 0.2,
    speech: 0.08,
    warm: 0.14,
    hue: 190,
    accent: 38,
    baseAlpha: 0.82,
  },
  {
    id: "listening",
    label: "listening",
    seed: 2409,
    energy: 0.68,
    pulseRate: 2,
    drift: 0.34,
    dust: 0.72,
    rings: 0.76,
    ribbons: 0.42,
    speech: 0.28,
    warm: 0.2,
    hue: 186,
    accent: 40,
    baseAlpha: 0.88,
  },
  {
    id: "thinking",
    label: "thinking",
    seed: 3197,
    energy: 0.84,
    pulseRate: 3,
    drift: 0.42,
    dust: 0.8,
    rings: 0.62,
    ribbons: 0.72,
    speech: 0.18,
    warm: 0.24,
    hue: 178,
    accent: 44,
    baseAlpha: 0.86,
  },
  {
    id: "speaking",
    label: "speaking",
    seed: 4283,
    energy: 1,
    pulseRate: 4,
    drift: 0.5,
    dust: 0.92,
    rings: 0.84,
    ribbons: 0.88,
    speech: 1,
    warm: 0.36,
    hue: 184,
    accent: 36,
    baseAlpha: 0.92,
  },
  {
    id: "alert",
    label: "attention",
    seed: 5591,
    energy: 0.96,
    pulseRate: 5,
    drift: 0.38,
    dust: 0.78,
    rings: 0.9,
    ribbons: 0.66,
    speech: 0.4,
    warm: 0.82,
    hue: 18,
    accent: 42,
    baseAlpha: 0.86,
  },
];

function resolveBaseImagePath() {
  const candidates = [
    process.env.JARVIS_CORE_BASE_IMAGE,
    path.join(__dirname, "..", "concepts", "jarvis-core-concept-v2.png"),
    path.join(__dirname, "..", "output", "openrouter-icu", "jarvis-core-concept-v2.png"),
    path.join(__dirname, "..", "concepts", "jarvis-agnes-core-v3-living-core-frame.png"),
  ].filter(Boolean);

  const found = candidates.find((candidate) => fs.existsSync(candidate));
  if (!found) {
    throw new Error(`No Jarvis core base image found. Checked: ${candidates.join(", ")}`);
  }
  return found;
}

app.whenReady().then(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  fs.mkdirSync(mirrorOutDir, { recursive: true });

  const win = new BrowserWindow({
    width: 900,
    height: 900,
    show: false,
    backgroundColor: "#000000",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false,
    },
  });

  await win.loadURL("about:blank");
  await win.webContents.executeJavaScript(
    `window.__JARVIS_BASE_IMAGE = ${JSON.stringify(baseImageDataUrl)};`,
    true
  );

  process.stdout.write(`base image ${baseImagePath}\n`);
  for (const state of states) {
    process.stdout.write(`render ${state.id}.webm\n`);
    const dataUrl = await win.webContents.executeJavaScript(
      `(${recordStateVisual.toString()})(${JSON.stringify(state)})`,
      true
    );
    const base64 = dataUrl.split(",")[1];
    const buffer = Buffer.from(base64, "base64");
    const fileName = `${state.id}.webm`;
    fs.writeFileSync(path.join(outDir, fileName), buffer);
    fs.writeFileSync(path.join(mirrorOutDir, fileName), buffer);
  }

  await win.close();
  app.quit();
}).catch((error) => {
  console.error(error);
  app.quit();
  process.exitCode = 1;
});

async function recordStateVisual(state) {
  const canvas = document.createElement("canvas");
  canvas.width = 864;
  canvas.height = 864;
  document.documentElement.style.background = "#000";
  document.body.style.margin = "0";
  document.body.style.background = "#000";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
  const fps = 30;
  const seconds = 7.2;
  const totalFrames = Math.round(seconds * fps);
  const stream = canvas.captureStream(fps);
  const mimeType = [
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
  ].find((type) => MediaRecorder.isTypeSupported(type));
  const recorder = new MediaRecorder(stream, {
    ...(mimeType ? { mimeType } : {}),
    videoBitsPerSecond: 8_000_000,
  });
  const chunks = [];
  recorder.ondataavailable = (event) => {
    if (event.data && event.data.size) chunks.push(event.data);
  };
  const done = new Promise((resolve) => {
    recorder.onstop = async () => {
      const blob = new Blob(chunks, { type: mimeType || "video/webm" });
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    };
  });

  const image = await loadImage(window.__JARVIS_BASE_IMAGE);
  const TAU = Math.PI * 2;
  const W = canvas.width;
  const H = canvas.height;
  const CX = W / 2;
  const CY = H * 0.515;
  const rand = mulberry32(state.seed);
  const dust = buildDust(760 + Math.floor(state.dust * 360), rand);
  const arcs = buildArcs(26 + Math.floor(state.rings * 26), rand);
  const ribbons = buildRibbons(22 + Math.floor(state.ribbons * 18), rand);
  const sparks = buildSparks(68 + Math.floor(state.warm * 82), rand);

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = src;
    });
  }

  function mulberry32(seed) {
    return function next() {
      let t = seed += 0x6D2B79F5;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function mix(a, b, t) {
    return a + (b - a) * t;
  }

  function hsla(h, s, l, a = 1) {
    return `hsla(${((h % 360) + 360) % 360}, ${s}%, ${l}%, ${a})`;
  }

  function buildDust(count, random) {
    const items = [];
    for (let i = 0; i < count; i += 1) {
      const coreBias = Math.pow(random(), 1.8);
      const radius = mix(30, 315, coreBias);
      const speed = 1 + Math.floor(random() * 4);
      items.push({
        angle: random() * TAU,
        radius,
        yScale: 0.42 + random() * 0.46,
        speed: random() > 0.5 ? speed : -speed,
        phase: random() * TAU,
        size: 0.45 + random() * 1.55,
        alpha: 0.016 + random() * 0.14,
        warm: random() < state.warm,
        strand: random() > 0.9,
      });
    }
    return items;
  }

  function buildArcs(count, random) {
    const items = [];
    for (let i = 0; i < count; i += 1) {
      const speed = 1 + Math.floor(random() * 3);
      items.push({
        radius: 88 + random() * 225,
        yScale: 0.2 + random() * 0.55,
        tilt: -0.72 + random() * 1.5,
        start: random() * TAU,
        length: 0.14 + random() * 0.92,
        speed: random() > 0.5 ? speed : -speed,
        width: 0.35 + random() * 1.15,
        alpha: 0.018 + random() * 0.105,
        warm: random() < state.warm * 0.85,
      });
    }
    return items;
  }

  function buildRibbons(count, random) {
    const items = [];
    for (let i = 0; i < count; i += 1) {
      const speed = 1 + Math.floor(random() * 3);
      items.push({
        y: -112 + random() * 226,
        width: 132 + random() * 212,
        phase: random() * TAU,
        speed: random() > 0.5 ? speed : -speed,
        amp: 5 + random() * 22,
        alpha: 0.018 + random() * 0.09,
        warm: random() < state.warm * 0.55,
      });
    }
    return items;
  }

  function buildSparks(count, random) {
    const items = [];
    for (let i = 0; i < count; i += 1) {
      const speed = 1 + Math.floor(random() * 4);
      items.push({
        angle: random() * TAU,
        radius: 70 + random() * 275,
        phase: random() * TAU,
        speed: random() > 0.5 ? speed : -speed,
        size: 0.7 + random() * 2.1,
        alpha: 0.03 + random() * 0.18,
      });
    }
    return items;
  }

  function drawBasePlate(cycle, beat) {
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, H);

    const driftX = Math.sin(cycle) * state.drift * 3.2;
    const driftY = Math.cos(cycle * 2) * state.drift * 2.4;
    const scale = 1.01 + Math.sin(cycle) * 0.006 + beat * state.energy * 0.012;
    const dw = W * scale;
    const dh = H * scale;
    const dx = (W - dw) / 2 + driftX;
    const dy = (H - dh) / 2 + driftY;

    ctx.save();
    ctx.globalAlpha = state.baseAlpha;
    ctx.filter = `saturate(${0.9 + state.energy * 0.18}) contrast(${1.02 + state.energy * 0.12}) brightness(${0.88 + beat * state.energy * 0.12})`;
    ctx.drawImage(image, dx, dy, dw, dh);
    ctx.restore();

    if (state.speech > 0.2) {
      const echoScale = scale + 0.018 + beat * state.speech * 0.028;
      const echoW = W * echoScale;
      const echoH = H * echoScale;
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      ctx.globalAlpha = state.speech * (0.07 + beat * 0.18);
      ctx.filter = `blur(${(1.2 + beat * 2.4).toFixed(2)}px) saturate(1.22) contrast(1.08) brightness(1.18)`;
      ctx.drawImage(image, (W - echoW) / 2 - driftX * 0.5, (H - echoH) / 2 - driftY * 0.5, echoW, echoH);
      ctx.restore();
    }

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    const glow = ctx.createRadialGradient(CX - 26, CY - 18, 0, CX, CY, 306);
    glow.addColorStop(0, hsla(state.accent, 72, 78, 0.07 + beat * state.energy * 0.08));
    glow.addColorStop(0.24, hsla(state.hue, 45, 62, 0.035 + beat * state.energy * 0.06));
    glow.addColorStop(0.72, hsla(state.hue + 22, 34, 32, 0.015));
    glow.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  function drawDust(cycle, beat) {
    ctx.save();
    ctx.translate(CX, CY);
    ctx.globalCompositeOperation = "lighter";
    for (const p of dust) {
      const orbit = p.angle + cycle * p.speed * 0.05;
      const wobble = Math.sin(cycle * p.speed + p.phase) * (8 + state.energy * 14);
      const x = Math.cos(orbit) * (p.radius + wobble);
      const y = Math.sin(orbit) * (p.radius * p.yScale + wobble * 0.36);
      const hue = p.warm ? state.accent : state.hue + Math.sin(p.phase) * 10;
      const alpha = clamp(p.alpha * (0.52 + state.dust * 0.64 + beat * state.energy * 0.55), 0, 0.52);
      ctx.fillStyle = hsla(hue, p.warm ? 64 : 38, p.warm ? 76 : 74, alpha);
      ctx.beginPath();
      ctx.arc(x, y, p.size * (0.8 + beat * state.energy * 0.28), 0, TAU);
      ctx.fill();

      if (p.strand && alpha > 0.07) {
        ctx.strokeStyle = hsla(hue, 48, 76, alpha * 0.36);
        ctx.lineWidth = 0.45;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.sin(p.phase + cycle) * 18, y + Math.cos(p.phase - cycle) * 12);
        ctx.stroke();
      }
    }
    ctx.restore();
  }

  function drawArcs(cycle, beat) {
    ctx.save();
    ctx.translate(CX, CY);
    ctx.globalCompositeOperation = "lighter";
    ctx.lineCap = "round";
    for (const arc of arcs) {
      const hue = arc.warm ? state.accent : state.hue;
      ctx.save();
      ctx.rotate(arc.tilt + cycle * 0.05 * arc.speed);
      ctx.scale(1, arc.yScale + Math.sin(cycle * arc.speed + arc.start) * 0.035);
      ctx.lineWidth = arc.width;
      ctx.strokeStyle = hsla(hue, arc.warm ? 68 : 44, arc.warm ? 68 : 72, arc.alpha * (0.55 + state.rings + beat * state.energy));
      ctx.beginPath();
      const radius = arc.radius + beat * state.energy * 10;
      ctx.arc(0, 0, radius, arc.start + cycle * arc.speed * 0.28, arc.start + cycle * arc.speed * 0.28 + arc.length);
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
  }

  function drawRibbons(cycle, beat) {
    if (state.ribbons <= 0.01) return;
    ctx.save();
    ctx.translate(CX, CY);
    ctx.globalCompositeOperation = "lighter";
    ctx.lineCap = "round";
    for (const ribbon of ribbons) {
      const hue = ribbon.warm ? state.accent : state.hue;
      const amp = ribbon.amp * (0.45 + state.ribbons * 0.7 + beat * state.speech * 0.58);
      ctx.beginPath();
      for (let i = 0; i <= 80; i += 1) {
        const u = i / 80;
        const x = (u - 0.5) * ribbon.width * (1 + state.energy * 0.18);
        const envelope = Math.sin(u * Math.PI);
        const y =
          ribbon.y * (0.86 + state.energy * 0.06) +
          Math.sin(u * TAU * 3 + cycle * ribbon.speed + ribbon.phase) * amp * envelope +
          Math.sin(u * TAU * 9 - cycle * ribbon.speed + ribbon.phase) * amp * 0.24 * envelope;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.lineWidth = 0.45 + state.ribbons * 0.9 + beat * state.speech * 0.9;
      ctx.strokeStyle = hsla(hue, ribbon.warm ? 68 : 48, 76, ribbon.alpha * (0.4 + state.ribbons + beat * state.speech));
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawSpeechWave(cycle, beat) {
    if (state.speech <= 0.03) return;
    ctx.save();
    ctx.translate(CX, CY + 24);
    ctx.globalCompositeOperation = "lighter";
    ctx.lineCap = "round";

    for (let ring = 0; ring < 4; ring += 1) {
      ctx.save();
      ctx.rotate(Math.sin(cycle + ring) * 0.22 + ring * 0.38);
      ctx.scale(1, 0.34 + ring * 0.045);
      ctx.lineWidth = 0.8 + beat * 1.6 * state.speech;
      ctx.strokeStyle = hsla(ring % 2 ? state.accent : state.hue, ring % 2 ? 72 : 52, 78, (0.032 + beat * 0.12) * state.speech * (1 - ring * 0.12));
      ctx.beginPath();
      ctx.arc(0, 0, 128 + ring * 40 + beat * 34 * state.speech, 0, TAU);
      ctx.stroke();
      ctx.restore();
    }

    for (let line = 0; line < 5; line += 1) {
      const y0 = (line - 2) * 15;
      const alpha = (0.07 + beat * 0.22) * state.speech * (1 - line * 0.075);
      ctx.strokeStyle = hsla(line % 2 ? state.accent : state.hue, line % 2 ? 70 : 48, 76, alpha);
      ctx.lineWidth = 0.9 + beat * 1.9 * state.speech;
      ctx.beginPath();
      for (let i = 0; i <= 140; i += 1) {
        const u = i / 140;
        const x = -205 + u * 410;
        const envelope = Math.sin(u * Math.PI);
        const y =
          y0 +
          Math.sin(u * TAU * 4 + cycle * (2 + line) + line) * (6 + beat * 22) * envelope +
          Math.sin(u * TAU * 11 - cycle * 3 + line) * (2 + beat * 7) * envelope;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawSparks(cycle, beat) {
    if (state.warm <= 0.05) return;
    ctx.save();
    ctx.translate(CX, CY);
    ctx.globalCompositeOperation = "lighter";
    for (const spark of sparks) {
      const angle = spark.angle + cycle * spark.speed * 0.1;
      const radial = spark.radius + Math.sin(cycle * spark.speed + spark.phase) * 18 * state.energy;
      const x = Math.cos(angle) * radial;
      const y = Math.sin(angle) * radial * 0.64;
      const alpha = spark.alpha * state.warm * (0.55 + beat * 0.8);
      ctx.fillStyle = hsla(state.accent + Math.sin(spark.phase) * 8, 74, 72, alpha);
      ctx.beginPath();
      ctx.arc(x, y, spark.size * (0.7 + beat * 0.55), 0, TAU);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawScanAndVignette(cycle, beat) {
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    const scanY = CY - 170 + (Math.sin(cycle) * 0.5 + 0.5) * 340;
    const scan = ctx.createLinearGradient(0, scanY - 52, 0, scanY + 52);
    scan.addColorStop(0, "rgba(255,255,255,0)");
    scan.addColorStop(0.5, hsla(state.hue, 48, 78, 0.018 + state.energy * 0.025 + beat * 0.015));
    scan.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = scan;
    ctx.fillRect(0, 0, W, H);

    ctx.globalAlpha = 0.04;
    ctx.fillStyle = "#ffffff";
    for (let y = 0; y < H; y += 7) ctx.fillRect(0, y, W, 1);
    ctx.restore();

    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    const g = ctx.createRadialGradient(CX, CY, 238, CX, CY, 470);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(0.58, "rgba(0,0,0,0.18)");
    g.addColorStop(1, "rgba(0,0,0,0.82)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  function drawFrame(frame) {
    const progress = frame / totalFrames;
    const cycle = progress * TAU;
    const pulse = (Math.sin(cycle * state.pulseRate) + 1) * 0.5;
    const beat = Math.pow(pulse, state.id === "speaking" ? 1.25 : 2.2);

    drawBasePlate(cycle, beat);
    drawDust(cycle, beat);
    drawArcs(cycle, beat);
    drawRibbons(cycle, beat);
    drawSpeechWave(cycle, beat);
    drawSparks(cycle, beat);
    drawScanAndVignette(cycle, beat);
  }

  drawFrame(0);
  recorder.start(250);
  let frame = 0;

  await new Promise((resolve) => {
    const timer = setInterval(() => {
      drawFrame(frame);
      frame += 1;
      if (frame >= totalFrames) {
        clearInterval(timer);
        setTimeout(() => {
          recorder.stop();
          resolve();
        }, 80);
      }
    }, 1000 / fps);
  });

  return done;
}
