import os, threading
from flask import Flask, render_template, request, jsonify, send_from_directory

from sensors.Subscriber import Subscriber
from controller.Navigator import Navigator
from camera.web_streaming import Camera

app = Flask(__name__, static_folder="build", template_folder="build")

subscriber = Subscriber()
navigator =  Navigator(subscriber=subscriber)
camera = Camera()

t = threading.Thread(target=subscriber.main)
t.start()

@app.route("/api/navigate", methods=['POST'])
def navigate_post():
    global navigator

    request_data = request.json
    if "start" in request_data:
        navigator.setOrigin(request_data["start"])
    if "end" in request_data:
        navigator.setDestination(request_data["end"])
    
    return jsonify(request_data)

@app.route("/api/navigate/<mode>", methods=['GET'])
def navigate_get(mode):
    global navigator
    
    if mode == "start":
        t = threading.Thread(target=navigator.navigate)
        t.start()
        
    elif mode == "stop":
        navigator.stop()
    
    return jsonify({"status": 200})

@app.route("/api/current/<mode>", methods=['GET'])
def current(mode):
    global subscriber

    data = {}
    if mode == "location":
        data = {
            "coordinates": subscriber.data.get("gps", [121.543764, 25.019388])
        }
    elif mode == "bearing":
        data = {
            "bearing": subscriber.data.get("compass").get("azimuth", 0),
        }
    return jsonify(data)

@app.route("/api/records/<mode>", methods=['GET'])
def record_get(mode):
    global camera
    if mode == "start":
        camera.start_streaming()
    elif mode == "stop":
        camera.stop_streaming()
    return jsonify({"status": 200})

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "" and os.path.exists(app.static_folder + '/' + path):
        return send_from_directory(app.static_folder, path)
    else:
        return render_template('index.html')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=4000, threaded=True)
# app.run(host="127.0.0.1", port=3000)
