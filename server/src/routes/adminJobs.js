const router = require('express').Router();
const { requireAdmin } = require('../middleware/auth');
const { listAllJobs, createJob, updateJob, removeJob } = require('../controllers/jobsController');

router.get('/', requireAdmin, listAllJobs);
router.post('/', requireAdmin, createJob);
router.put('/:id', requireAdmin, updateJob);
router.delete('/:id', requireAdmin, removeJob);

module.exports = router;
