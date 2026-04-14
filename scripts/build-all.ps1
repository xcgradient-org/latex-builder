param(
    [switch]$Clean
)

Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$repoRoot = (Resolve-Path (Join-Path $scriptDir "../..")).Path

if (-not (Get-Command latexmk -ErrorAction SilentlyContinue)) {
    Write-Error "latexmk is not installed or not on PATH. Install TeX Live (latexmk + biber) first."
}

$targets = [System.Collections.Generic.List[string]]::new()

$projectsRoot = Join-Path $repoRoot "latex-builder/projects"
Get-ChildItem -Path $projectsRoot -Directory |
    ForEach-Object {
        $candidate = Join-Path $_.FullName ("{0}.tex" -f $_.Name)
        if (Test-Path $candidate) {
            $targets.Add($candidate)
        }

        Get-ChildItem -Path $_.FullName -Directory |
            ForEach-Object {
                $nestedCandidate = Join-Path $_.FullName ("{0}.tex" -f $_.Name)
                if (Test-Path $nestedCandidate) {
                    $targets.Add($nestedCandidate)
                }
            }
    }

$propostaDir = Join-Path $repoRoot "latex_DOCS/proposta"
if (Test-Path $propostaDir) {
    Get-ChildItem -Path $propostaDir -File -Filter "*.tex" -Recurse |
        Sort-Object FullName |
        ForEach-Object { $targets.Add($_.FullName) }
}

if ($targets.Count -eq 0) {
    throw "No LaTeX root documents were found."
}

$failed = [System.Collections.Generic.List[string]]::new()
foreach ($target in $targets) {
    if ($target.StartsWith($repoRoot, [System.StringComparison]::OrdinalIgnoreCase)) {
        $relative = $target.Substring($repoRoot.Length).TrimStart('\', '/')
    }
    else {
        $relative = $target
    }
    $dir = Split-Path -Parent $target
    $leaf = Split-Path -Leaf $target

    if ($Clean) {
        Write-Host "==> Cleaning $relative"
        Push-Location $dir
        try {
            & latexmk -C $leaf
            if ($LASTEXITCODE -ne 0) {
                $failed.Add($relative)
                Write-Host "FAIL $relative"
            } else {
                Write-Host "OK   $relative"
            }
        }
        finally {
            Pop-Location
        }
    }
    else {
        Write-Host "==> Building $relative"
        Push-Location $dir
        try {
            & latexmk -pdf -interaction=nonstopmode -halt-on-error $leaf
            if ($LASTEXITCODE -ne 0) {
                $failed.Add($relative)
                Write-Host "FAIL $relative"
            } else {
                Write-Host "OK   $relative"
            }
        }
        finally {
            Pop-Location
        }
    }
}

if ($failed.Count -gt 0) {
    Write-Host ""
    Write-Host "The following documents failed:"
    $failed | ForEach-Object { Write-Host "  - $_" }
    exit 1
}

if ($Clean) {
    Write-Host "All LaTeX artifacts cleaned."
}
else {
    Write-Host "All LaTeX documents built successfully."
}
