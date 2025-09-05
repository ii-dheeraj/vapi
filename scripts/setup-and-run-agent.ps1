param(
  [switch]$Reinstall
)

$ErrorActionPreference = "Stop"

# Move to repo root regardless of where the script is called from
$RepoRoot = (Resolve-Path "$PSScriptRoot\..\").Path
Set-Location $RepoRoot

Write-Host "Repo root: $RepoRoot"

# Ensure Python is available
$python = ""
try {
  $python = (Get-Command py -ErrorAction Stop).Source
} catch {}
if (-not $python) {
  try { $python = (Get-Command python -ErrorAction Stop).Source } catch {}
}
if (-not $python) {
  throw "Python not found. Install Python 3.x and ensure it's in PATH."
}

# Create venv if missing
$venvPath = Join-Path $RepoRoot ".venv"
if (Test-Path $venvPath -and $Reinstall) {
  Write-Host "Removing existing venv due to -Reinstall..."
  Remove-Item -Recurse -Force $venvPath
}
if (-not (Test-Path $venvPath)) {
  Write-Host "Creating virtual environment..."
  & $python -m venv $venvPath
}

# Activate venv
$activate = Join-Path $venvPath "Scripts\Activate.ps1"
. $activate

# Upgrade pip and install requirements
python -m pip install --upgrade pip
python -m pip install -r "agent/requirements.txt"

# Basic env checks
$envFile = Join-Path $RepoRoot "agent/.env"
if (-not (Test-Path $envFile)) {
  Write-Warning "agent/.env not found. Create it before running the agent."
} else {
  Write-Host "Using env file: $envFile"
}

# Run the agent
Write-Host "Starting Interview Avatar agent..."
python "agent/interview_avatar.py"
