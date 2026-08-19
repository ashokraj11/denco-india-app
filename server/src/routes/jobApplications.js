const router = require('express').Router();
const { uploadResume } = require('../middleware/upload');
const { createApplication } = require('../controllers/jobApplicationsController');

router.post('/', uploadResume.single('resume'), createApplication);

module.exports = router;
