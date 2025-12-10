import cv2
import mediapipe as mp
import math

mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(static_image_mode=False, max_num_faces=1)

cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Webcam failed to open")
    exit()

# Helper: Euclidean distance
def distance(p1, p2, w, h):
    x1, y1 = int(p1.x * w), int(p1.y * h)
    x2, y2 = int(p2.x * w), int(p2.y * h)
    return math.hypot(x2 - x1, y2 - y1)

while True:
    success, frame = cap.read()
    if not success:
        break

    frame = cv2.flip(frame, 1)
    rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    h, w, _ = frame.shape

    result = face_mesh.process(rgb)

    if result.multi_face_landmarks:
        for landmarks in result.multi_face_landmarks:
            # Landmarks
            top_lip = landmarks.landmark[13]
            bottom_lip = landmarks.landmark[14]
            left_mouth = landmarks.landmark[61]
            right_mouth = landmarks.landmark[291]
            left_eye = landmarks.landmark[33]
            right_eye = landmarks.landmark[263]
            left_eyebrow = landmarks.landmark[70]
            right_eyebrow = landmarks.landmark[300]
            left_mouth_corner = landmarks.landmark[78]
            right_mouth_corner = landmarks.landmark[308]

            # Distances
            eye_dist = distance(left_eye, right_eye, w, h)
            mouth_gap = distance(top_lip, bottom_lip, w, h)
            mouth_width = distance(left_mouth, right_mouth, w, h)
            eyebrow_dist = distance(left_eyebrow, right_eyebrow, w, h)
            mouth_corner_diff = abs(left_mouth_corner.y - right_mouth_corner.y) * h

            # Ratios
            gap_ratio = mouth_gap / eye_dist
            width_ratio = mouth_width / eye_dist
            eyebrow_ratio = eyebrow_dist / eye_dist

            # Expression logic
            if gap_ratio > 0.45 and width_ratio > 1.7:
                expression = "Happy 😊"
            elif mouth_corner_diff > 10 and gap_ratio < 0.2:
                expression = "Sad 😢"
            elif eyebrow_ratio < 0.28 and gap_ratio < 0.2:
                expression = "Angry 😠"
            elif mouth_corner_diff > 5 and gap_ratio > 0.2 and width_ratio < 1.5:
                expression = "Confused 😕"
            else:
                expression = "Neutral 😐"

            # Draw landmarks
            for lm in landmarks.landmark:
                x, y = int(lm.x * w), int(lm.y * h)
                cv2.circle(frame, (x, y), 1, (0, 255, 0), -1)

            # Show result
            cv2.putText(frame, f"Expression: {expression}", (30, 40),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
import requests

def send_expression_to_server(expression):
    try:
        res = requests.post(
            "http://localhost:5000/api/expression",  # replace with your Express port
            json={"expression": expression}
        )
        if res.status_code != 201:
            print("❌ Failed to send expression:", res.text)
    except Exception as e:
        print("❌ Error sending expression:", e)

    cv2.imshow("Expression Detector", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
cv2.putText(frame, f"Expression: {expression}", (30, 40),
            cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

cap.release()
cv2.destroyAllWindows()
