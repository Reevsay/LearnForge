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
import webbrowser
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
        self.server_ready = False
        self.client_ready = False
        
    def print_banner(self):
        """Print the LearnForge banner"""
        print(f"""
{Colors.HEADER}{Colors.BOLD}
╔══════════════════════════════════════════════════════════════╗
║                          🔥 LearnForge                       ║
║                   AI-Powered Learning Platform               ║
║                                                              ║
║  Starting your intelligent learning companion...            ║
╚══════════════════════════════════════════════════════════════╝
{Colors.ENDC}""")
    
    def check_dependencies(self):
        """Check if Node.js and npm are installed"""
        print(f"{Colors.OKCYAN}🔍 Checking dependencies...{Colors.ENDC}")
        
        # Check Node.js
        try:
            result = subprocess.run(['node', '--version'], 
                                  capture_output=True, text=True, shell=True)
            if result.returncode == 0:
                node_version = result.stdout.strip()
                print(f"{Colors.OKGREEN}✅ Node.js: {node_version}{Colors.ENDC}")
            else:
                raise subprocess.CalledProcessError(result.returncode, 'node')
        except (subprocess.CalledProcessError, FileNotFoundError):
            print(f"{Colors.FAIL}❌ Node.js is not installed or not in PATH{Colors.ENDC}")
            print(f"{Colors.WARNING}Please install Node.js from https://nodejs.org/{Colors.ENDC}")
            return False
            
        # Check npm
        try:
            result = subprocess.run(['npm', '--version'], 
                                  capture_output=True, text=True, shell=True)
            if result.returncode == 0:
                npm_version = result.stdout.strip()
                print(f"{Colors.OKGREEN}✅ npm: {npm_version}{Colors.ENDC}")
            else:
                raise subprocess.CalledProcessError(result.returncode, 'npm')
        except (subprocess.CalledProcessError, FileNotFoundError):
            print(f"{Colors.FAIL}❌ npm is not installed or not in PATH{Colors.ENDC}")
            print(f"{Colors.WARNING}Try reinstalling Node.js which includes npm{Colors.ENDC}")
            return False
            
        return True
    
    def setup_environment(self):
        """Setup environment file"""
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
        """Install npm dependencies"""
        print(f"{Colors.OKCYAN}📦 Installing dependencies...{Colors.ENDC}")
        
        # Install server dependencies
        if not (self.server_path / "node_modules").exists():
            print(f"{Colors.WARNING}Installing server dependencies...{Colors.ENDC}")
            try:
                result = subprocess.run(['npm', 'install'], cwd=self.server_path, 
                                      capture_output=True, text=True, shell=True)
                if result.returncode == 0:
                    print(f"{Colors.OKGREEN}✅ Server dependencies installed{Colors.ENDC}")
                else:
                    print(f"{Colors.FAIL}❌ Failed to install server dependencies{Colors.ENDC}")
                    print(f"{Colors.FAIL}Error: {result.stderr}{Colors.ENDC}")
                    return False
            except Exception as e:
                print(f"{Colors.FAIL}❌ Error installing server dependencies: {e}{Colors.ENDC}")
                return False
        else:
            print(f"{Colors.OKGREEN}✅ Server dependencies already installed{Colors.ENDC}")
        
        # Install client dependencies
        if not (self.client_path / "node_modules").exists():
            print(f"{Colors.WARNING}Installing client dependencies...{Colors.ENDC}")
            try:
                result = subprocess.run(['npm', 'install'], cwd=self.client_path, 
                                      capture_output=True, text=True, shell=True)
                if result.returncode == 0:
                    print(f"{Colors.OKGREEN}✅ Client dependencies installed{Colors.ENDC}")
                else:
                    print(f"{Colors.FAIL}❌ Failed to install client dependencies{Colors.ENDC}")
                    print(f"{Colors.FAIL}Error: {result.stderr}{Colors.ENDC}")
                    return False
            except Exception as e:
                print(f"{Colors.FAIL}❌ Error installing client dependencies: {e}{Colors.ENDC}")
                return False
        else:
            print(f"{Colors.OKGREEN}✅ Client dependencies already installed{Colors.ENDC}")
        
        return True
    
    def start_server(self):
        """Start the backend server"""
        print(f"{Colors.OKCYAN}🚀 Starting backend server...{Colors.ENDC}")
        try:
            server_process = subprocess.Popen(
                ['npm', 'start'],
                cwd=self.server_path,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                universal_newlines=True,
                shell=True
            )
            self.processes.append(('Server', server_process))
            
            def monitor_server():
                startup_messages = []
                for line in iter(server_process.stdout.readline, ''):
                    if not line:
                        break
                    line = line.strip()
                    if line:
                        startup_messages.append(line)
                        
                        # Check for server ready
                        if 'server running on port' in line.lower():
                            print(f"{Colors.OKGREEN}✅ Backend server started on http://localhost:5000{Colors.ENDC}")
                            self.server_ready = True
                            
                        # Check for database connection
                        elif 'database connected' in line.lower() or 'neon database connected' in line.lower():
                            print(f"{Colors.OKGREEN}✅ Database connected successfully{Colors.ENDC}")
                            
                        # Show errors
                        elif 'error' in line.lower() and 'warning' not in line.lower():
                            print(f"{Colors.FAIL}[Server Error] {line}{Colors.ENDC}")
                            
                        # Show important startup info
                        elif not self.server_ready:
                            if any(keyword in line.lower() for keyword in ['loading', 'starting', 'connecting']):
                                print(f"{Colors.OKBLUE}[Server] {line}{Colors.ENDC}")
            
            threading.Thread(target=monitor_server, daemon=True).start()
            return True
            
        except Exception as e:
            print(f"{Colors.FAIL}❌ Failed to start server: {e}{Colors.ENDC}")
            return False
    
    def start_client(self):
        """Start the frontend client"""
        print(f"{Colors.OKCYAN}🎨 Starting frontend client...{Colors.ENDC}")
        
        # Wait for server to be ready
        print(f"{Colors.WARNING}Waiting for backend server...{Colors.ENDC}")
        wait_time = 0
        while not self.server_ready and wait_time < 30:
            time.sleep(1)
            wait_time += 1
        
        if not self.server_ready:
            print(f"{Colors.WARNING}Backend not ready, starting frontend anyway...{Colors.ENDC}")
        
        try:
            client_process = subprocess.Popen(
                ['npm', 'run', 'dev'],
                cwd=self.client_path,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                universal_newlines=True,
                shell=True
            )
            self.processes.append(('Client', client_process))
            
            def monitor_client():
                for line in iter(client_process.stdout.readline, ''):
                    if not line:
                        break
                    line = line.strip()
                    if line:
                        # Check for client ready
                        if 'local:' in line.lower() and 'http' in line.lower():
                            url = "http://localhost:5173"
                            print(f"{Colors.OKGREEN}✅ Frontend client started on {url}{Colors.ENDC}")
                            self.client_ready = True
                            self.show_ready_message()
                            
                        # Show errors
                        elif 'error' in line.lower():
                            print(f"{Colors.FAIL}[Client Error] {line}{Colors.ENDC}")
                            
                        # Show important info
                        elif not self.client_ready:
                            if any(keyword in line.lower() for keyword in ['vite', 'ready', 'local']):
                                print(f"{Colors.OKCYAN}[Client] {line}{Colors.ENDC}")
            
            threading.Thread(target=monitor_client, daemon=True).start()
            return True
            
        except Exception as e:
            print(f"{Colors.FAIL}❌ Failed to start client: {e}{Colors.ENDC}")
            return False
    
    def show_ready_message(self):
        """Show ready message"""
        if self.server_ready and self.client_ready:
            print(f"""
{Colors.OKGREEN}{Colors.BOLD}
╔══════════════════════════════════════════════════════════════╗
║                    🎉 LearnForge is Ready!                   ║
║                                                              ║
║  🌐 Frontend: http://localhost:5173                          ║
║  🔧 Backend:  http://localhost:5000                          ║
║                                                              ║
║  🚀 Opening browser automatically...                        ║
║  📝 Press Ctrl+C to stop all servers                        ║
╚══════════════════════════════════════════════════════════════╝
{Colors.ENDC}""")
            
            # Open browser automatically
            try:
                webbrowser.open('http://localhost:5173')
            except:
                pass
    
    def cleanup(self):
        """Clean up processes"""
        print(f"\n{Colors.WARNING}🛑 Shutting down LearnForge...{Colors.ENDC}")
        for name, process in self.processes:
            try:
                print(f"{Colors.WARNING}Stopping {name}...{Colors.ENDC}")
                process.terminate()
                try:
                    process.wait(timeout=5)
                    print(f"{Colors.OKGREEN}✅ {name} stopped{Colors.ENDC}")
                except subprocess.TimeoutExpired:
                    print(f"{Colors.WARNING}Force killing {name}...{Colors.ENDC}")
                    process.kill()
                    process.wait()
            except Exception as e:
                print(f"{Colors.FAIL}Error stopping {name}: {e}{Colors.ENDC}")
        
        print(f"{Colors.OKGREEN}👋 LearnForge stopped successfully{Colors.ENDC}")
    
    def run(self):
        """Main run method"""
        try:
            self.print_banner()
            
            if not self.check_dependencies():
                return False
            
            if not self.setup_environment():
                return False
            
            if not self.install_dependencies():
                return False
            
            print(f"\n{Colors.OKCYAN}🚀 Starting LearnForge servers...{Colors.ENDC}")
            
            if not self.start_server():
                return False
            
            if not self.start_client():
                return False
            
            # Keep running
            print(f"\n{Colors.OKBLUE}📡 Monitoring servers... (Press Ctrl+C to stop){Colors.ENDC}")
            try:
                while True:
                    time.sleep(1)
                    # Check if processes are still running
                    for name, process in self.processes:
                        if process.poll() is not None:
                            print(f"{Colors.FAIL}❌ {name} has stopped unexpectedly{Colors.ENDC}")
                            return False
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
    print(f"\n{Colors.WARNING}Received interrupt signal...{Colors.ENDC}")
    sys.exit(0)

if __name__ == "__main__":
    # Set up signal handler
    signal.signal(signal.SIGINT, signal_handler)
    
    # Run the application
    runner = LearnForgeRunner()
    success = runner.run()
    
    sys.exit(0 if success else 1)
