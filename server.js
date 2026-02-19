const express = require('express');
const axios = require('axios');
const cors = require('cors');
const cheerio = require('cheerio'); // HTML-i parçalamaq üçün bu lazımdır: npm install cheerio

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static('./'));

// 1. RSS siyahısını çəkən API
app.get('/api/news', async (req, res) => {
    try {
        const response = await axios.get('https://report.az/rss/');
        res.set('Content-Type', 'text/xml');
        res.send(response.data);
    } catch (error) {
        res.status(500).json({ error: "Xəbərlər yüklənə bilmədi" });
    }
});

// 2. Xüsusi bir xəbərin içindəki məlumatı çəkən API
app.get('/api/news-detail', async (req, res) => {
    const newsUrl = req.query.url; // URL-i parametr kimi alırıq
    if (!newsUrl) return res.status(400).send("URL tapılmadı");

    try {
        const response = await axios.get(newsUrl);
        const $ = cheerio.load(response.data);
        
        // Report.az saytında xəbər mətni adətən .news-text və ya oxşar class-da olur
        // Saytın strukturuna uyğun olaraq aşağıdakı selektoru tənzimləyirik
        const title = $('h1.page-title').text() || $('.news-title').text();
        const content = $('.news-content').html() || $('.article-body').html() || "Məzmun tapılmadı.";

        res.json({ title, content });
    } catch (error) {
        res.status(500).json({ error: "Xəbər mətni oxuna bilmədi" });
    }
});

app.listen(PORT, () => {
    console.log(`Server ${PORT} portunda aktivdir.`);
});
