import subprocess
import os
import logging
logging.basicConfig(level=logging.ERROR)

def is_obs_installed(directory):
    if not os.path.isdir(directory):
        install_obs()

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
    subprocess.Popen(name,
                   shell=True,
                   )

def first_load_obs(directory, name):
    os.chdir(directory)
    process = subprocess.Popen(name,
                   shell=True,
                   )
    process.terminate()
