const router = require('express').Router();
const { listStats } = require('../controllers/statsController');

router.get('/', listStats);

module.exports = router;
