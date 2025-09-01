# LearnForge PowerShell Launcher
# Usage: .\run_app.ps1

param(
    [switch]$SkipDependencyCheck,
    [switch]$Quiet
)

# Colors for output
$Colors = @{
    Red = "Red"
    Green = "Green"
    Yellow = "Yellow"
    Blue = "Blue"
    Cyan = "Cyan"
    Magenta = "Magenta"
    White = "White"
}

function Write-Banner {
    Write-Host ""
    Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Magenta
    Write-Host "║                          🔥 LearnForge                       ║" -ForegroundColor Magenta
    Write-Host "║                   AI-Powered Learning Platform               ║" -ForegroundColor Magenta
    Write-Host "║                                                              ║" -ForegroundColor Magenta
    Write-Host "║  Starting your intelligent learning companion...            ║" -ForegroundColor Magenta
    Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Magenta
    Write-Host ""
}

function Test-Dependencies {
    Write-Host "🔍 Checking dependencies..." -ForegroundColor Cyan
    
    # Check Node.js
    try {
        $nodeVersion = node --version 2>$null
        if ($nodeVersion) {
            Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
        } else {
            throw "Node.js not found"
        }
    } catch {
        Write-Host "❌ Node.js is not installed or not in PATH" -ForegroundColor Red
        Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
        return $false
    }
    
    # Check npm
    try {
        $npmVersion = npm --version 2>$null
        if ($npmVersion) {
            Write-Host "✅ npm: $npmVersion" -ForegroundColor Green
        } else {
            throw "npm not found"
        }
    } catch {
        Write-Host "❌ npm is not installed or not in PATH" -ForegroundColor Red
        return $false
    }
    
    return $true
}

function Initialize-Environment {
    # Check and create .env file
    if (-not (Test-Path ".env")) {
        if (Test-Path ".env.example") {
            Write-Host "⚠️  .env file not found. Creating from .env.example..." -ForegroundColor Yellow
            Copy-Item ".env.example" ".env"
            Write-Host "✅ Created .env file" -ForegroundColor Green
        } else {
            Write-Host "❌ .env.example not found. Please create .env manually" -ForegroundColor Red
            return $false
        }
    } else {
        Write-Host "✅ Environment file found" -ForegroundColor Green
    }
    return $true
}

function Install-Dependencies {
    Write-Host "📦 Checking and installing dependencies..." -ForegroundColor Cyan
    
    # Install server dependencies
    if (-not (Test-Path "server\node_modules")) {
        Write-Host "Installing server dependencies..." -ForegroundColor Yellow
        Push-Location "server"
        try {
            npm install
            Write-Host "✅ Server dependencies installed" -ForegroundColor Green
        } catch {
            Write-Host "❌ Failed to install server dependencies" -ForegroundColor Red
            Pop-Location
            return $false
        }
        Pop-Location
    } else {
        Write-Host "✅ Server dependencies already installed" -ForegroundColor Green
    }
    
    # Install client dependencies
    if (-not (Test-Path "client\node_modules")) {
        Write-Host "Installing client dependencies..." -ForegroundColor Yellow
        Push-Location "client"
        try {
            npm install
            Write-Host "✅ Client dependencies installed" -ForegroundColor Green
        } catch {
            Write-Host "❌ Failed to install client dependencies" -ForegroundColor Red
            Pop-Location
            return $false
        }
        Pop-Location
    } else {
        Write-Host "✅ Client dependencies already installed" -ForegroundColor Green
    }
    
    return $true
}

function Start-LearnForgeServers {
    Write-Host "🚀 Starting LearnForge servers..." -ForegroundColor Cyan
    
    # Start backend server
    Write-Host "Starting backend server..." -ForegroundColor Blue
    $serverJob = Start-Job -ScriptBlock {
        Set-Location $using:PWD
        Set-Location "server"
        npm start
    }
    
    # Wait a moment for server to start
    Start-Sleep -Seconds 3
    
    # Start frontend client
    Write-Host "Starting frontend client..." -ForegroundColor Blue
    $clientJob = Start-Job -ScriptBlock {
        Set-Location $using:PWD
        Set-Location "client"
        npm run dev
    }
    
    # Wait for servers to start
    Start-Sleep -Seconds 5
    
    Write-Host ""
    Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Green
    Write-Host "║                    🎉 LearnForge is Ready!                   ║" -ForegroundColor Green
    Write-Host "║                                                              ║" -ForegroundColor Green
    Write-Host "║  Frontend: http://localhost:5173                             ║" -ForegroundColor Green
    Write-Host "║  Backend:  http://localhost:5000                             ║" -ForegroundColor Green
    Write-Host "║                                                              ║" -ForegroundColor Green
    Write-Host "║  Press Ctrl+C to stop all servers                           ║" -ForegroundColor Green
    Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Green
    Write-Host ""
    
    # Monitor jobs
    try {
        Write-Host "Monitoring servers... Press Ctrl+C to stop" -ForegroundColor Cyan
        while ($true) {
            Start-Sleep -Seconds 1
            
            # Check if jobs are still running
            if ($serverJob.State -eq "Failed" -or $clientJob.State -eq "Failed") {
                Write-Host "⚠️  One of the servers has stopped unexpectedly" -ForegroundColor Yellow
                break
            }
        }
    } catch {
        Write-Host "Stopping servers..." -ForegroundColor Yellow
    } finally {
        # Clean up jobs
        Stop-Job $serverJob, $clientJob -ErrorAction SilentlyContinue
        Remove-Job $serverJob, $clientJob -ErrorAction SilentlyContinue
        Write-Host "✅ Servers stopped" -ForegroundColor Green
    }
}

# Main execution
try {
    Write-Banner
    
    if (-not $SkipDependencyCheck) {
        if (-not (Test-Dependencies)) {
            exit 1
        }
    }
    
    if (-not (Initialize-Environment)) {
        exit 1
    }
    
    if (-not (Install-Dependencies)) {
        exit 1
    }
    
    Start-LearnForgeServers
    
} catch {
    Write-Host "❌ An error occurred: $_" -ForegroundColor Red
    exit 1
}
