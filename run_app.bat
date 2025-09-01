@echo off
echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                          🔥 LearnForge                       ║
echo ║                   AI-Powered Learning Platform               ║
echo ║                                                              ║
echo ║  Starting your intelligent learning companion...            ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo 🔍 Starting LearnForge servers...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Install dependencies if needed
echo 📦 Checking dependencies...
if not exist "server\node_modules" (
    echo Installing server dependencies...
    cd server
    npm install
    cd ..
)

if not exist "client\node_modules" (
    echo Installing client dependencies...
    cd client
    npm install
    cd ..
)

REM Create .env file if it doesn't exist
if not exist ".env" (
    if exist ".env.example" (
        echo Creating .env file from .env.example...
        copy ".env.example" ".env"
    )
)

echo.
echo 🚀 Starting backend server...
start "LearnForge Backend" cmd /k "cd server && npm start"

echo ⏳ Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo 🎨 Starting frontend client...
start "LearnForge Frontend" cmd /k "cd client && npm run dev"

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                    🎉 LearnForge is Starting!                ║
echo ║                                                              ║
echo ║  Frontend: http://localhost:5173                             ║
echo ║  Backend:  http://localhost:5000                             ║
echo ║                                                              ║
echo ║  Two command windows will open for server monitoring        ║
echo ║  Close those windows to stop the servers                    ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.
echo Press any key to close this window...
pause >nul
