const express = require('express');
const cors = require('cors');
const lettersRoutes = require('./routes/letters');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use('/api/letters', lettersRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
