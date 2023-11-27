import logging
import keyboard
import time
import getpass
from recorder import is_obs_installed, open_obs, ws_connection, wait_for_obs, process_latest_video, is_ffmpeg_installed

username = getpass.getuser()

def main():
    try:
        logging.basicConfig(level=logging.INFO)
        # Paths
        OBS_DIR_PATH = "C:\\Program Files\\obs-studio\\bin\\64bit\\"
        FFMPEG_DIR_PATH = f"C:\\Users\\{username}\\AppData\\Local\\Microsoft\\WinGet\\Links"
        OBS_EXE_NAME = "obs64.exe"

        is_obs_installed(OBS_DIR_PATH)
        is_ffmpeg_installed(FFMPEG_DIR_PATH)
        open_obs(OBS_DIR_PATH, OBS_EXE_NAME)
        wait_for_obs()
        ws = ws_connection()
        ws.start_record()

        while True:
            if keyboard.is_pressed("f2"):
                ws.stop_record()
                time.sleep(2)
                process_latest_video()
                time.sleep(0.9)
                ws.start_record()
    except KeyboardInterrupt:
        ws.stop_record()
        pass

if __name__ == "__main__":
    main()