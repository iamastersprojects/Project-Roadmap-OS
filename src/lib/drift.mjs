import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";

function normalize(value) {
  return value.replaceAll("\\", "/").replace(/^\.\//, "");
}

function globRegex(pattern) {
  const source = normalize(pattern)
    .replace(/[.+^${}()|[\]\\]/g, "\\$&")
    .replaceAll("**", "\u0000")
    .replaceAll("*", "[^/]*")
    .replaceAll("\u0000", ".*");
  return new RegExp(`^${source}$`);
}

function matches(path, patterns) {
  return patterns.some((pattern) => globRegex(pattern).test(normalize(path)));
}

function changedFromGit(target, base) {
  const output = execFileSync("git", ["-C", target, "diff", "--name-only", base], {
    encoding: "utf8"
  });
  return output.split(/\r?\n/).map((value) => value.trim()).filter(Boolean);
}

export function inspectDrift({ target, changed = null, base = "HEAD" }) {
  const root = resolve(target);
  const config = JSON.parse(readFileSync(join(root, "roadmap-os.config.json"), "utf8"));
  const changedFiles = (changed || changedFromGit(root, base)).map(normalize);
  const findings = [];

  for (const rule of config.ownership || []) {
    const codePatterns = Array.isArray(rule.code) ? rule.code : [rule.code];
    const docs = Array.isArray(rule.docs) ? rule.docs : [rule.docs];
    const changedCode = changedFiles.filter((file) => matches(file, codePatterns));
    if (changedCode.length === 0) continue;
    const missingDocs = docs.filter((doc) => !changedFiles.some((file) => matches(file, [doc])));
    if (missingDocs.length > 0) {
      findings.push({ changedCode, missingDocs });
    }
  }

  return { ok: findings.length === 0, target: root, changedFiles, findings };
}
