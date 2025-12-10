@echo off
echo 🚀 Starting AdaptixALP Servers...
echo.

echo 📡 Starting MediaPipe Face Expression API...
start "MediaPipe API" cmd /k "cd middleware && python face_expression_api.py"

echo ⏳ Waiting 3 seconds for MediaPipe API to start...
timeout /t 3 /nobreak > nul

echo 🔄 Starting Express Middleware Server...
start "Express Server" cmd /k "cd middleware && npm start"

echo ✅ Both servers are starting...
echo.
echo 📍 MediaPipe API: http://localhost:8000
echo 📍 Express Server: http://localhost:5000
echo 📍 React App: http://localhost:3000
echo.
echo Press any key to close this window...
pause > nul 