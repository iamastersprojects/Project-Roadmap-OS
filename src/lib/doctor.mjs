import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const required = [
  "AGENTS.md",
  "index.md",
  "log.md",
  "roadmap-os.config.json",
  "docs/knowledge/business.md",
  "docs/knowledge/product.md",
  "docs/knowledge/tech.md",
  "docs/knowledge/open-questions.md",
  "roadmap/items",
  "roadmap/learnings"
];

export function inspectWorkspace(target) {
  const root = resolve(target);
  const missing = required.filter((relative) => !existsSync(join(root, relative)));
  let configOk = false;
  let configDetail = "";
  try {
    const config = JSON.parse(readFileSync(join(root, "roadmap-os.config.json"), "utf8"));
    configOk = config.version === 1 && Array.isArray(config.ownership);
    if (!configOk) configDetail = "version 1 and ownership array required";
  } catch (error) {
    configDetail = error.code === "ENOENT" ? "config missing" : error.message;
  }

  const checks = {
    node: { ok: Number(process.versions.node.split(".")[0]) >= 20, detail: process.versions.node },
    requiredFiles: { ok: missing.length === 0, detail: missing.join(", ") },
    config: { ok: configOk, detail: configDetail }
  };

  return {
    ok: Object.values(checks).every((check) => check.ok),
    target: root,
    checks
  };
}
