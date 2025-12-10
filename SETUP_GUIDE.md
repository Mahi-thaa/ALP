# 🎭 MediaPipe Face Expression Detection Setup

## Overview
This system uses MediaPipe for real-time face expression detection, replacing the previous transformer model with a faster, lighter solution.

## 🚀 Quick Start

### Option 1: Use the batch script (Windows)
```bash
start_servers.bat
```

### Option 2: Manual startup

1. **Install Python dependencies:**
   ```bash
   cd middleware
   pip install -r requirements.txt
   ```

2. **Start MediaPipe API:**
   ```bash
   cd middleware
   python face_expression_api.py
   ```

3. **Start Express middleware (in new terminal):**
   ```bash
   cd middleware
   npm start
   ```

4. **Start React app (in new terminal):**
   ```bash
   cd adaptix
   npm start
   ```

## 📡 API Endpoints

### MediaPipe API (Port 8000)
- `POST /predict` - Face expression detection
- `GET /health` - Health check

### Express Middleware (Port 5000)
- `POST /api/predict` - Proxy to MediaPipe API
- `POST /api/expression` - Save expressions to database
- Other existing endpoints

## 🎯 Features

- **Real-time detection** - Processes video frames every 2 seconds
- **Multiple emotions** - Happy, Sad, Angry, Confused, Neutral
- **Face landmark analysis** - Uses MediaPipe Face Mesh
- **Lightweight** - No heavy ML models required
- **Fast response** - Sub-second processing time

## 🔧 Technical Details

### MediaPipe Face Mesh Landmarks Used:
- Eyes (33, 263)
- Eyebrows (70, 300)
- Mouth corners (78, 308)
- Lips (13, 14, 61, 291)

### Expression Logic:
- **Happy**: Wide mouth, high gap ratio
- **Sad**: Drooping mouth corners, low gap
- **Angry**: Lowered eyebrows, tight mouth
- **Confused**: Asymmetric mouth, medium gap
- **Neutral**: Default state

## 🐛 Troubleshooting

1. **"MediaPipe API is not running"**
   - Ensure `python face_expression_api.py` is running on port 8000

2. **"No face detected"**
   - Check camera permissions
   - Ensure face is clearly visible
   - Good lighting helps

3. **Slow performance**
   - Reduce capture frequency in FaceEmotionDetector.jsx
   - Lower image quality (JPEG compression)

## 📁 File Structure
```
middleware/
├── face_expression_api.py    # MediaPipe Flask API
├── face_expression_detector.py  # Original standalone detector
├── requirements.txt          # Python dependencies
├── routes/predict.js         # Express proxy route
└── server.js                 # Express server
``` 