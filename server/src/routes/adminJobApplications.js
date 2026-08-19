const router = require('express').Router();
const { requireAdmin } = require('../middleware/auth');
const {
  listApplications,
  updateApplicationStatus,
  deleteApplication,
  downloadResume
} = require('../controllers/jobApplicationsController');

router.get('/', requireAdmin, listApplications);
router.get('/:id/resume', requireAdmin, downloadResume);
router.put('/:id', requireAdmin, updateApplicationStatus);
router.delete('/:id', requireAdmin, deleteApplication);

module.exports = router;
