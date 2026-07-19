const childProcess = require("child_process");
const fs = require("fs");
const https = require("https");
const path = require("path");
const { checkInstall } = require("./check-install.cjs");

const root = path.resolve(__dirname, "..");
const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const range = String(pkg.devDependencies?.electron || pkg.dependencies?.electron || "");
const version = (range.match(/(\d+\.\d+\.\d+)/) || [])[1];

if (!version) {
  console.error("[Jarvis] Cannot determine Electron version from package.json.");
  process.exit(1);
}

const distDir = path.join(root, "node_modules", "electron", "dist");
const tempDir = path.join(root, ".cache", "electron-repair");
const zipFile = path.join(tempDir, `electron-v${version}-win32-x64.zip`);
const releasePath = `electron/electron/releases/download/v${version}/electron-v${version}-win32-x64.zip`;
const urls = [
  `https://github.com/${releasePath}`,
  `https://ghfast.top/https://github.com/${releasePath}`,
  `https://npmmirror.com/mirrors/electron/v${version}/electron-v${version}-win32-x64.zip`
];

function download(source, target) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(target), { recursive: true });
    const file = fs.createWriteStream(target);
    function request(currentUrl, redirectCount = 0) {
      https.get(currentUrl, (response) => {
        if ([301, 302, 303, 307, 308].includes(response.statusCode) && response.headers.location) {
          if (redirectCount > 5) {
            reject(new Error("Too many redirects while downloading Electron."));
            return;
          }
          response.resume();
          request(new URL(response.headers.location, currentUrl).href, redirectCount + 1);
          return;
        }
        if (response.statusCode !== 200) {
          reject(new Error(`Download failed with HTTP ${response.statusCode}: ${currentUrl}`));
          response.resume();
          return;
        }
        response.pipe(file);
        file.on("finish", () => file.close(resolve));
      }).on("error", reject);
    }
    request(source);
  });
}

function run(command, args) {
  const result = childProcess.spawnSync(command, args, {
    cwd: root,
    stdio: "inherit",
    windowsHide: true
  });
  if (result.status !== 0) process.exit(result.status || 1);
}

(async () => {
  let lastError = null;
  let repaired = false;
  for (const url of urls) {
    try {
      console.log(`[Jarvis] Downloading Electron ${version}: ${url}`);
      fs.rmSync(zipFile, { force: true });
      await download(url, zipFile);
      fs.rmSync(distDir, { recursive: true, force: true });
      fs.mkdirSync(distDir, { recursive: true });
      run("powershell.exe", [
        "-NoProfile",
        "-ExecutionPolicy",
        "Bypass",
        "-Command",
        "& { param($zip, $dest) Expand-Archive -LiteralPath $zip -DestinationPath $dest -Force }",
        zipFile,
        distDir
      ]);

      const result = checkInstall({ root });
      if (result.ok) {
        repaired = true;
        break;
      }
      lastError = new Error(result.issues.join("; "));
      console.error("[Jarvis] Downloaded binary did not pass validation:");
      for (const issue of result.issues) console.error(`- ${issue}`);
    } catch (error) {
      lastError = error;
      console.error(`[Jarvis] Download source failed: ${error.message || String(error)}`);
    }
  }
  if (!repaired) throw lastError || new Error("No Electron download source passed validation.");
  console.log("[Jarvis] Electron repair completed.");
})().catch((error) => {
  console.error(`[Jarvis] Electron repair failed: ${error.message || String(error)}`);
  process.exit(1);
});
