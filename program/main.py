import getpass
import configparser
import logging
import obsws_python as obs
from config import OBSConfig
from recorder import is_obs_installed, open_obs
logging.basicConfig(level=logging.INFO)
username = getpass.getuser()
# User Settings
config = configparser.ConfigParser()
ini_path = "program\\user_config.ini"
config.read(ini_path)
FirstTimeLoad = config.get('USER CONTROL', 'FirstTimeLoadUp')
# Paths
OBS_CONFIG_PATH = f"C:\\Users\\{username}\\AppData\\Roaming\\obs-studio"
OBS_CONFIG_NAME = "global.ini"
OBS_DIR_PATH = "C:\\Program Files\\obs-studio\\bin\\64bit\\"
OBS_EXE_NAME = "obs64.exe"
# OBS Settings
host = "localhost"
obs_config = OBSConfig(OBS_CONFIG_PATH,OBS_CONFIG_NAME)
obs_ws_status = obs_config.websocket_status
obs_websocket_port = int(obs_config.websocket_port)
obs_websocket_password = obs_config.websocket_password
is_obs_installed(OBS_DIR_PATH)
print(type(obs_websocket_password))
# Generates Global.ini File.
# if FirstTimeLoad:
#     first_load_obs(OBS_DIR_PATH,OBS_EXE_NAME)

if obs_ws_status == 'false':
    obs_config.websocket_status = 'true'
    obs_config.save()

open_obs(OBS_DIR_PATH,OBS_EXE_NAME)
# Connection to WebSocket
ws = obs.ReqClient(host=host, port=obs_websocket_port, password=obs_websocket_password, timeout=3)
