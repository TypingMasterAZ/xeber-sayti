const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('./')); // HTML faylını server üzərindən açmaq üçün

// Xəbərləri çəkən API
app.get('/api/news', async (req, res) => {
    try {
        const response = await axios.get('https://report.az/rss/');
        res.set('Content-Type', 'text/xml');
        res.send(response.data);
    } catch (error) {
        res.status(500).json({ error: "Xəbərlər yüklənə bilmədi" });
    }
});

app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda aktivdir.`);
});