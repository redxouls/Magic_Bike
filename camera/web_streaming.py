import cv2
import argparse
import multiprocessing as mp
from datetime import datetime

def gstreamer_rtmpstream(queue):
    now = datetime.now()
    filename = now.strftime("%d-%m-%Y_%H-%M-%S") + ".flv"
      
    # pipeline = (
    #     "appsrc ! "
    #         "video/x-raw, format=(string)BGR ! "
    #     "queue ! "
    #         "videoconvert ! "
    #             "video/x-raw, format=RGBA ! "
    #         "nvvidconv ! "
    #         "nvv4l2h264enc ! "
    #         "h264parse ! "
    #         "flvmux ! "
    #         'rtmpsink location="rtmp://localhost/rtmp/live live=1"'
    #     )
    file_pipeline = (
        "appsrc ! "
            "video/x-raw, format=(string)BGR ! "
        "queue ! "
            "videoconvert ! "
                "video/x-raw, stream-format=avc ! "
            "nvvidconv ! "
            "nvv4l2h264enc ! "
            "h264parse ! "
            "flvmux streamable=true ! "
            "filesink location=%s" % filename
        )
    
    # pipeline_writer = cv2.VideoWriter(pipeline, cv2.CAP_GSTREAMER, 0, 30.0, (1920, 1080))
    # pipeline_writer = cv2.VideoWriter(pipeline, cv2.CAP_GSTREAMER, 0, 30.0, (1920, 1080))
    file_writer = cv2.VideoWriter(file_pipeline, cv2.CAP_GSTREAMER, 0, 30.0, (1920, 1080))

    while True:
        frame = queue.get()
        if frame is None:
            break
        # pipeline_writer.write(frame)
        file_writer.write(frame)
        print("[RTMP] WRITE")

def gstreamer_camera(queue):
    pipeline = (
        "nvarguscamerasrc ! "
            "video/x-raw(memory:NVMM), "
            "width=(int)1920, height=(int)1080, "
            "format=(string)NV12, framerate=(fraction)30/1 ! "
        "queue ! "
            "nvvidconv flip-method=2 ! "
                "video/x-raw, "
                "width=(int)1920, height=(int)1080, "
                "format=(string)BGRx, framerate=(fraction)30/1 ! "
            "videoconvert ! "
                "video/x-raw, format=(string)BGR ! "
            "appsink"
        )
    cap = cv2.VideoCapture(pipeline, cv2.CAP_GSTREAMER)
    while True:
        ret, frame = cap.read()
        if not ret:
            break
        queue.put(frame)
        print("[CAM] READ")

class Camera:
    def __init__(self):
        self.gstreamer_camera = gstreamer_camera
        self.gstreamer_rtmpstream = gstreamer_rtmpstream
        self.queue = mp.Queue(maxsize=1)
        self.reader = mp.Process(target=gstreamer_camera, args=(self.queue,))
        self.writer = mp.Process(target=gstreamer_rtmpstream, args=(self.queue,))

    def start_streaming(self):
        self.reader.start()
        self.writer.start()
        self.reader.join()
        self.writer.join()

    def stop_streaming(self):
        self.reader.terminate()
        self.writer.terminate()

if __name__ == "__main__":
    queue = mp.Queue(maxsize=1)
    reader = mp.Process(target=gstreamer_camera, args=(queue,))
    reader.start()
    writer = mp.Process(target=gstreamer_rtmpstream, args=(queue,))
    writer.start()

    try:
        reader.join()
        writer.join()
    except KeyboardInterrupt as e:
        reader.terminate()
        writer.terminate()