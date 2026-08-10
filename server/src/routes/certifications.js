const router = require('express').Router();
const { listCertifications } = require('../controllers/certificationsController');

router.get('/', listCertifications);

module.exports = router;
