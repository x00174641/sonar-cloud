import os
from configparser import ConfigParser

class OBSConfig:
    def __init__(self, directory, name):
        self.ini_path = os.path.join(directory, name)
        self.config = ConfigParser()
        self.read_config()

    def read_config(self):
        with open(self.ini_path, 'r', encoding='utf-8-sig') as f:
            content = f.read()
        content = self.remove_duplicate_entries(content)
        self.config.read_string(content)

    def remove_duplicate_entries(self, content):
        seen = set()
        new_content = []
        for line in content.splitlines():
            if line.startswith("[") and line.endswith("]"):
                seen.clear()
                new_content.append(line)
            else:
                if "=" in line:
                    option = line.split("=", 1)[0].lower().strip()
                    if option not in seen:
                        seen.add(option)
                        new_content.append(line)
                else:
                    new_content.append(line)
        return '\n'.join(new_content)
    @property
    def websocket_status(self):
        return self.config['OBSWebSocket']["ServerEnabled"]

    @websocket_status.setter
    def websocket_status(self, value):
        self.config['OBSWebSocket']['ServerEnabled'] = value

    @property
    def websocket_port(self):
        return self.config['OBSWebSocket']['ServerPort']

    @websocket_port.setter
    def websocket_port(self, value):
        self.config['OBSWebSocket']['ServerPort'] = value

    @property
    def websocket_password(self):
        return self.config['OBSWebSocket']['ServerPassword']

    @websocket_password.setter
    def websocket_password(self, value):
        self.config['OBSWebSocket']['ServerPassword'] = value

    def save(self):
        with open(self.ini_path, 'w', encoding='utf-8-sig') as f:
            self.config.write(f)
