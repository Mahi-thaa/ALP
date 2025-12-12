🌟 ALP — Adaptive Learning Path
Emotion-Aware, Therapist-Guided Personalized Learning for Children with Learning Difficulties
Adaptive Learning Path (ALP) is an intelligent educational platform that creates personalized learning experiences for children with learning difficulties. Traditional teaching methods often fail to address the emotional and behavioral differences of each learner — ALP solves this by combining AI-powered emotion detection, gameplay behavior analysis, and therapist-approved learning paths.
Using transformer-based deep learning models, ALP detects a child’s emotional state through facial expressions and adapts the learning path in real time. The result: improved engagement, reduced frustration, and a more supportive, individualized learning environment.
💡 The system adapts — but never overrides the therapist’s recommended path, ensuring safety and professional guidance at all times.
🚀 Features
🧠 Real-Time Emotion Detection
Transformer-based face analysis identifies emotions like confused, happy, stressed, engaged, etc.
🎮 Gameplay Behavior Insights
Monitors hesitation, repeated errors, pacing, and engagement levels.
🔄 Adaptive Learning Engine
Dynamically adjusts difficulty, content flow, or hint frequency while respecting therapist-defined boundaries.
👩‍⚕️ Therapist-Aligned Learning
Every adaptation is validated against a therapist’s recommended learning structure.
📊 Progress Reports & Transparency
Logs emotion patterns, difficulty transitions, performance, and engagement metrics.
🧩 Modular AI Pipeline
Emotion Model
Behavior Analysis
Adaptation Engine
Therapist Rule Layer
Session Reporting
🛠️ Installation
git clone https://github.com/your-username/alp.git
cd alp
pip install -r requirements.txt
📦 Requirements
Listed in requirements.txt:
transformers
opencv-python
numpy, pandas
Flask or FastAPI
face-api.js (if using web emotion detection)
react (frontend)
⚙️ Configuration
Set model paths or API keys:
export EMOTION_MODEL="./models/emotion_model"
export THERAPIST_PATH="./config/recommended_path.json"
▶️ Run the Application
Backend:
python app.py
Frontend (React):
npm install
npm start
Backend URL → http://127.0.0.1:5000/
Frontend URL → http://localhost:3000/
🧭 System Workflow
Capture facial expression frames
Detect emotions using transformer models
Track gameplay behaviors
Compute engagement & difficulty metrics
Suggest adaptive changes
Ensure compliance with therapist rules
Update session logs + show progress reports
🧪 API Usage Examples
🔍 Emotion Detection
from alp_emotion import detect_emotion
print(detect_emotion("frame.jpg"))
🎯 Get Next Learning Step
from alp_engine import get_adaptive_next_step

state = {"emotion": "frustrated", "errors": 2, "level": 1}
print(get_adaptive_next_step(state))
📑 Generate Session Report
from alp_reports import generate_session_report
print(generate_session_report("SESSION_01"))
📈 Evaluation Metrics
Emotion Detection Accuracy
Adaptation Effectiveness
Engagement Score
Therapist Rule Compliance
Before/After Sample Comparison
📂 Project Structure
├── app.py                        # Backend API server
├── alp_engine.py                 # Adaptive learning logic
├── alp_emotion.py                # Emotion recognition module
├── alp_behavior.py               # Behavior/engagement analysis
├── alp_reports.py                # Reporting system
├── models/                       # Trained emotion/behavior models
├── config/
│   └── recommended_path.json     # Therapist-approved paths
├── frontend/                     # React user interface
├── requirements.txt
└── README.md
🌈 Why ALP Matters
Supports children who learn differently
Respects human expertise while using AI responsibly
Encourages emotional wellbeing alongside academic growth
Makes learning more adaptive, intuitive, and joyful
