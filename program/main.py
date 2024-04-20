import logging
import keyboard
import time
import getpass
from recorder import is_obs_installed, open_obs, ws_connection, process_latest_video
from request import API_FETCH_USER_SETTINGS
username = getpass.getuser()

def print_colored_text(text):
    CYAN = '\033[96m'
    WHITE = '\033[97m'
    for char in text:
        if char == 'l':
            print(CYAN + char, end='')
        elif char == 'i':
            print(CYAN + char, end='')
        elif char == 'p':
            print(CYAN + char, end='')
        elif char == 'c':
            print(CYAN + char, end='')
        elif char == 'r':
            print(CYAN + char, end='')
        elif char == ' ':
            print(CYAN + char, end='')
        else:
            print(WHITE + char, end='')

text = """                                                    
                    lllllll   iiii                                         
                    l:::::l  i::::i                                        
                    l:::::l   iiii                                         
                    l:::::l                                                
    cccccccccccccccc l::::l iiiiiiippppp   ppppppppp   rrrrr   rrrrrrrrr   
  cc:::::::::::::::c l::::l i:::::ip::::ppp:::::::::p  r::::rrr:::::::::r  
 c:::::::::::::::::c l::::l  i::::ip:::::::::::::::::p r:::::::::::::::::r 
c:::::::cccccc:::::c l::::l  i::::ipp::::::ppppp::::::prr::::::rrrrr::::::r
c::::::c     ccccccc l::::l  i::::i p:::::p     p:::::p r:::::r     r:::::r
c:::::c              l::::l  i::::i p:::::p     p:::::p r:::::r     rrrrrrr
c:::::c              l::::l  i::::i p:::::p     p:::::p r:::::r            
c::::::c     ccccccc l::::l  i::::i p:::::p    p::::::p r:::::r            
c:::::::cccccc:::::cl::::::li::::::ip:::::ppppp:::::::p r:::::r            
 c:::::::::::::::::cl::::::li::::::ip::::::::::::::::p  r:::::r            
  cc:::::::::::::::cl::::::li::::::ip::::::::::::::pp   r:::::r            
    cccccccccccccccclllllllliiiiiiiip::::::pppppppp     rrrrrrr            
                                    p:::::p                                
                                    p:::::p                                
                                   p:::::::p                               
                                   p:::::::p                               
                                   p:::::::p                               
                                   ppppppppp
"""

def main():
        logging.basicConfig(level=logging.ERROR)
        # Paths
        OBS_DIR_PATH = "C:\\Program Files\\obs-studio\\bin\\64bit\\"
        OBS_EXE_NAME = "obs64.exe"
        print(print_colored_text(text))
        is_obs_installed(OBS_DIR_PATH)
        open_obs(OBS_DIR_PATH, OBS_EXE_NAME)
        try:
            ws = ws_connection()
            ws.start_record()
            API_get_hotkey =  API_FETCH_USER_SETTINGS().get('clip_hotkey')
            keyboard.add_hotkey(API_get_hotkey, lambda: [ws.stop_record(), time.sleep(2), process_latest_video(), time.sleep(0.9), ws.start_record()])
            keyboard.wait('ctrl+shift+f2')
            if keyboard.is_pressed("ctrl+shift+f2"):
                ws.stop_record()
                exit()
        except KeyboardInterrupt:
            ws.stop_record()
            exit()
            
if __name__ == "__main__":
    main()