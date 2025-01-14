const express = require('express');
const multer = require('multer'); // For handling file uploads
const path = require('path');
const fs = require('fs');
const router = express.Router();
const letters = require('../data/letters.json');

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadDir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  }),
});

// Fetch all letters
router.get('/', (req, res) => {
  res.json(letters.map(({ id, title, summary }) => ({ id, title, summary })));
});

// Fetch a single letter by ID
router.get('/:id', (req, res) => {
  const letter = letters.find((l) => l.id === parseInt(req.params.id));
  if (letter) {
    res.json(letter);
  } else {
    res.status(404).json({ error: 'Letter not found' });
  }
});

// Sign a letter
router.post('/:id/sign', upload.single('file'), (req, res) => {
  const letter = letters.find((l) => l.id === parseInt(req.params.id));
  if (!letter) {
    return res.status(404).json({ error: 'Letter not found' });
  }

  const { name, email, affiliation, note, socialLinks } = req.body;

  // Save the signature data
  const newSignature = {
    name,
    email,
    affiliation,
    note,
    socialLinks,
    filePath: req.file ? `/uploads/${req.file.filename}` : null,
    timestamp: new Date().toISOString(),
    verified: 0,
  };

  letter.signatures = letter.signatures || [];
  letter.signatures.push(newSignature);

  // Optionally, save the updated letters data to a JSON file
  fs.writeFileSync(
    path.join(__dirname, '../data/letters.json'),
    JSON.stringify(letters, null, 2)
  );

  res.json(letter); // Return the updated letter
});

module.exports = router;
