import subprocess
import sys
from threading import Thread
import time
import os

def run_frontend():
    os.environ['PORT'] = '5000'  # Set frontend port
    subprocess.run(["npm", "run", "dev"], check=True)

def run_backend():
    subprocess.run([
        sys.executable, 
        "-m", 
        "uvicorn", 
        "server.main:app", 
        "--host", 
        "0.0.0.0", 
        "--port", 
        "8000", 
        "--reload"
    ], check=True)

if __name__ == "__main__":
    # Kill any existing processes on the ports we need
    try:
        subprocess.run(["pkill", "-f", "node"], check=False)
        subprocess.run(["pkill", "-f", "uvicorn"], check=False)
        time.sleep(1)  # Give processes time to close
    except Exception:
        pass  # Ignore errors from pkill

    frontend_thread = Thread(target=run_frontend)
    backend_thread = Thread(target=run_backend)

    try:
        # Start backend first
        backend_thread.start()
        time.sleep(2)  # Give backend time to start

        # Then start frontend
        frontend_thread.start()

        frontend_thread.join()
        backend_thread.join()
    except KeyboardInterrupt:
        print("\nShutting down servers...")
        sys.exit(0)