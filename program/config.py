import os
from configparser import ConfigParser

class OBSConfig:
    def __init__(self, directory, name):
        self.ini_path = os.path.join(directory, name)
        self.config = ConfigParser()
        with open(self.ini_path, 'r', encoding='utf-8-sig') as f:
            self.config.read_file(f)

    @property
    def websocket_status(self):
        return self.config.get('OBSWebSocket', 'serverenabled')

    @websocket_status.setter
    def websocket_status(self, value):
        self.config.set('OBSWebSocket', 'serverenabled', value)

    @property
    def websocket_port(self):
        return self.config.get('OBSWebSocket', 'ServerPort')

    @websocket_port.setter
    def websocket_port(self, value):
        self.config.set('OBSWebSocket', 'ServerPort', value)

    @property
    def websocket_password(self):
        return self.config.get('OBSWebSocket', 'ServerPassword')

    @websocket_password.setter
    def websocket_password(self, value):
        self.config.set('OBSWebSocket', 'ServerPassword', value)

    def save(self):
        with open(self.ini_path, 'w', encoding='utf-8') as f:
            self.config.write(f)
