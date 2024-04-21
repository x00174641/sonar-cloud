import obswebsocket

# Set up connection parameters
obs_host = "localhost"
obs_port = 4455
obs_password = "yPmrYmzgKvfyxDRk"  # Change this to your OBS WebSocket password

# Connect to OBS WebSocket
obs = obswebsocket.obsws(obs_host, obs_port, obs_password)
obs.connect()

# Get primary monitor information
primary_monitor = obs.call({"request-type": "GetVideoInfo"})['video']['baseWidth'], obs.call({"request-type": "GetVideoInfo"})['video']['baseHeight']

# Create a display capture source for the primary monitor
display_capture_settings = {
    "sceneName": "scene",
    "sourceName": "Display Capture",
    "type": "monitor_capture",
    "width": primary_monitor[0],
    "height": primary_monitor[1],
    "monitor": 0,  # 0 for the primary monitor
    "x": 0,
    "y": 0
}

# Add the display capture source to the scene
obs.call({"request-type": "CreateSource", "sourceName": display_capture_settings["sourceName"],
          "sourceKind": display_capture_settings["type"], "sceneName": display_capture_settings["sceneName"],
          "width": display_capture_settings["width"], "height": display_capture_settings["height"],
          "monitor": display_capture_settings["monitor"], "x-pos": display_capture_settings["x"],
          "y-pos": display_capture_settings["y"]})

# Disconnect from OBS WebSocket
obs.disconnect()
