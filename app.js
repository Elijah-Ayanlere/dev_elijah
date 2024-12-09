const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware to parse JSON data
app.use(express.json());

// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Path for the shares.json file
const sharesFilePath = path.join(__dirname, 'shares.json');

// Helper function to ensure JSON files are valid and create default content
const ensureFile = (filePath, defaultContent) => {
  if (!fs.existsSync(filePath) || fs.readFileSync(filePath, 'utf8').trim() === '') {
    fs.writeFileSync(filePath, JSON.stringify(defaultContent));
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

// Helper functions for likes, views, and shares files
const readLikesFile = () => ensureFile('likes.json', {});
const writeLikesFile = (data) => fs.writeFileSync('likes.json', JSON.stringify(data, null, 2));

const readViewsFile = () => ensureFile('views.json', {});
const writeViewsFile = (data) => fs.writeFileSync('views.json', JSON.stringify(data, null, 2));

const readSharesFile = () => ensureFile(sharesFilePath, {});
const writeSharesFile = (data) => fs.writeFileSync(sharesFilePath, JSON.stringify(data, null, 2));

// Endpoint to get the like count for a specific blog
app.get('/api/likes/:blogId', (req, res) => {
  try {
    const likes = readLikesFile();
    const blogId = req.params.blogId;
    res.json({ likes: likes[blogId] || 0 });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error reading like count');
  }
});

// Endpoint to increment the like count for a specific blog
app.post('/api/likes/:blogId', (req, res) => {
  try {
    const likes = readLikesFile();
    const blogId = req.params.blogId;
    likes[blogId] = (likes[blogId] || 0) + 1; // Increment the like count for the blog
    writeLikesFile(likes);
    res.json({ likes: likes[blogId] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating like count');
  }
});

// Endpoint to decrement the like count for a specific blog
app.post('/api/unlike/:blogId', (req, res) => {
  try {
    const likes = readLikesFile();
    const blogId = req.params.blogId;
    likes[blogId] = Math.max(0, (likes[blogId] || 0) - 1); // Ensure it doesn't go below 0
    writeLikesFile(likes);
    res.json({ likes: likes[blogId] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating like count');
  }
});

// Endpoint to get the view count for a specific blog
app.get('/api/views/:blogId', (req, res) => {
  try {
    const views = readViewsFile();
    const blogId = req.params.blogId;
    res.json({ views: views[blogId] || 0 });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error reading view count');
  }
});

// Endpoint to increment the view count for a specific blog
app.post('/api/views/:blogId', (req, res) => {
  try {
    const views = readViewsFile();
    const blogId = req.params.blogId;
    views[blogId] = (views[blogId] || 0) + 1; // Increment the view count for the blog
    writeViewsFile(views);
    res.json({ views: views[blogId] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating view count');
  }
});

// API to get share count for a specific blog
app.get('/api/shares/:blogId', (req, res) => {
  try {
    const shares = readSharesFile();
    const blogId = req.params.blogId;
    res.json({ shares: shares[blogId] || 0 });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error reading share count');
  }
});

// API to increment share count for a specific blog
app.post('/api/shares/:blogId', (req, res) => {
  try {
    const shares = readSharesFile();
    const blogId = req.params.blogId;
    shares[blogId] = (shares[blogId] || 0) + 1; // Increment the share count for the blog
    writeSharesFile(shares);
    res.json({ shares: shares[blogId] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error updating share count');
  }
});

// Catch-all route to serve index.html for unknown routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
