from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import mediapipe as mp
import math
import base64
import numpy as np
from PIL import Image
import io

app = Flask(__name__)
CORS(app)

# Initialize MediaPipe Face Mesh
mp_face_mesh = mp.solutions.face_mesh
face_mesh = mp_face_mesh.FaceMesh(static_image_mode=True, max_num_faces=1)

def distance(p1, p2, w, h):
    """Calculate Euclidean distance between two points"""
    x1, y1 = int(p1.x * w), int(p1.y * h)
    x2, y2 = int(p2.x * w), int(p2.y * h)
    return math.hypot(x2 - x1, y2 - y1)

def detect_expression(image_data):
    """Detect facial expression from image data"""
    try:
        # Decode base64 image
        image_data = image_data.split(',')[1] if ',' in image_data else image_data
        image_bytes = base64.b64decode(image_data)
        image = Image.open(io.BytesIO(image_bytes))
        
        # Convert to OpenCV format
        frame = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        h, w, _ = frame.shape
        
        # Process with MediaPipe
        result = face_mesh.process(rgb)
        
        if result.multi_face_landmarks:
            landmarks = result.multi_face_landmarks[0]
            
            # Get key facial landmarks
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
            
            # Calculate distances
            eye_dist = distance(left_eye, right_eye, w, h)
            mouth_gap = distance(top_lip, bottom_lip, w, h)
            mouth_width = distance(left_mouth, right_mouth, w, h)
            eyebrow_dist = distance(left_eyebrow, right_eyebrow, w, h)
            mouth_corner_diff = abs(left_mouth_corner.y - right_mouth_corner.y) * h
            
            # Calculate ratios
            gap_ratio = mouth_gap / eye_dist if eye_dist > 0 else 0
            width_ratio = mouth_width / eye_dist if eye_dist > 0 else 0
            eyebrow_ratio = eyebrow_dist / eye_dist if eye_dist > 0 else 0
            
            # Debug output
            print(f"gap_ratio: {gap_ratio:.2f}, width_ratio: {width_ratio:.2f}, eyebrow_ratio: {eyebrow_ratio:.2f}, mouth_corner_diff: {mouth_corner_diff:.2f}")

            # Super sensitive logic for testing
            if gap_ratio > 0.01 and width_ratio > 0.5:
                expression = "Happy"
            elif mouth_corner_diff > 0.5 and gap_ratio < 0.05:
                expression = "Sad"
            elif eyebrow_ratio < 1.1 and gap_ratio < 0.05:
                expression = "Angry"
            elif mouth_corner_diff > 0.3 and gap_ratio > 0.05 and width_ratio < 0.7:
                expression = "Confused"
            else:
                expression = "Neutral"
            print(f"Selected expression: {expression}")
            return {"prediction": expression, "confidence": 0.85}
        else:
            return {"prediction": "No face detected", "confidence": 0.0}
            
    except Exception as e:
        return {"prediction": "Error", "confidence": 0.0, "error": str(e)}

@app.route('/predict', methods=['POST'])
def predict():
    """API endpoint for emotion prediction"""
    try:
        data = request.get_json()
        if not data or 'image' not in data:
            return jsonify({"error": "No image data provided"}), 400
            
        result = detect_expression(data['image'])
        return jsonify(result)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "model": "MediaPipe Face Expression Detector"})

if __name__ == '__main__':
    print("🚀 Starting MediaPipe Face Expression API...")
    print("📡 API will be available at http://localhost:8000")
    app.run(host='0.0.0.0', port=8000, debug=True) 