const router = require('express').Router();
const { listServices } = require('../controllers/servicesController');

router.get('/', listServices);

module.exports = router;
