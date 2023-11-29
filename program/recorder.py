import subprocess
import os
import logging
import time
import getpass
import obsws_python as obs
import psutil
import glob
import random
from config import OBSConfig
logging.basicConfig(level=logging.ERROR)
username = getpass.getuser()
OBS_CONFIG_PATH = f"C:\\Users\\{username}\\AppData\\Roaming\\obs-studio"
OBS_CONFIG_NAME = "global.ini"

def setup():
    os.makedirs(f"C:\\Users\\{username}\\Videos\\CLIPR_raw_videos")
    os.makedirs(f"C:\\Users\\{username}\\Videos\\CLIPR_clips")

def is_obs_installed(directory):
    if not os.path.isdir(directory):
        install_obs()

def is_ffmpeg_installed(directory):
    ffmpeg_path = os.path.join(directory, 'ffmpeg.exe')
    if not os.path.isfile(ffmpeg_path):
        install_ffmpeg()

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

def install_ffmpeg():
    try:
        result = subprocess.run(
            ["winget", "install", "Gyan.FFmpeg"],
            shell=True,
            check=True
        )
        if result.returncode == 0:
            print("FFmpeg installed successfully.")
        else:
            print("FFmpeg installation failed with return code %s", {result.returncode})
    except subprocess.CalledProcessError as e:
        logging.error("An error occurred while trying to install FFmpeg: %s", e)

def open_obs(directory, name):
    os.chdir(directory)
    while True:
        for process in psutil.process_iter(attrs=['name']):
            if process.info['name'] == 'obs64.exe' or process.info['name'] == 'obs32.exe':
                return
        return subprocess.Popen(name,
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

def get_video_duration(filename):
    """Get the duration of a video in seconds using FFprobe."""
    try:
        result = subprocess.run(
            ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", filename],
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT)
        return float(result.stdout)
    except Exception as e:
        print(f"Error getting duration: {e}")
        return None

def process_latest_video():
    print("yes")
    raw_folder_path = f"C:\\Users\\{username}\\Videos\\CLIPR_raw_videos"
    clips_folder_path = f"C:\\Users\\{username}\\Videos\\CLIPR_clips"

    file_type = '\\*.mp4'
    files = glob.glob(raw_folder_path + file_type)
    latest_video = max(files, key=os.path.getctime)

    try:
        duration = get_video_duration(latest_video)
        if duration is None:
            raise Exception("Unable to get video duration")

        if duration > 20:
            start_time = duration - 20
            output_filename = os.path.join(clips_folder_path, f"{random.randint(1, 1930183912434131)}.mp4")
            subprocess.run(["ffmpeg", "-i", latest_video, "-ss", str(start_time), "-t", "20", "-c", "copy", output_filename], check=True)
            print(f"Video trimmed successfully and saved as {output_filename}")
        else:
            print("Video is less than 20 seconds long, no trimming needed.")

    except Exception as e:
        print(e)
        logging.error(f"Error processing video: {e}")