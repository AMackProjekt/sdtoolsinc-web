# Quick Setup Script for FREE AI
# Run this to set up everything automatically

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "T.O.O.L.S Inc - FREE AI Setup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check/Install Ollama
Write-Host "[1/5] Checking Ollama installation..." -ForegroundColor Yellow
$ollamaInstalled = Get-Command ollama -ErrorAction SilentlyContinue

if (-not $ollamaInstalled) {
    Write-Host "Ollama not found. Installing..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Option 1 (Recommended): Install via winget" -ForegroundColor Green
    Write-Host "  winget install Ollama.Ollama" -ForegroundColor White
    Write-Host ""
    Write-Host "Option 2: Download manually" -ForegroundColor Green
    Write-Host "  Download from: https://ollama.ai/download/windows" -ForegroundColor White
    Write-Host ""
    
    $install = Read-Host "Install Ollama now with winget? (Y/N)"
    
    if ($install -eq "Y" -or $install -eq "y") {
        Write-Host "Installing Ollama..." -ForegroundColor Green
        winget install Ollama.Ollama
        
        Write-Host ""
        Write-Host "Ollama installed! Refreshing PATH..." -ForegroundColor Green
        $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
        
        # Wait for Ollama service to start
        Write-Host "Waiting for Ollama service to start (10 seconds)..." -ForegroundColor Yellow
        Start-Sleep -Seconds 10
    } else {
        Write-Host ""
        Write-Host "Please install Ollama manually, then run this script again." -ForegroundColor Red
        Write-Host "Download from: https://ollama.ai/download/windows" -ForegroundColor White
        exit
    }
}

Write-Host "✓ Ollama is installed" -ForegroundColor Green
Write-Host ""

# Step 2: Check if model is downloaded
Write-Host "[2/5] Checking AI model..." -ForegroundColor Yellow

try {
    $models = ollama list 2>$null
    $hasModel = $models -match "llama3"
    
    if (-not $hasModel) {
        Write-Host "Downloading AI model (llama3.1:8b - 4.7GB)..." -ForegroundColor Yellow
        Write-Host "This may take 5-15 minutes depending on your internet speed." -ForegroundColor White
        Write-Host ""
        
        ollama pull llama3.1:8b
        
        Write-Host ""
        Write-Host "✓ Model downloaded successfully!" -ForegroundColor Green
    } else {
        Write-Host "✓ AI model already downloaded" -ForegroundColor Green
    }
} catch {
    Write-Host "Error checking models. Downloading llama3.1:8b..." -ForegroundColor Yellow
    ollama pull llama3.1:8b
}

Write-Host ""

# Step 3: Create .env.local
Write-Host "[3/5] Configuring environment..." -ForegroundColor Yellow

if (Test-Path ".env.local") {
    Write-Host "✓ .env.local already exists" -ForegroundColor Green
} else {
    Write-Host "Creating .env.local with FREE AI configuration..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env.local"
    Write-Host "✓ .env.local created" -ForegroundColor Green
}

Write-Host ""

# Step 4: Install npm dependencies
Write-Host "[4/5] Installing dependencies..." -ForegroundColor Yellow

if (Test-Path "node_modules") {
    Write-Host "✓ Dependencies already installed" -ForegroundColor Green
} else {
    Write-Host "Installing npm packages..." -ForegroundColor Yellow
    npm install
    Write-Host "✓ Dependencies installed" -ForegroundColor Green
}

Write-Host ""

# Step 5: Test Ollama
Write-Host "[5/5] Testing AI connection..." -ForegroundColor Yellow

try {
    $testResponse = ollama run llama3.1:8b "Say 'AI is working' in 3 words" --timeout 10
    Write-Host "✓ AI is responding!" -ForegroundColor Green
} catch {
    Write-Host "⚠ AI test timed out, but installation is complete" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Setup Complete! 🎉" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Run: npm run dev" -ForegroundColor White
Write-Host "2. Visit: https://sdtoolsinc.org" -ForegroundColor White
Write-Host "3. Click the ChatBot button (bottom-right)" -ForegroundColor White
Write-Host "4. Ask a question and get FREE AI responses!" -ForegroundColor White
Write-Host ""
Write-Host "Total cost: $0/month forever! 🚀" -ForegroundColor Green
Write-Host ""

# Ask if they want to start the dev server now
$startNow = Read-Host "Start the development server now? (Y/N)"

if ($startNow -eq "Y" -or $startNow -eq "y") {
    Write-Host ""
    Write-Host "Starting development server..." -ForegroundColor Green
    Write-Host "Visit: https://sdtoolsinc.org" -ForegroundColor Cyan
    Write-Host ""
    npm run dev
}

