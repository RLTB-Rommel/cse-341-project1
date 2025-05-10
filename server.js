const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello from CSE 341 project deployed on Render!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});