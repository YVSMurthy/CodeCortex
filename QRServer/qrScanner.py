import threading
import cv2
import json
import socket
# from playsound import playsound

camera = cv2.VideoCapture(1)
detector = cv2.QRCodeDetector()

def read_qr(readerClient):
    readData = ""
    while True:
        _, frame = camera.read()
        cv2.imshow("Feed", frame)
        detected, decoded_info, coords, _ = detector.detectAndDecodeMulti(frame)
        if detected:
            for s, p in zip(decoded_info, coords):
                if s and readData != s:
                    readData = s
                    readerClient.sendall(readData.encode())
                    # playsound('beep.mp3')

        if cv2.waitKey(1) == ord('q'):
            break

server = socket.socket()
ADDR = (socket.gethostbyname(socket.gethostname()), 8080)
server.bind(ADDR)
server.listen()
print(f"Listening on {ADDR}........")
client, addr = server.accept()
print("Reader Found")
threading.Thread(target=read_qr, args=(client, )).start()
newData = False
