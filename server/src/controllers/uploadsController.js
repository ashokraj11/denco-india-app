function uploadImage(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file provided (field name must be "image")' });
  }
  res.status(201).json({ url: `/uploads/${req.file.filename}` });
}

module.exports = { uploadImage };
