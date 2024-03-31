from webapp import app
from flask_cors import CORS
CORS(app, resources={r"/login": {"origins": "http://localhost:5173"}})
if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
    