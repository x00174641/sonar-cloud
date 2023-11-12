import subprocess
import os
import logging
logging.basicConfig(level=logging.ERROR)

def is_obs_installed(directory, name):
    if not os.path.isdir(directory):
        install_obs()
    open_obs(directory, name)

def install_obs():
    try:
        result = subprocess.run(
            ["winget", "install", "OBSProject.OBSStudio"],
            shell=True,
            check=True
        )
        if result.returncode == 0:
            print("OBS Studio installed successfully.")
        else:
            print("OBS Studio installation failed with return code %s", {result.returncode})
    except subprocess.CalledProcessError as e:
        logging.error("An error occurred while trying to install OBS Studio: %s", e)

def open_obs(directory, name):
    os.chdir(directory)
    result = subprocess.run(name,
                   shell=True,
                   check=True
                   )
    if result.returncode == 0:
        print("OBS Opened.")
    else:
        install_obs()
        logging.error("Failed to open the executable. Return code: %s", result.returncode)
