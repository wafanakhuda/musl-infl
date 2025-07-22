#!/usr/bin/env pwsh
# Environment Switcher for Windows PowerShell

param(
    [Parameter(Mandatory = $true)]
    [ValidateSet("dev", "development", "prod", "production", "staging")]
    [string]$Environment
)

# Normalize environment names
switch ($Environment.ToLower()) {
    { $_ -in "dev", "development" } { $env = "development" }
    { $_ -in "prod", "production" } { $env = "production" }
    "staging" { $env = "staging" }
}

$sourceFile = ".env.$env"
$targetFile = ".env.local"

# Check if source environment file exists
if (-not (Test-Path $sourceFile)) {
    Write-Host "❌ Environment file '$sourceFile' not found!" -ForegroundColor Red
    Write-Host "Available environment files:" -ForegroundColor Yellow
    Get-ChildItem ".env.*" | ForEach-Object { Write-Host "  - $($_.Name)" -ForegroundColor Cyan }
    exit 1
}

# Backup current .env.local if it exists
if (Test-Path $targetFile) {
    $backup = ".env.local.backup.$(Get-Date -Format 'yyyyMMdd-HHmmss')"
    Copy-Item $targetFile $backup
    Write-Host "📋 Backed up current .env.local to $backup" -ForegroundColor Yellow
}

# Copy the environment file
Copy-Item $sourceFile $targetFile -Force

# Confirmation
Write-Host "✅ Successfully switched to $env environment!" -ForegroundColor Green
Write-Host "📁 Copied $sourceFile → $targetFile" -ForegroundColor Cyan

# Show current environment variables
Write-Host "`n🔧 Current environment configuration:" -ForegroundColor Magenta
$content = Get-Content $targetFile
$content | Where-Object { $_ -match "^NEXT_PUBLIC_" -or $_ -match "^NODE_ENV" } | ForEach-Object {
    Write-Host "  $($_)" -ForegroundColor Gray
}
