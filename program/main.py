import logging
import keyboard
import time
import getpass
from recorder import is_obs_installed, open_obs, ws_connection, wait_for_obs, process_latest_video, is_ffmpeg_installed
from request import API_FETCH_USER_SETTINGS
username = getpass.getuser()

def main():
    
        logging.basicConfig(level=logging.INFO)
        # Paths
        OBS_DIR_PATH = "C:\\Program Files\\obs-studio\\bin\\64bit\\"
        FFMPEG_DIR_PATH = f"C:\\Users\\{username}\\AppData\\Local\\Microsoft\\WinGet\\Links"
        OBS_EXE_NAME = "obs64.exe"

        is_obs_installed(OBS_DIR_PATH)
        is_ffmpeg_installed(FFMPEG_DIR_PATH)
        open_obs(OBS_DIR_PATH, OBS_EXE_NAME)
        wait_for_obs()
        try:
            ws = ws_connection()
            ws.start_record()
            API_get_hotkey =  API_FETCH_USER_SETTINGS().get('clip_hotkey')
            keyboard.add_hotkey(API_get_hotkey, lambda: [ws.stop_record(), time.sleep(2), process_latest_video(), time.sleep(0.9), ws.start_record()])
            keyboard.wait('ctrl+shift+f2')
            if keyboard.is_pressed("ctrl+shift+f2"):
                ws.stop_record()
        except KeyboardInterrupt:
            ws.stop_record()
            pass
            
if __name__ == "__main__":
    main()