import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";
import test from "node:test";

const repoRoot = resolve(import.meta.dirname, "..");
const cli = join(repoRoot, "src", "cli.mjs");

function tempWorkspace(name) {
  return mkdtempSync(join(tmpdir(), `roadmap-os-${name}-`));
}

function run(args, options = {}) {
  return execFileSync(process.execPath, [cli, ...args], {
    cwd: repoRoot,
    encoding: "utf8",
    ...options
  });
}

test("init creates the portable core and selected adapters", () => {
  const target = tempWorkspace("init");

  const output = run([
    "init",
    "--target", target,
    "--name", "Fixture Project",
    "--state", "new",
    "--ide", "codex,claude-code,opencode,generic"
  ]);

  assert.match(output, /initialized/i);
  for (const relative of [
    "AGENTS.md",
    "index.md",
    "log.md",
    "roadmap-os.config.json",
    "docs/knowledge/business.md",
    "docs/knowledge/product.md",
    "docs/knowledge/tech.md",
    "docs/knowledge/open-questions.md",
    "roadmap/items/.gitkeep",
    "roadmap/learnings/.gitkeep",
    "CLAUDE.md",
    ".codex/README.md",
    ".opencode/commands/roadmap-start.md",
    ".agents/ROADMAP-OS.md"
  ]) {
    assert.equal(existsSync(join(target, relative)), true, `missing ${relative}`);
  }

  assert.match(readFileSync(join(target, "AGENTS.md"), "utf8"), /Fixture Project/);
  assert.match(readFileSync(join(target, "docs/knowledge/open-questions.md"), "utf8"), /blocking/);
});

test("upgrade preserves existing human context and creates missing files", () => {
  const target = tempWorkspace("upgrade");
  run(["init", "--target", target, "--name", "Preserve Project", "--ide", "codex"]);

  const business = join(target, "docs", "knowledge", "business.md");
  writeFileSync(business, `${readFileSync(business, "utf8")}\nSENTINEL_KEEP\n`);
  const product = join(target, "docs", "knowledge", "product.md");
  writeFileSync(product, "");

  const output = run(["upgrade", "--target", target, "--ide", "codex"]);

  assert.match(output, /preserved/i);
  assert.match(readFileSync(business, "utf8"), /SENTINEL_KEEP/);
  assert.equal(readFileSync(product, "utf8"), "");
});

test("doctor reports a healthy initialized workspace and JSON output", () => {
  const target = tempWorkspace("doctor");
  run(["init", "--target", target, "--name", "Doctor Project"]);

  const result = JSON.parse(run(["doctor", "--target", target, "--json"]));

  assert.equal(result.ok, true);
  assert.equal(result.checks.requiredFiles.ok, true);
  assert.equal(result.checks.config.ok, true);
});

test("doctor fails for a directory without Roadmap OS", () => {
  const target = tempWorkspace("doctor-missing");
  const result = spawnSync(process.execPath, [cli, "doctor", "--target", target, "--json"], {
    cwd: repoRoot,
    encoding: "utf8"
  });

  assert.notEqual(result.status, 0);
  const report = JSON.parse(result.stdout);
  assert.equal(report.ok, false);
  assert.equal(report.checks.requiredFiles.ok, false);
});

test("repair captures breakage and optional reusable learning", () => {
  const target = tempWorkspace("repair");
  run(["init", "--target", target, "--name", "Repair Project"]);

  const output = run([
    "repair",
    "--target", target,
    "--component", "windows-sandbox",
    "--signal", "apply_patch could not enforce writable roots",
    "--severity", "high",
    "--learning", "Use the smallest reproducible fixture before changing sandbox configuration"
  ]);

  const parsed = JSON.parse(output);
  assert.equal(existsSync(parsed.repairPath), true);
  assert.equal(existsSync(parsed.learningPath), true);
  assert.match(readFileSync(parsed.repairPath, "utf8"), /windows-sandbox/);
  assert.match(readFileSync(parsed.learningPath, "utf8"), /smallest reproducible fixture/);
});

test("drift reports changed code whose owned docs did not change", () => {
  const target = tempWorkspace("drift-missing");
  run(["init", "--target", target, "--name", "Drift Project"]);
  writeFileSync(join(target, "roadmap-os.config.json"), JSON.stringify({
    version: 1,
    ownership: [{ code: ["src/**"], docs: ["docs/architecture.md"] }]
  }, null, 2));

  const report = JSON.parse(run([
    "drift",
    "--target", target,
    "--changed", "src/cli.mjs",
    "--json"
  ]));

  assert.equal(report.ok, false);
  assert.deepEqual(report.findings[0].missingDocs, ["docs/architecture.md"]);
});

test("drift passes when owned documentation changes with code", () => {
  const target = tempWorkspace("drift-aligned");
  run(["init", "--target", target, "--name", "Drift Project"]);
  writeFileSync(join(target, "roadmap-os.config.json"), JSON.stringify({
    version: 1,
    ownership: [{ code: ["src/**"], docs: ["docs/architecture.md"] }]
  }, null, 2));

  const report = JSON.parse(run([
    "drift",
    "--target", target,
    "--changed", "src/cli.mjs,docs/architecture.md",
    "--json"
  ]));

  assert.equal(report.ok, true);
  assert.deepEqual(report.findings, []);
});
