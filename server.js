const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

// Enable CORS
app.use(cors());

// Serve static files from the frontend/public directory
app.use(express.static(path.join(__dirname, 'frontend/public')));

// Serve images from the images directory
app.use('/images', express.static(path.join(__dirname, 'frontend/public/images')));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 