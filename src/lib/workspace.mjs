import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const validStates = new Set(["new", "pre-ai", "legacy"]);
const adapterRoots = {
  codex: "codex",
  "claude-code": "claude-code",
  opencode: "opencode",
  generic: "generic",
  antigravity: "antigravity"
};

function render(content, values) {
  return Object.entries(values).reduce(
    (result, [key, value]) => result.replaceAll(`{{${key}}}`, String(value)),
    content
  );
}

function copyMissing(sourceRoot, targetRoot, values, result, relative = "") {
  const sourcePath = join(sourceRoot, relative);
  for (const entry of readdirSync(sourcePath, { withFileTypes: true })) {
    const childRelative = join(relative, entry.name);
    if (entry.isDirectory()) {
      copyMissing(sourceRoot, targetRoot, values, result, childRelative);
      continue;
    }

    const destination = join(targetRoot, childRelative);
    if (existsSync(destination)) {
      result.preserved.push(destination);
      continue;
    }

    mkdirSync(dirname(destination), { recursive: true });
    const content = render(readFileSync(join(sourceRoot, childRelative), "utf8"), values);
    writeFileSync(destination, content, "utf8");
    result.created.push(destination);
  }
}

export function initializeWorkspace({
  target,
  name,
  state = "pre-ai",
  language = "es",
  adapters = ["generic"]
}) {
  if (!validStates.has(state)) {
    throw new Error(`Invalid project state: ${state}`);
  }

  const resolvedTarget = resolve(target);
  mkdirSync(resolvedTarget, { recursive: true });
  const result = { target: resolvedTarget, created: [], preserved: [] };
  const values = {
    PROJECT_NAME: name,
    PROJECT_STATE: state,
    PROJECT_LANGUAGE: language,
    DATE: new Date().toISOString().slice(0, 10)
  };

  copyMissing(join(packageRoot, "core", "starter"), resolvedTarget, values, result);

  for (const adapter of adapters) {
    const adapterRoot = adapterRoots[adapter];
    if (!adapterRoot) throw new Error(`Unknown IDE adapter: ${adapter}`);
    copyMissing(join(packageRoot, "adapters", adapterRoot), resolvedTarget, values, result);
  }

  return result;
}
