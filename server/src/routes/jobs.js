const router = require('express').Router();
const { listJobs } = require('../controllers/jobsController');

router.get('/', listJobs);

module.exports = router;
