# Check Node.js Installation Script
Write-Host "Checking Node.js installation..." -ForegroundColor Green

# Check common Node.js installation paths
$nodePaths = @(
    "C:\Program Files\nodejs\node.exe",
    "C:\Program Files (x86)\nodejs\node.exe",
    "$env:LOCALAPPDATA\Programs\nodejs\node.exe",
    "$env:APPDATA\npm\node.exe"
)

$found = $false
foreach ($path in $nodePaths) {
    if (Test-Path $path) {
        Write-Host "Node.js found at: $path" -ForegroundColor Green
        $found = $true
        break
    }
}

if (-not $found) {
    Write-Host "Node.js not found in common locations." -ForegroundColor Yellow
    Write-Host "Trying to find Node.js in winget packages..." -ForegroundColor Yellow
    
    # Check winget packages
    $wingetPath = "$env:LOCALAPPDATA\Microsoft\WinGet\Packages"
    if (Test-Path $wingetPath) {
        $nodePackages = Get-ChildItem $wingetPath -Filter "*NodeJS*" -Directory
        foreach ($package in $nodePackages) {
            Write-Host "Found package: $($package.Name)" -ForegroundColor Cyan
            $nodeExe = Get-ChildItem $package.FullName -Recurse -Filter "node.exe" -ErrorAction SilentlyContinue
            if ($nodeExe) {
                Write-Host "Node.js executable found at: $($nodeExe.FullName)" -ForegroundColor Green
                $found = $true
                break
            }
        }
    }
}

if (-not $found) {
    Write-Host "Node.js installation not found." -ForegroundColor Red
    Write-Host "Please try the following:" -ForegroundColor Yellow
    Write-Host "1. Restart your computer" -ForegroundColor Yellow
    Write-Host "2. Or manually download Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "3. Or try running: winget install OpenJS.NodeJS --accept-source-agreements" -ForegroundColor Yellow
} else {
    Write-Host "Node.js is installed but may not be in PATH." -ForegroundColor Yellow
    Write-Host "Try restarting your terminal or computer." -ForegroundColor Yellow
}

Write-Host "`nCurrent PATH environment variable:" -ForegroundColor Cyan
$env:PATH -split ';' | Where-Object { $_ -like "*node*" } | ForEach-Object { Write-Host "  $_" -ForegroundColor Gray } 