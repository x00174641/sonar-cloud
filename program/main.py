import getpass
import logging
import keyboard
import time
from recorder import is_obs_installed, open_obs, ws_connection, wait_for_obs
logging.basicConfig(level=logging.INFO)

username = getpass.getuser()
# Paths
OBS_DIR_PATH = "C:\\Program Files\\obs-studio\\bin\\64bit\\"
OBS_EXE_NAME = "obs64.exe"

is_obs_installed(OBS_DIR_PATH)
open_obs(OBS_DIR_PATH,OBS_EXE_NAME)
wait_for_obs()
ws = ws_connection()
ws.start_record()
while True:
    if keyboard.is_pressed("f2"):
        ws.stop_record()
        time.sleep(0.9)
        ws.start_record()
