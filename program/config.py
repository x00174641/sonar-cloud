from configparser import ConfigParser
import os

# Subclass ConfigParser to override its default behavior of lowercasing keys
class CaseSensitiveConfigParser(ConfigParser):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)

    def optionxform(self, optionstr):
        # Override the default optionxform method to avoid converting keys to lowercase
        return optionstr
class OBSConfig:
    def __init__(self, directory, name):
        self.ini_path = os.path.join(directory, name)
        # Initialize with the case-sensitive subclass
        self.config = CaseSensitiveConfigParser()
        # Read the configuration file
        if os.path.exists(self.ini_path):
            with open(self.ini_path, 'r', encoding='utf-8-sig') as f:
                self.config.read_file(f)

    @property
    def websocket_status(self):
        return self.config.get('OBSWebSocket', 'ServerEnabled')

    @websocket_status.setter
    def websocket_status(self, value):
        if not self.config.has_section('OBSWebSocket'):
            self.config.add_section('OBSWebSocket')
        self.config.set('OBSWebSocket', 'ServerEnabled', value)

    @property
    def websocket_port(self):
        return self.config.get('OBSWebSocket', 'ServerPort')

    @websocket_port.setter
    def websocket_port(self, value):
        if not self.config.has_section('OBSWebSocket'):
            self.config.add_section('OBSWebSocket')
        self.config.set('OBSWebSocket', 'ServerPort', value)

    @property
    def websocket_password(self):
        return self.config.get('OBSWebSocket', 'ServerPassword')

    @websocket_password.setter
    def websocket_password(self, value):
        if not self.config.has_section('OBSWebSocket'):
            self.config.add_section('OBSWebSocket')
        self.config.set('OBSWebSocket', 'ServerPassword', value)

    def save(self):
        with open(self.ini_path, 'w', encoding='utf-8') as f:
            self.config.write(f, space_around_delimiters=False)
