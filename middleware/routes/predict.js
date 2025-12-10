const express = require('express');
const router = express.Router();
const axios = require('axios');

// POST /api/predict - connects to MediaPipe Face Expression API
router.post('/', async (req, res) => {
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    // Send request to MediaPipe API
    const response = await axios.post('http://127.0.0.1:8000/predict', { 
      image: image 
    }, {
      timeout: 10000 // 10 second timeout
    });

    res.json(response.data);
  } catch (err) {
    console.error('Prediction error:', err.message);
    
    if (err.code === 'ECONNREFUSED') {
      res.status(503).json({ 
        error: 'MediaPipe API is not running', 
        details: 'Please start the face_expression_api.py server' 
      });
    } else if (err.response) {
      res.status(err.response.status).json(err.response.data);
    } else {
      res.status(500).json({ 
        error: 'Prediction failed', 
        details: err.message 
      });
    }
  }
});

module.exports = router; 