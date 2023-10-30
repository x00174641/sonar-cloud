import subprocess
import os 
import logging
logging.basicConfig(level=logging.ERROR)
OBS_DIR_PATH = "C:\\Program Files\\obs-studio\\bin\\64bit\\"
OBS_EXE_NAME = "obs64.exe"

os.chdir(OBS_DIR_PATH)
result = subprocess.run(OBS_EXE_NAME , shell=True, capture_output=True)

if result.returncode == 0:
    print("OBS Opened.")
else:
    subprocess.run(["winget", "install", "OBSProject.OBSStudio"], shell=True, capture_output=True)
    logging.ERROR(f"Failed to open the executable. Return code: {result.returncode}")
    