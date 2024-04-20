import subprocess
import os
import logging
import time
import getpass
import obsws_python as obs
import psutil
import glob
import uuid
import ffmpeg
from moviepy.editor import VideoFileClip
from config import OBSConfig
from request import upload_video_to_s3, API_FETCH_USER_SETTINGS, postPassword
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
username = getpass.getuser()
OBS_CONFIG_PATH = f"C:\\Users\\{username}\\AppData\\Roaming\\obs-studio"
OBS_CONFIG_NAME = "global.ini"
CYAN = '\033[96m'
RESET = '\033[0m'
def setup():
    os.makedirs(f"C:\\CLIPR_raw_videos")
    os.makedirs(f"C:\\CLIPR_clips")

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
            logger.info("OBS Studio installed successfully.")
        else:
            logger.error("OBS Studio installation failed with return code %s", {result.returncode})
    except subprocess.CalledProcessError as e:
        logger.error("An error occurred while trying to install OBS Studio: %s", e)


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
    if obs_ws_status == 'false':
        obs_config.websocket_status = 'true'
        obs_config.save()

    ws = obs.ReqClient(host=host, port=obs_websocket_port, password=obs_websocket_password, timeout=3)
    postPassword(obs_websocket_password)
    wait_for_obs()
    if not os.path.exists(f"C:\\CLIPR_raw_videos"):
        setup()
        ws.set_record_directory(f"C:\\CLIPR_raw_videos")
    return ws

def wait_for_obs():
    start_time = time.time()
    while True:
        for process in psutil.process_iter(attrs=['name']):
            if process.info['name'] == 'obs64.exe' or process.info['name'] == 'obs32.exe':
                return logger.info("OBS is now running.")
        if time.time() - start_time >= 60: 
            logger.info("Timeout reached. OBS is not running.")
            return
        time.sleep(0.1)

def get_video_duration(filename):
    try:
        clip = VideoFileClip(filename)
        duration = clip.duration
        clip.close()
        return duration
    except Exception as e:
        logger.error(f"Error getting duration: {e}")
        return None
    
def process_latest_video():
    logging.info('Processing video for upload to S3.')
    raw_folder_path = "C:\\CLIPR_raw_videos"
    clips_folder_path = "C:\\CLIPR_clips"

    file_type = '*.mp4'
    files = glob.glob(os.path.join(raw_folder_path, file_type))
    latest_video = max(files, key=os.path.getctime)

    try:
        duration = get_video_duration(latest_video)
        settings = API_FETCH_USER_SETTINGS()
        clip_interval = int(settings.get('clip_interval', 30))

        start_time = duration - clip_interval

        random_url = uuid.uuid4().hex
        output_filename = os.path.join(clips_folder_path, f"{random_url}.mp4")
        if duration > clip_interval:
            (
                ffmpeg
                .input(latest_video, ss=start_time)
                .output(output_filename, t=clip_interval, c='copy')
                .run(overwrite_output=True)
            )
            logger.info("Video trimmed successfully and saved as" + CYAN + f"{output_filename}")
            print(RESET)
            upload_video_to_s3(output_filename, f"videos/{random_url}")
        else:
            upload_video_to_s3(latest_video, f"videos/{random_url}")
        
        logger.info("Clip uploaded to Clipr: " + CYAN + f"https://clipr.solutions/clip/{random_url}")
        print(RESET)
    except Exception as e:
        
        logger.error(f"Error processing video: {e}")