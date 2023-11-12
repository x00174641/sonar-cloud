import getpass
from config import OBSConfig
from recorder import is_obs_installed

username = getpass.getuser()
OBS_CONFIG_PATH = f"C:\\Users\\{username}\\AppData\\Roaming\\obs-studio"
OBS_CONFIG_NAME = "global.ini"
OBS_DIR_PATH = "C:\\Program Files\\obs-studio\\bin\\64bit\\"
OBS_EXE_NAME = "obs64.exe"

obs_config = OBSConfig(OBS_CONFIG_PATH , OBS_CONFIG_NAME)
status = obs_config.websocket_status
port = obs_config.websocket_port
print("Current status:", status)
print("Current port:", port)

is_obs_installed(OBS_DIR_PATH , OBS_EXE_NAME)
