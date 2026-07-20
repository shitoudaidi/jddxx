const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(root, "src", "ui", "jarvis-react", "src", "main.jsx"), "utf8");

const checks = [
  ["first-run setup component exists", /function FirstRunSetup\(/.test(source)],
  ["inactive activation gates the workbench", /activation !== null && !activation\?\.activated/.test(source)],
  ["setup requires an API key", /请输入 DeepSeek API Key/.test(source)],
  ["setup requires a model", /请输入模型名称/.test(source)],
  ["setup offers local voice", /value="local"/.test(source) && /语音在电脑上处理/.test(source)],
  ["setup offers Aliyun voice", /value="aliyun"/.test(source) && /DashScope API Key/.test(source)],
  ["setup activates the model", /fetch\(`\$\{api\}\/activate`/.test(source)],
  ["setup persists voice settings", /fetch\(`\$\{api\}\/settings\/voice`/.test(source)],
];

for (const [name, ok] of checks) {
  console.log(`${ok ? "PASS" : "FAIL"}: ${name}`);
}

if (checks.some(([, ok]) => !ok)) process.exit(1);
