# 🚀 Quick Start Guide

Run your LearnForge application with a single command!

## 🎯 One-Command Launch

### Option 1: Python (Recommended)
```bash
python run_app.py
```

### Option 2: Windows Batch File
```bash
run_app.bat
```

### Option 3: PowerShell (Windows)
```powershell
.\run_app.ps1
```

## 📋 What these scripts do:

1. **🔍 Check Dependencies**: Verify Node.js and npm are installed
2. **📦 Install Packages**: Automatically install npm dependencies if missing
3. **🔧 Setup Environment**: Create .env file from .env.example if needed
4. **🚀 Start Backend**: Launch the Node.js server on port 5000
5. **🎨 Start Frontend**: Launch the React client on port 5173
6. **👁️ Monitor**: Display server status and logs
7. **🛑 Cleanup**: Gracefully stop all servers with Ctrl+C

## 🌐 Access Your Application

Once started, open your browser and go to:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

## 📋 Prerequisites

- **Node.js** (v16 or higher) - Download from [nodejs.org](https://nodejs.org/)
- **Python** (for run_app.py) - Download from [python.org](https://python.org/)

## 🔧 Manual Setup (if needed)

If the automated scripts don't work, you can start manually:

1. **Start Backend**:
   ```bash
   cd server
   npm install
   npm start
   ```

2. **Start Frontend** (in new terminal):
   ```bash
   cd client
   npm install
   npm run dev
   ```

## 🛠️ Troubleshooting

- **Port already in use**: Make sure ports 5000 and 5173 are available
- **Missing .env**: Copy `.env.example` to `.env` and configure
- **Node.js errors**: Ensure you have Node.js v16+ installed
- **Permission denied**: On Linux/Mac, make scripts executable with `chmod +x run_app.py`

## 🎉 Features Available

- ✅ AI-powered learning path generation
- ✅ Interactive quiz system with explanations
- ✅ User authentication and progress tracking
- ✅ Modern responsive design
- ✅ Real-time feedback and results
