import threading
import cv2
import socket

camera = cv2.VideoCapture(0)  # Change to 1 if using an external camera
detector = cv2.QRCodeDetector()

def read_qr(readerClient):
    readData = ""
    while True:
        ret, frame = camera.read()
        
        # Check if the frame is valid
        if not ret:
            print("Failed to capture video")
            break
        
        cv2.imshow("Feed", frame)
        detected, decoded_info, coords, _ = detector.detectAndDecodeMulti(frame)
        
        if detected:
            for s, p in zip(decoded_info, coords):
                if s and readData != s:
                    readData = s
                    try:
                        readerClient.sendall(readData.encode())
                    except (BrokenPipeError, ConnectionResetError):
                        print("Client disconnected")
                        break

        if cv2.waitKey(1) == ord('q'):
            break

    camera.release()
    cv2.destroyAllWindows()

# Create server socket and bind to a specific port
server = socket.socket()
server.bind(('', 8080))  # Bind to all available interfaces (0.0.0.0 or '')
server.listen()

addr = server.getsockname()
print(f"Listening on {addr[0]}:{addr[1]}")

client, client_addr = server.accept()
print(f"Connected by {client_addr}")

# Start reading QR codes in a separate thread
threading.Thread(target=read_qr, args=(client,)).start()
