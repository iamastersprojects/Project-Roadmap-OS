import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

function slug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "tool";
}

function stamp() {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "").replace("T", "-");
}

function yaml(value) {
  return JSON.stringify(String(value));
}

export function captureRepair({ target, component, signal, severity = "medium", learning = "" }) {
  const root = resolve(target);
  const date = new Date().toISOString().slice(0, 10);
  const id = `REPAIR-${stamp()}-${slug(component)}`;
  const repairDir = join(root, "roadmap", "items");
  mkdirSync(repairDir, { recursive: true });
  const repairPath = join(repairDir, `${id}.md`);
  writeFileSync(repairPath, `---
roadmap_type: work-item
created: ${date}
updated: ${date}
status: triage
kind: repair
priority: ${severity === "urgent" ? "urgent" : severity}
source: Roadmap OS CLI
project: ${yaml("Project Roadmap OS")}
agent_ready: false
component: ${yaml(component)}
severity: ${severity}
tags: [roadmap-os, repair-backlog]
---

# ${id}

## Failure Signal

${signal}

## Acceptance Criteria

- The failure can be reproduced with a bounded fixture.
- A safe repair route and human gates are documented.
- Verification evidence exists before closure.

## Evidence

- Captured by \`roadmap-os repair\`.
`, "utf8");

  let learningPath = "";
  if (learning) {
    const learningDir = join(root, "roadmap", "learnings");
    mkdirSync(learningDir, { recursive: true });
    learningPath = join(learningDir, `${date} ${slug(component)} operational learning.md`);
    writeFileSync(learningPath, `---
roadmap_type: learning
created: ${date}
updated: ${date}
status: captured
priority: medium
source: Roadmap OS CLI
learning_type: operational
risk: low
human_gate: true
tags: [learning-os, tooling]
---

# ${component} operational learning

## Signal

${signal}

## Recommendation

${learning}

## Verification

- Pending human review and a reproducible smoke.
`, "utf8");
  }

  return { repairPath, learningPath };
}
