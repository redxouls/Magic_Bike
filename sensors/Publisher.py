import argparse, threading, time
import json

import paho.mqtt.client as mqtt

from .GPS import gps_read, gps_close
from .Compass import compass_read, compass_close, get_stm_serial


class Publisher():
    def __init__(self, args=None):
        if args:
            self.port = args["port"]
            self.ip = args["ip"]
            self.topics = args["topic"]
        else:
            self.port = 1883
            self.ip = "localhost"
            self.topics = ['gps', 'compass']
        
        self.client = mqtt.Client()
        

    def publish(self, topic, data):
        payload = json.dumps(data).encode()
        self.client.publish(topic=topic, payload=payload)

    def gps_sensor(self):
        data = []
        while True:
            data = gps_read()
            if len(data) == 0:
                continue
            elif data[0] == 0:
                continue
            self.publish("gps", data)
            
    def compass_sensor(self):
        data = {}
        while True:
            data = compass_read()
            if len(data) == 0:
                continue
            self.publish("compass", data)
            time.sleep(0.05)
    @staticmethod
    def get_stm_serial():
        return get_stm_serial()
    
    def main(self):
        # Establish connection to mqtt broker
        self.client.connect(host=self.ip, port=self.port)
        self.client.loop_start()
        
        # Intervally send topic message
        try:
            if 'gps' in self.topics:
                t1 = threading.Thread(target=self.gps_sensor)
                t1.start()
            if 'compass' in self.topics:
                t2 = threading.Thread(target=self.compass_sensor)
                t2.start()
        
        except KeyboardInterrupt as e:
            gps_close()
            compass_close()
            self.client.loop_stop()



if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--ip",
                        default="localhost",
                        help="service ip of MQTT broker")
    parser.add_argument("--port",
                        default=1883,
                        type=int,
                        help="service port of MQTT broker")
    parser.add_argument("--topic",
                        default="gps",
                        choices=['gps', 'compass'],
                        nargs="+",
                        help="Availabel information to publish")
    args = vars(parser.parse_args())
    publisher = Publisher(args)
    publisher.main()
