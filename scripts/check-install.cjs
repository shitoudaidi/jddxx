const childProcess = require("child_process");
const fs = require("fs");
const path = require("path");

function expectedElectronMajor(root) {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  const range = String(pkg.devDependencies?.electron || pkg.dependencies?.electron || "");
  const match = range.match(/(\d+)(?:\.\d+)?(?:\.\d+)?/);
  return match ? Number(match[1]) : null;
}

function runElectron(root, electronPath, args, extraEnv = {}) {
  const env = { ...process.env, ...extraEnv };
  if (!extraEnv.ELECTRON_RUN_AS_NODE) delete env.ELECTRON_RUN_AS_NODE;
  return childProcess.spawnSync(electronPath, args, {
    cwd: root,
    env,
    encoding: "utf8",
    windowsHide: true
  });
}

function checkInstall({ root = path.resolve(__dirname, "..") } = {}) {
  const issues = [];
  const electronPath = path.join(root, "node_modules", "electron", "dist", "electron.exe");
  const expectedMajor = expectedElectronMajor(root);

  if (!fs.existsSync(electronPath)) {
    issues.push(`Electron executable was not found: ${electronPath}`);
    return { ok: false, electronPath, issues };
  }

  const versionProbe = runElectron(root, electronPath, ["--version"]);
  const versionText = `${versionProbe.stdout || ""}${versionProbe.stderr || ""}`.trim();
  const actualMajor = Number((versionText.match(/v?(\d+)\./) || [])[1] || 0);
  if (versionProbe.status !== 0 || !actualMajor) {
    issues.push(`Electron version probe failed. Output: ${versionText || "(empty)"}`);
  } else if (expectedMajor && actualMajor !== expectedMajor) {
    issues.push(`Electron binary mismatch: expected major ${expectedMajor}, got ${versionText}. Delete node_modules/electron/dist and reinstall from the official Electron ${expectedMajor}.x release.`);
  }

  const nativeProbe = runElectron(
    root,
    electronPath,
    ["-e", "const Database=require('better-sqlite3'); const db=new Database(':memory:'); db.close();"],
    { ELECTRON_RUN_AS_NODE: "1" }
  );
  if (nativeProbe.status !== 0) {
    const output = `${nativeProbe.stderr || ""}${nativeProbe.stdout || ""}`.trim();
    issues.push(`better-sqlite3 is not usable under Electron. Run npm.cmd run rebuild:native after installing Visual Studio Build Tools 2022. Output: ${output.slice(0, 800)}`);
  }

  return { ok: issues.length === 0, electronPath, issues };
}

if (require.main === module) {
  const result = checkInstall();
  if (result.ok) {
    console.log(`[Jarvis] install check passed: ${result.electronPath}`);
    process.exit(0);
  }
  console.error("[Jarvis] install check failed:");
  for (const issue of result.issues) console.error(`- ${issue}`);
  process.exit(1);
}

module.exports = { checkInstall };
