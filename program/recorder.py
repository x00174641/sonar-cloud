import subprocess
import os
import logging
import time
import getpass
import obsws_python as obs
import psutil
from config import OBSConfig
logging.basicConfig(level=logging.ERROR)
username = getpass.getuser()
OBS_CONFIG_PATH = f"C:\\Users\\{username}\\AppData\\Roaming\\obs-studio"
OBS_CONFIG_NAME = "global.ini"

def setup():
    os.makedirs(f"C:\\Users\\{username}\\Videos\\CLIPR_raw_videos")

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

def ws_connection(): 
    # OBS Settings
    host = "localhost"
    obs_config = OBSConfig(OBS_CONFIG_PATH,OBS_CONFIG_NAME)
    obs_ws_status = obs_config.websocket_status
    obs_websocket_port = int(obs_config.websocket_port)
    obs_websocket_password = obs_config.websocket_password
    print(type(obs_websocket_password))

    if obs_ws_status == 'false':
        obs_config.websocket_status = 'true'
        obs_config.save()

    ws = obs.ReqClient(host=host, port=obs_websocket_port, password=obs_websocket_password, timeout=3)
    wait_for_obs()
    if not os.path.exists(f"C:\\Users\\{username}\\Videos\\CLIPR_raw_videos"):
        setup()
        ws.set_record_directory(f"C:\\Users\\{username}\\Videos\\CLIPR_raw_videos")

    return ws

def wait_for_obs():
    start_time = time.time()
    while True:
        for process in psutil.process_iter(attrs=['name']):
            if process.info['name'] == 'obs64.exe' or process.info['name'] == 'obs32.exe':
                print("OBS is now running.")
                return
        if time.time() - start_time >= 60: 
            print("Timeout reached. OBS is not running.")
            return
        time.sleep(0.1)