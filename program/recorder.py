import subprocess
import os 
import logging
logging.basicConfig(level=logging.ERROR)

def is_obs_installed(dir, name):
    os.chdir(dir)
    result = subprocess.run(name, shell=True, capture_output=True)
    if result.returncode == 0:
        print("OBS Opened.")
    else:
        subprocess.run(["winget", "install", "OBSProject.OBSStudio"], shell=True, capture_output=True)
        logging.ERROR(f"Failed to open the executable. Return code: {result.returncode}")
