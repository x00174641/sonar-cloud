import subprocess
import os
import logging
logging.basicConfig(level=logging.ERROR)

def is_obs_installed(directory, name):
    os.chdir(directory)
    result = subprocess.run(name,
                            shell=True,
                            capture_output=True,
                            check=False
                            )
    if result.returncode == 0:
        print("OBS Opened.")
    else:
        subprocess.run(["winget", "install", "OBSProject.OBSStudio"],
                       shell=True,
                       capture_output=True,
                       check=False
                       )
        logging.error("Failed to open the executable. Return code: %s", result.returncode)
