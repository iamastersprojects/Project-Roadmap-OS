#!/usr/bin/env node

import { resolve } from "node:path";
import { initializeWorkspace } from "./lib/workspace.mjs";
import { inspectWorkspace } from "./lib/doctor.mjs";
import { captureRepair } from "./lib/repair.mjs";
import { inspectDrift } from "./lib/drift.mjs";

function parseArgs(argv) {
  const [command = "help", ...tokens] = argv;
  const options = {};
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = tokens[index + 1];
    if (!next || next.startsWith("--")) {
      options[key] = true;
    } else {
      options[key] = next;
      index += 1;
    }
  }
  return { command, options };
}

function targetOf(options) {
  return resolve(String(options.target || process.cwd()));
}

function printHelp() {
  console.log(`Project Roadmap OS

Usage:
  roadmap-os init --target <dir> [--name <name>] [--state new|pre-ai|legacy] [--ide codex,claude-code,opencode,generic]
  roadmap-os upgrade --target <dir> [--ide ...]
  roadmap-os doctor --target <dir> [--json]
  roadmap-os repair --target <dir> --component <name> --signal <text> [--severity low|medium|high|urgent] [--learning <lesson>]
  roadmap-os drift --target <dir> [--changed file1,file2] [--base <git-ref>] [--json] [--strict]
`);
}

async function main() {
  const { command, options } = parseArgs(process.argv.slice(2));

  if (command === "help" || options.help) {
    printHelp();
    return;
  }

  if (command === "init" || command === "upgrade") {
    const result = initializeWorkspace({
      target: targetOf(options),
      name: String(options.name || "Project Roadmap OS Workspace"),
      state: String(options.state || "pre-ai"),
      language: String(options.language || "es"),
      adapters: String(options.ide || "generic").split(",").map((value) => value.trim()).filter(Boolean)
    });
    console.log(`${command === "init" ? "Initialized" : "Upgraded"} Project Roadmap OS at ${result.target}.`);
    console.log(`Created: ${result.created.length}; preserved: ${result.preserved.length}.`);
    return;
  }

  if (command === "doctor") {
    const report = inspectWorkspace(targetOf(options));
    if (options.json) {
      console.log(JSON.stringify(report));
    } else {
      console.log(report.ok ? "Roadmap OS doctor: healthy." : "Roadmap OS doctor: attention required.");
      for (const [name, check] of Object.entries(report.checks)) {
        console.log(`- ${name}: ${check.ok ? "ok" : "fail"}${check.detail ? ` (${check.detail})` : ""}`);
      }
    }
    if (!report.ok) process.exitCode = 1;
    return;
  }

  if (command === "repair") {
    if (!options.component || !options.signal) {
      throw new Error("repair requires --component and --signal");
    }
    const result = captureRepair({
      target: targetOf(options),
      component: String(options.component),
      signal: String(options.signal),
      severity: String(options.severity || "medium"),
      learning: options.learning ? String(options.learning) : ""
    });
    console.log(JSON.stringify(result));
    return;
  }

  if (command === "drift") {
    const report = inspectDrift({
      target: targetOf(options),
      changed: options.changed ? String(options.changed).split(",").map((value) => value.trim()).filter(Boolean) : null,
      base: String(options.base || "HEAD")
    });
    if (options.json) {
      console.log(JSON.stringify(report));
    } else if (report.ok) {
      console.log("Documentation drift: no findings.");
    } else {
      console.log(`Documentation drift: ${report.findings.length} finding(s).`);
      for (const finding of report.findings) {
        console.log(`- ${finding.changedCode.join(", ")} -> missing ${finding.missingDocs.join(", ")}`);
      }
    }
    if (options.strict && !report.ok) process.exitCode = 1;
    return;
  }

  throw new Error(`Unknown command: ${command}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
