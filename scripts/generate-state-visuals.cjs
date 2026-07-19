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

const states = [
  {
    id: "idle",
    label: "standby",
    seed: 1701,
    particles: 3150,
    energy: 0.28,
    spin: 0.34,
    bloom: 0.5,
    rings: 0.38,
    response: 0.18,
    palette: {
      base: 168,
      accent: 42,
      glass: 190,
      shadow: "#040504",
    },
  },
  {
    id: "listening",
    label: "listening",
    seed: 2409,
    particles: 3450,
    energy: 0.7,
    spin: 0.48,
    bloom: 0.74,
    rings: 0.8,
    response: 0.82,
    palette: {
      base: 178,
      accent: 36,
      glass: 184,
      shadow: "#040606",
    },
  },
  {
    id: "thinking",
    label: "thinking",
    seed: 3197,
    particles: 3600,
    energy: 0.92,
    spin: 0.62,
    bloom: 0.86,
    rings: 0.62,
    response: 0.56,
    palette: {
      base: 152,
      accent: 44,
      glass: 174,
      shadow: "#050604",
    },
  },
  {
    id: "speaking",
    label: "speaking",
    seed: 4283,
    particles: 3500,
    energy: 1.0,
    spin: 0.54,
    bloom: 0.96,
    rings: 0.72,
    response: 1.0,
    palette: {
      base: 188,
      accent: 28,
      glass: 182,
      shadow: "#050505",
    },
  },
  {
    id: "alert",
    label: "attention",
    seed: 5591,
    particles: 3250,
    energy: 1.05,
    spin: 0.58,
    bloom: 0.84,
    rings: 0.9,
    response: 0.96,
    palette: {
      base: 18,
      accent: 43,
      glass: 28,
      shadow: "#060403",
    },
  },
];

app.whenReady().then(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const win = new BrowserWindow({
    width: 720,
    height: 720,
    show: false,
    backgroundColor: "#000000",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      backgroundThrottling: false,
    },
  });

  await win.loadURL("about:blank");
  for (const state of states) {
    process.stdout.write(`render ${state.id}.webm\n`);
    const dataUrl = await win.webContents.executeJavaScript(
      `(${recordStateVisual.toString()})(${JSON.stringify(state)})`,
      true
    );
    const base64 = dataUrl.split(",")[1];
    fs.writeFileSync(path.join(outDir, `${state.id}.webm`), Buffer.from(base64, "base64"));
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
  canvas.width = 720;
  canvas.height = 720;
  document.documentElement.style.background = "#000";
  document.body.style.margin = "0";
  document.body.style.background = "#000";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
  const fps = 30;
  const seconds = 5.6;
  const totalFrames = Math.round(seconds * fps);
  const stream = canvas.captureStream(fps);
  const mimeType = [
    "video/webm;codecs=vp9",
    "video/webm;codecs=vp8",
    "video/webm",
  ].find((type) => MediaRecorder.isTypeSupported(type));
  const recorder = new MediaRecorder(stream, {
    ...(mimeType ? { mimeType } : {}),
    videoBitsPerSecond: 6400000,
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

  const TAU = Math.PI * 2;
  const W = canvas.width;
  const H = canvas.height;
  const CX = W / 2;
  const CY = H / 2;
  const rand = mulberry32(state.seed);
  const particles = buildParticles(state, rand);
  const arcs = buildOrbitArcs(state, rand);
  const motes = buildMotes(state, rand);
  const filaments = buildFilaments(state, rand);

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

  function buildParticles(config, random) {
    const list = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    const count = config.particles;
    for (let i = 0; i < count; i += 1) {
      const u = (i + 0.5) / count;
      const y = 1 - u * 2;
      const radius = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i + (random() - 0.5) * 0.34;
      const shell = mix(0.58, 1.05, Math.pow(random(), 0.34));
      const polarPinch = 1 - Math.pow(Math.abs(y), 3) * 0.08;
      const strand = Math.sin(i * 0.033) * 0.048 + Math.sin(i * 0.009) * 0.052;
      list.push({
        x: Math.cos(theta + strand) * radius * shell * polarPinch,
        y: y * shell * (0.92 + random() * 0.1),
        z: Math.sin(theta + strand) * radius * shell * polarPinch,
        phase: random() * TAU,
        drift: 0.45 + random() * 1.8,
        size: 0.45 + random() * 1.35,
        alpha: 0.18 + random() * 0.72,
        hueBias: (random() - 0.5) * 28,
        warm: state.id === "alert" ? random() > 0.62 : random() > 0.82,
        tracer: random() > 0.982,
      });
    }
    return list;
  }

  function buildOrbitArcs(config, random) {
    const list = [];
    const count = 42 + Math.floor(config.rings * 28);
    for (let i = 0; i < count; i += 1) {
      list.push({
        radius: 104 + random() * 225,
        yScale: 0.28 + random() * 0.64,
        tilt: (random() - 0.5) * 1.08,
        start: random() * TAU,
        length: 0.18 + random() * 1.2,
        spin: (random() > 0.5 ? 1 : -1) * (0.24 + random() * 0.82),
        width: 0.45 + random() * 1.4,
        alpha: 0.026 + random() * 0.12,
        warm: random() > 0.75,
      });
    }
    return list;
  }

  function buildMotes(config, random) {
    const list = [];
    for (let i = 0; i < 380; i += 1) {
      list.push({
        angle: random() * TAU,
        radius: 150 + random() * 230,
        yScale: 0.62 + random() * 0.36,
        phase: random() * TAU,
        speed: 0.4 + random() * 1.4,
        alpha: 0.025 + random() * 0.13,
        warm: random() > 0.82,
      });
    }
    return list;
  }

  function buildFilaments(config, random) {
    const list = [];
    for (let i = 0; i < 26; i += 1) {
      list.push({
        latitude: mix(-0.72, 0.72, random()),
        phase: random() * TAU,
        twist: (random() > 0.5 ? 1 : -1) * (0.35 + random() * 1.1),
        width: 0.45 + random() * 0.9,
        alpha: 0.035 + random() * 0.095,
        warm: random() > 0.7,
      });
    }
    return list;
  }

  function rotatePoint(point, rx, ry, rz) {
    let { x, y, z } = point;
    let c = Math.cos(rx), s = Math.sin(rx);
    [y, z] = [y * c - z * s, y * s + z * c];
    c = Math.cos(ry); s = Math.sin(ry);
    [x, z] = [x * c + z * s, -x * s + z * c];
    c = Math.cos(rz); s = Math.sin(rz);
    [x, y] = [x * c - y * s, x * s + y * c];
    return { x, y, z };
  }

  function drawBackground(cycle, beat) {
    ctx.globalCompositeOperation = "source-over";
    ctx.fillStyle = state.palette.shadow;
    ctx.fillRect(0, 0, W, H);

    let g = ctx.createRadialGradient(CX - 58, CY - 72, 20, CX, CY, 410);
    g.addColorStop(0, hsla(state.palette.base, 28, 34, 0.22 + beat * 0.045));
    g.addColorStop(0.42, hsla(state.palette.base + 18, 16, 11, 0.12));
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, "rgba(255,255,255,0.012)");
    g.addColorStop(0.52, "rgba(0,0,0,0)");
    g.addColorStop(1, hsla(state.palette.accent, 38, 20, 0.055));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.globalAlpha = 0.055;
    ctx.fillStyle = "#ffffff";
    for (let i = 0; i < 120; i += 1) {
      const x = (Math.sin(i * 91.7 + cycle * 0.03) * 0.5 + 0.5) * W;
      const y = (Math.sin(i * 47.3 + 6.1) * 0.5 + 0.5) * H;
      ctx.fillRect(x, y, 1, 1);
    }
    ctx.restore();
  }

  function drawGlassLens(cycle, beat) {
    ctx.save();
    ctx.translate(CX, CY);

    let g = ctx.createRadialGradient(-64, -76, 18, 0, 0, 305);
    g.addColorStop(0, "rgba(255,255,255,0.12)");
    g.addColorStop(0.22, hsla(state.palette.base, 42, 22, 0.09 + beat * 0.03));
    g.addColorStop(0.64, "rgba(0,0,0,0)");
    g.addColorStop(1, "rgba(0,0,0,0.58)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, 302, 0, TAU);
    ctx.fill();

    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < 4; i += 1) {
      const r = 245 + i * 16 + Math.sin(cycle * 0.8 + i) * 1.8;
      ctx.lineWidth = i === 0 ? 1.15 : 0.55;
      ctx.strokeStyle = hsla(state.palette.glass + i * 8, 38, 74, 0.07 - i * 0.01 + beat * 0.012);
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, TAU);
      ctx.stroke();
    }

    const highlight = [
      [255, 0.72, 1.08, 0.48],
      [18, 0.34, 0.78, 0.34],
      [132, 0.2, 0.54, 0.24],
    ];
    for (const [deg, len, radiusScale, alpha] of highlight) {
      const start = cycle * 0.18 + deg * Math.PI / 180;
      ctx.lineCap = "round";
      ctx.lineWidth = 2.1;
      ctx.strokeStyle = hsla(state.palette.glass, 55, 78, alpha * (0.7 + state.rings * 0.2));
      ctx.beginPath();
      ctx.arc(0, 0, 255 * radiusScale, start, start + len);
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawOrbitArcs(cycle, beat) {
    ctx.save();
    ctx.translate(CX, CY);
    ctx.globalCompositeOperation = "lighter";
    for (const arc of arcs) {
      const hue = arc.warm ? state.palette.accent : state.palette.glass;
      const wobble = Math.sin(cycle * arc.spin + arc.start) * 0.08;
      ctx.save();
      ctx.rotate(arc.tilt + cycle * 0.035 * arc.spin);
      ctx.scale(1, arc.yScale + wobble * 0.14);
      ctx.lineWidth = arc.width;
      ctx.lineCap = "round";
      ctx.strokeStyle = hsla(hue, arc.warm ? 62 : 46, arc.warm ? 66 : 70, arc.alpha * (0.78 + beat * state.rings));
      ctx.beginPath();
      ctx.arc(0, 0, arc.radius + beat * state.energy * 8, arc.start + cycle * arc.spin, arc.start + cycle * arc.spin + arc.length);
      ctx.stroke();
      ctx.restore();
    }
    ctx.restore();
  }

  function drawFilaments(cycle, beat) {
    ctx.save();
    ctx.translate(CX, CY);
    ctx.globalCompositeOperation = "lighter";
    const rx = -0.2 + Math.sin(cycle * 0.43) * 0.08;
    const ry = cycle * state.spin * 0.8;
    const rz = Math.cos(cycle * 0.37) * 0.05;
    const bodyScale = 192 + beat * state.energy * 16;

    for (const line of filaments) {
      const hue = line.warm ? state.palette.accent : state.palette.base;
      ctx.beginPath();
      for (let step = 0; step <= 94; step += 1) {
        const t = step / 94;
        const a = t * TAU + line.phase + cycle * line.twist;
        const y = line.latitude + Math.sin(a * 2 + cycle) * 0.035 * state.energy;
        const r = Math.sqrt(Math.max(0, 1 - y * y));
        const p = rotatePoint({
          x: Math.cos(a) * r,
          y,
          z: Math.sin(a) * r,
        }, rx, ry, rz);
        const perspective = 1.2 / (1.72 - p.z * 0.35);
        const x = p.x * bodyScale * perspective;
        const yy = p.y * bodyScale * perspective * 0.96;
        if (step === 0) ctx.moveTo(x, yy);
        else ctx.lineTo(x, yy);
      }
      ctx.lineWidth = line.width;
      ctx.strokeStyle = hsla(hue, line.warm ? 56 : 28, line.warm ? 70 : 74, line.alpha * (0.78 + beat * 0.7));
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawMotes(cycle) {
    ctx.save();
    ctx.translate(CX, CY);
    ctx.globalCompositeOperation = "lighter";
    for (const mote of motes) {
      const flow = cycle * mote.speed + mote.phase;
      const radius = mote.radius + Math.sin(flow * 1.3) * 14 * state.energy;
      const angle = mote.angle + cycle * 0.07 * mote.speed;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius * mote.yScale;
      const hue = mote.warm ? state.palette.accent : state.palette.glass;
      const alpha = mote.alpha * (0.42 + Math.sin(flow) * 0.34 + state.energy * 0.2);
      ctx.fillStyle = hsla(hue, mote.warm ? 56 : 26, 74, Math.max(0.01, alpha));
      ctx.fillRect(x, y, 1.1, 1.1);
    }
    ctx.restore();
  }

  function drawParticleBody(cycle, beat) {
    ctx.save();
    ctx.translate(CX, CY);
    ctx.globalCompositeOperation = "lighter";

    const rx = -0.18 + Math.sin(cycle * 0.74) * 0.09;
    const ry = cycle * state.spin + Math.sin(cycle * 0.41) * 0.15;
    const rz = Math.cos(cycle * 0.49) * 0.06;
    const bodyScale = 194 + beat * state.energy * 25;
    const projected = [];

    for (const p of particles) {
      const ripple =
        Math.sin(cycle * p.drift + p.phase) * 0.034 +
        Math.sin((p.x * 3.1 + p.y * 2.4 + p.z * 2.8) + cycle * 1.8) * 0.018 * state.energy;
      const breath = 1 + ripple * state.energy + beat * 0.018 * state.energy;
      const shear = Math.sin(cycle * 1.2 + p.phase) * 0.025 * state.energy;
      const warped = {
        x: p.x * breath + p.y * shear * 0.45,
        y: p.y * (0.97 + Math.cos(cycle * 0.85 + p.phase) * 0.018 * state.energy),
        z: p.z * breath + Math.sin(p.y * 3 + cycle) * 0.012 * state.energy,
      };
      const r = rotatePoint(warped, rx, ry, rz);
      const depth = clamp((r.z + 1.2) / 2.4, 0, 1);
      const perspective = 1.18 / (1.68 - r.z * 0.36);
      projected.push({
        x: r.x * bodyScale * perspective,
        y: r.y * bodyScale * perspective * 0.97,
        z: r.z,
        depth,
        size: p.size * (0.58 + depth * 1.18) * (1 + beat * state.energy * 0.28),
        alpha: clamp((0.08 + depth * 0.62) * p.alpha * (0.72 + state.energy * 0.24), 0.018, 0.88),
        hue: (p.warm ? state.palette.accent : state.palette.base) + p.hueBias + depth * 8,
        warm: p.warm,
        tracer: p.tracer,
        phase: p.phase,
      });
    }

    projected.sort((a, b) => a.z - b.z);

    for (const p of projected) {
      const saturation = p.warm ? 50 : 15 + p.depth * 18;
      const lightness = p.warm ? 68 + p.depth * 10 : 68 + p.depth * 16;
      ctx.fillStyle = hsla(p.hue, saturation, lightness, p.alpha);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, TAU);
      ctx.fill();

      if (p.tracer && p.depth > 0.46) {
        ctx.strokeStyle = hsla(p.warm ? state.palette.accent : state.palette.glass, p.warm ? 58 : 42, 75, p.alpha * 0.34);
        ctx.lineWidth = 0.55;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x + Math.sin(p.phase + cycle) * 18, p.y + Math.cos(p.phase - cycle) * 14);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  function drawCoreGlow(cycle, beat) {
    ctx.save();
    ctx.translate(CX, CY);
    ctx.globalCompositeOperation = "lighter";
    const warmPulse = Math.pow(beat, 1.6);
    let g = ctx.createRadialGradient(-22, -20, 3, 0, 0, 122 + warmPulse * 18);
    g.addColorStop(0, hsla(state.palette.accent, 60, 82, 0.34 + warmPulse * 0.12));
    g.addColorStop(0.22, hsla(state.palette.base, 24, 72, 0.18 + state.bloom * 0.05));
    g.addColorStop(0.7, hsla(state.palette.glass, 24, 54, 0.045));
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, 150, 0, TAU);
    ctx.fill();

    ctx.fillStyle = hsla(state.palette.accent, 48, 82, 0.04 + warmPulse * 0.07);
    ctx.beginPath();
    ctx.ellipse(0, 0, 102 + warmPulse * 12, 42 + warmPulse * 5, cycle * 0.22, 0, TAU);
    ctx.fill();
    ctx.restore();
  }

  function drawStateResponse(cycle, beat) {
    ctx.save();
    ctx.translate(CX, CY);
    ctx.globalCompositeOperation = "lighter";
    const response = state.response;

    if (state.id === "listening") {
      for (let i = 0; i < 5; i += 1) {
        const r = 124 + i * 30 + beat * 22 * response;
        ctx.lineWidth = 0.75;
        ctx.strokeStyle = hsla(state.palette.glass, 42, 75, (0.13 - i * 0.018) * response);
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, TAU);
        ctx.stroke();
      }
      drawRadialBars(cycle, beat, 116, 168, 96, 0.55);
    } else if (state.id === "thinking") {
      for (let i = 0; i < 36; i += 1) {
        const a = (i / 36) * TAU + cycle * (i % 2 ? -0.18 : 0.22);
        const r = 92 + (i % 4) * 34 + Math.sin(cycle * 2.4 + i) * 7;
        const x = Math.cos(a) * r;
        const y = Math.sin(a) * r * 0.76;
        ctx.fillStyle = hsla(i % 3 ? state.palette.base : state.palette.accent, 48, 72, 0.14 + beat * 0.05);
        ctx.fillRect(x - 1.6, y - 1.6, 3.2, 3.2);
      }
      drawRadialBars(cycle, beat, 130, 176, 84, 0.36);
    } else if (state.id === "speaking") {
      ctx.lineCap = "round";
      for (let line = 0; line < 5; line += 1) {
        ctx.strokeStyle = hsla(line % 2 ? state.palette.accent : state.palette.glass, line % 2 ? 58 : 42, 76, 0.16 - line * 0.014 + beat * 0.08);
        ctx.lineWidth = 1.1;
        ctx.beginPath();
        const y = (line - 2) * 15;
        for (let i = 0; i <= 120; i += 1) {
          const x = -140 + i * (280 / 120);
          const fade = Math.sin((i / 120) * Math.PI);
          const wave = Math.sin(i * 0.26 + cycle * 7.2 + line) * (7 + beat * 18) * fade;
          if (i === 0) ctx.moveTo(x, y + wave);
          else ctx.lineTo(x, y + wave);
        }
        ctx.stroke();
      }
      drawRadialBars(cycle, beat, 144, 202, 132, 0.74);
    } else if (state.id === "alert") {
      ctx.setLineDash([18, 12]);
      for (let i = 0; i < 5; i += 1) {
        ctx.lineDashOffset = -cycle * (30 + i * 10);
        ctx.lineWidth = 1.05 + i * 0.1;
        ctx.strokeStyle = hsla(state.palette.base + i * 3, 62, 62, 0.2 - i * 0.025 + beat * 0.05);
        ctx.beginPath();
        ctx.arc(0, 0, 118 + i * 32 + beat * 9, 0, TAU);
        ctx.stroke();
      }
      ctx.setLineDash([]);
      drawRadialBars(cycle, beat, 136, 200, 108, 0.68);
    } else {
      drawRadialBars(cycle, beat, 142, 178, 64, 0.18);
    }

    ctx.restore();
  }

  function drawRadialBars(cycle, beat, inner, outer, count, intensity) {
    for (let i = 0; i < count; i += 1) {
      const a = (i / count) * TAU;
      const wave = Math.sin(cycle * 4.6 + i * 0.37) * 0.65 + Math.sin(cycle * 1.9 + i * 0.11) * 0.35;
      const amp = Math.pow(Math.abs(wave), 1.7);
      const start = inner + amp * 7;
      const length = mix(5, outer - inner, amp) * intensity * (0.74 + beat * 0.42);
      ctx.lineWidth = 0.55 + amp * 0.72;
      ctx.strokeStyle = hsla(amp > 0.72 ? state.palette.accent : state.palette.glass, amp > 0.72 ? 58 : 42, 74, (0.028 + amp * 0.22) * intensity);
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * start, Math.sin(a) * start);
      ctx.lineTo(Math.cos(a) * (start + length), Math.sin(a) * (start + length));
      ctx.stroke();
    }
  }

  function drawVignette(cycle) {
    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    const scan = ctx.createLinearGradient(0, CY - 58 + Math.sin(cycle * 1.4) * 18, 0, CY + 58 + Math.sin(cycle * 1.4) * 18);
    scan.addColorStop(0, "rgba(0,0,0,0)");
    scan.addColorStop(0.5, hsla(state.palette.glass, 42, 76, state.id === "idle" ? 0.026 : 0.046));
    scan.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = scan;
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = "rgba(0,0,0,0.075)";
    for (let y = 0; y < H; y += 6) ctx.fillRect(0, y, W, 1);

    const g = ctx.createRadialGradient(CX, CY, 210, CX, CY, 368);
    g.addColorStop(0, "rgba(0,0,0,0)");
    g.addColorStop(0.78, "rgba(0,0,0,0.12)");
    g.addColorStop(1, "rgba(0,0,0,0.52)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
  }

  function drawFrame(frame) {
    const progress = frame / totalFrames;
    const cycle = progress * TAU;
    const pulseRate = state.id === "idle" ? 1.45 : state.id === "speaking" ? 3.6 : 2.35;
    const pulse = (Math.sin(cycle * pulseRate) + 1) * 0.5;
    const beat = Math.pow(pulse, state.id === "speaking" ? 1.35 : 2.25);

    drawBackground(cycle, beat);
    drawGlassLens(cycle, beat);
    drawMotes(cycle);
    drawOrbitArcs(cycle, beat);
    drawFilaments(cycle, beat);
    drawCoreGlow(cycle, beat);
    drawParticleBody(cycle, beat);
    drawStateResponse(cycle, beat);
    drawVignette(cycle);
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
