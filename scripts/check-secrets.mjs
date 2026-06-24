import { readdirSync, readFileSync } from "node:fs";
import { extname, relative, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const ignoredDirectories = new Set([".git", "node_modules", "coverage", "tmp"]);
const binaryExtensions = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".pdf", ".zip"]);
const patterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\bgh[opusr]_[A-Za-z0-9_]{20,}\b/,
  /\bsk-or-v1-[A-Za-z0-9]{20,}\b/,
  /\bctx7sk-[A-Za-z0-9-]{20,}\b/,
  /\bsk-proj-[A-Za-z0-9_-]{20,}\b/
];

function listFiles(directory) {
  const files = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const absolute = resolve(directory, entry.name);
    if (entry.isDirectory()) files.push(...listFiles(absolute));
    else files.push(absolute);
  }
  return files;
}

const findings = [];
const files = listFiles(root);
for (const absolute of files) {
  if (binaryExtensions.has(extname(absolute).toLowerCase())) continue;
  const file = relative(root, absolute).replaceAll("\\", "/");
  const content = readFileSync(absolute, "utf8");
  for (const pattern of patterns) {
    if (pattern.test(content)) findings.push(`${file}: ${pattern}`);
  }
}

if (findings.length > 0) {
  console.error(findings.join("\n"));
  process.exit(1);
}

console.log(`secret-scan=pass files=${files.length}`);