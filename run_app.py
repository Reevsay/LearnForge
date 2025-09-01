#!/usr/bin/env python3
"""
LearnForge Application Launcher
===============================
Simple script to start both backend and frontend servers with one command.

Usage: python run_app.py
"""

import subprocess
import sys
import os
import time
import threading
import signal
from pathlib import Path

class Colors:
    """Terminal colors for better output"""
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'

class LearnForgeRunner:
    def __init__(self):
        self.processes = []
        self.project_root = Path(__file__).parent
        self.server_path = self.project_root / "server"
        self.client_path = self.project_root / "client"
        
    def print_banner(self):
        """Print the LearnForge banner"""
        banner = f"""
{Colors.HEADER}{Colors.BOLD}
╔══════════════════════════════════════════════════════════════╗
║                          🔥 LearnForge                       ║
║                   AI-Powered Learning Platform               ║
║                                                              ║
║  Starting your intelligent learning companion...            ║
╚══════════════════════════════════════════════════════════════╝
{Colors.ENDC}
        """
        print(banner)
    
    def check_dependencies(self):
        """Check if Node.js and npm are installed"""
        print(f"{Colors.OKCYAN}🔍 Checking dependencies...{Colors.ENDC}")
        
        try:
            # Check Node.js
            node_version = subprocess.check_output(['node', '--version'], 
                                                 stderr=subprocess.DEVNULL).decode().strip()
            print(f"{Colors.OKGREEN}✅ Node.js: {node_version}{Colors.ENDC}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print(f"{Colors.FAIL}❌ Node.js is not installed or not in PATH{Colors.ENDC}")
            print(f"{Colors.WARNING}Please install Node.js from https://nodejs.org/{Colors.ENDC}")
            return False
            
        try:
            # Check npm
            npm_version = subprocess.check_output(['npm', '--version'], 
                                                stderr=subprocess.DEVNULL).decode().strip()
            print(f"{Colors.OKGREEN}✅ npm: {npm_version}{Colors.ENDC}")
        except (subprocess.CalledProcessError, FileNotFoundError):
            print(f"{Colors.FAIL}❌ npm is not installed or not in PATH{Colors.ENDC}")
            return False
            
        return True
    
    def check_env_file(self):
        """Check if .env file exists"""
        env_file = self.project_root / ".env"
        if not env_file.exists():
            print(f"{Colors.WARNING}⚠️  .env file not found. Creating from .env.example...{Colors.ENDC}")
            env_example = self.project_root / ".env.example"
            if env_example.exists():
                with open(env_example, 'r') as src, open(env_file, 'w') as dst:
                    dst.write(src.read())
                print(f"{Colors.OKGREEN}✅ Created .env file{Colors.ENDC}")
            else:
                print(f"{Colors.FAIL}❌ .env.example not found. Please create .env manually{Colors.ENDC}")
                return False
        else:
            print(f"{Colors.OKGREEN}✅ Environment file found{Colors.ENDC}")
        return True
    
    def install_dependencies(self):
        """Install npm dependencies if node_modules don't exist"""
        print(f"{Colors.OKCYAN}📦 Checking and installing dependencies...{Colors.ENDC}")
        
        # Check server dependencies
        if not (self.server_path / "node_modules").exists():
            print(f"{Colors.WARNING}Installing server dependencies...{Colors.ENDC}")
            try:
                subprocess.run(['npm', 'install'], cwd=self.server_path, check=True)
                print(f"{Colors.OKGREEN}✅ Server dependencies installed{Colors.ENDC}")
            except subprocess.CalledProcessError:
                print(f"{Colors.FAIL}❌ Failed to install server dependencies{Colors.ENDC}")
                return False
        else:
            print(f"{Colors.OKGREEN}✅ Server dependencies already installed{Colors.ENDC}")
        
        # Check client dependencies
        if not (self.client_path / "node_modules").exists():
            print(f"{Colors.WARNING}Installing client dependencies...{Colors.ENDC}")
            try:
                subprocess.run(['npm', 'install'], cwd=self.client_path, check=True)
                print(f"{Colors.OKGREEN}✅ Client dependencies installed{Colors.ENDC}")
            except subprocess.CalledProcessError:
                print(f"{Colors.FAIL}❌ Failed to install client dependencies{Colors.ENDC}")
                return False
        else:
            print(f"{Colors.OKGREEN}✅ Client dependencies already installed{Colors.ENDC}")
        
        return True
    
    def start_server(self):
        """Start the backend server"""
        print(f"{Colors.OKCYAN}🚀 Starting backend server...{Colors.ENDC}")
        try:
            # Start server process
            server_process = subprocess.Popen(
                ['npm', 'start'],
                cwd=self.server_path,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                universal_newlines=True,
                bufsize=1
            )
            self.processes.append(('Server', server_process))
            
            # Monitor server output in a separate thread
            def monitor_server():
                for line in iter(server_process.stdout.readline, ''):
                    if line.strip():
                        if 'Server running on port' in line:
                            print(f"{Colors.OKGREEN}✅ Backend server started successfully on http://localhost:5000{Colors.ENDC}")
                        elif 'database connected' in line.lower():
                            print(f"{Colors.OKGREEN}✅ Database connected successfully{Colors.ENDC}")
                        elif 'error' in line.lower() and 'warning' not in line.lower():
                            print(f"{Colors.FAIL}❌ Server Error: {line.strip()}{Colors.ENDC}")
                        else:
                            print(f"{Colors.OKBLUE}[Server] {line.strip()}{Colors.ENDC}")
            
            threading.Thread(target=monitor_server, daemon=True).start()
            return True
            
        except Exception as e:
            print(f"{Colors.FAIL}❌ Failed to start server: {e}{Colors.ENDC}")
            return False
    
    def start_client(self):
        """Start the frontend client"""
        print(f"{Colors.OKCYAN}🎨 Starting frontend client...{Colors.ENDC}")
        try:
            # Wait a bit for server to start
            time.sleep(3)
            
            # Start client process
            client_process = subprocess.Popen(
                ['npm', 'run', 'dev'],
                cwd=self.client_path,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                universal_newlines=True,
                bufsize=1
            )
            self.processes.append(('Client', client_process))
            
            # Monitor client output in a separate thread
            def monitor_client():
                for line in iter(client_process.stdout.readline, ''):
                    if line.strip():
                        if 'Local:' in line and 'http://' in line:
                            # Extract URL from Vite output
                            url = line.split('Local:')[1].strip()
                            print(f"{Colors.OKGREEN}✅ Frontend client started successfully{Colors.ENDC}")
                            print(f"{Colors.OKGREEN}🌐 Open your browser and go to: {url}{Colors.ENDC}")
                            self.print_ready_message(url)
                        elif 'error' in line.lower():
                            print(f"{Colors.FAIL}❌ Client Error: {line.strip()}{Colors.ENDC}")
                        else:
                            print(f"{Colors.OKCYAN}[Client] {line.strip()}{Colors.ENDC}")
            
            threading.Thread(target=monitor_client, daemon=True).start()
            return True
            
        except Exception as e:
            print(f"{Colors.FAIL}❌ Failed to start client: {e}{Colors.ENDC}")
            return False
    
    def print_ready_message(self, client_url):
        """Print ready message with URLs"""
        ready_msg = f"""
{Colors.OKGREEN}{Colors.BOLD}
╔══════════════════════════════════════════════════════════════╗
║                    🎉 LearnForge is Ready!                   ║
║                                                              ║
║  Frontend: {client_url:<47} ║
║  Backend:  http://localhost:5000                             ║
║                                                              ║
║  Press Ctrl+C to stop all servers                           ║
╚══════════════════════════════════════════════════════════════╝
{Colors.ENDC}
        """
        print(ready_msg)
    
    def cleanup(self):
        """Clean up processes"""
        print(f"\n{Colors.WARNING}🛑 Shutting down LearnForge...{Colors.ENDC}")
        for name, process in self.processes:
            try:
                print(f"{Colors.WARNING}Stopping {name}...{Colors.ENDC}")
                process.terminate()
                process.wait(timeout=5)
                print(f"{Colors.OKGREEN}✅ {name} stopped{Colors.ENDC}")
            except subprocess.TimeoutExpired:
                print(f"{Colors.WARNING}Force killing {name}...{Colors.ENDC}")
                process.kill()
            except Exception as e:
                print(f"{Colors.FAIL}Error stopping {name}: {e}{Colors.ENDC}")
        
        print(f"{Colors.OKGREEN}👋 LearnForge stopped successfully{Colors.ENDC}")
    
    def run(self):
        """Main run method"""
        try:
            self.print_banner()
            
            # Check dependencies
            if not self.check_dependencies():
                return False
            
            # Check environment file
            if not self.check_env_file():
                return False
            
            # Install dependencies
            if not self.install_dependencies():
                return False
            
            # Start servers
            if not self.start_server():
                return False
            
            if not self.start_client():
                return False
            
            # Keep running until interrupted
            try:
                while True:
                    time.sleep(1)
            except KeyboardInterrupt:
                pass
            
        except Exception as e:
            print(f"{Colors.FAIL}❌ Unexpected error: {e}{Colors.ENDC}")
            return False
        finally:
            self.cleanup()
        
        return True

def signal_handler(sig, frame):
    """Handle Ctrl+C gracefully"""
    print(f"\n{Colors.WARNING}Received interrupt signal. Shutting down...{Colors.ENDC}")
    sys.exit(0)

if __name__ == "__main__":
    # Set up signal handler for graceful shutdown
    signal.signal(signal.SIGINT, signal_handler)
    
    # Run the application
    runner = LearnForgeRunner()
    success = runner.run()
    
    sys.exit(0 if success else 1)
