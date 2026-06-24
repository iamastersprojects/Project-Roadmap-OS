param(
  [Parameter(Mandatory = $true)][string]$Target,
  [string]$Name = "Project Roadmap OS Workspace",
  [ValidateSet("new", "pre-ai", "legacy")][string]$State = "new",
  [string]$Ide = "codex,generic",
  [string]$Language = "es"
)

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
$cli = Join-Path $repoRoot "src\cli.mjs"

if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
  throw "Node.js 20+ is required."
}

& node $cli init --target $Target --name $Name --state $State --language $Language --ide $Ide
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

& node $cli doctor --target $Target
exit $LASTEXITCODE
