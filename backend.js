const express = require('express');
const app = express();
const axios = require('axios');
const { YoutubeTranscript } = require('youtube-transcript')
const cors = require('cors');
const router = express.Router();
app.use(express.json())





app.use(cors());
// Define a route to handle transcript retrieval
// Define a route to handle transcript retrieval
app.get('/transcript', (req, res) => {
    try {
        // Extract the video URL from the query parameters
        console.log("backend started")
        const videoUrl = req.query.video_url; // Corrected to 'video_url'
        console.log(videoUrl);

        // Fetch the transcript using youtube-transcript-api
        const transcript = YoutubeTranscript.fetchTranscript(videoUrl)
            .then(transcriptData => {
                res.json(transcriptData);
            })
            .catch(error => {
                console.error('Error fetching transcript data:', error);
                res.status(500).json({ error: 'Failed to fetch transcript data' });
            });
    } catch (error) {
        console.error('Error fetching transcript data:', error);
        res.status(500).json({ error: 'Failed to fetch transcript data' });
    }
});


// Start the server
const PORT = process.env.PORT || 5000; // Use port 5000 by default
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
