const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic test route
app.get('/test', (req, res) => {
    res.json({ message: 'Clean server is working!' });
});

// Start server
// const API_BASE = import.meta.env.VITE_API_BASE;
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`Clean server running on port ${PORT}`);
});
