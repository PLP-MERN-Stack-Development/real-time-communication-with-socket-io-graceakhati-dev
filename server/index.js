const express = require('express');

const app = express();

// GET "/" route
app.get('/', (req, res) => {
  res.send('Server running');
});

// Start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log('Server listening on port 5000');
});

// Export app for testing
module.exports = app;

