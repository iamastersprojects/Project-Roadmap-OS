import { execFileSync } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";

const root = resolve(import.meta.dirname, "..");
const cli = join(root, "src", "cli.mjs");
const target = mkdtempSync(join(tmpdir(), "project-roadmap-os-smoke-"));

function run(args) {
  return execFileSync(process.execPath, [cli, ...args], {
    cwd: root,
    encoding: "utf8"
  });
}

run(["init", "--target", target, "--name", "Smoke OS", "--state", "new", "--ide", "codex,claude-code,opencode,generic"]);
run(["doctor", "--target", target]);
run(["repair", "--target", target, "--component", "smoke-fixture", "--signal", "Synthetic repair capture"]);
run(["drift", "--target", target, "--changed", "src/example.mjs,docs/architecture.md"]);

console.log(`roadmap-os-smoke=pass target=${target}`);
