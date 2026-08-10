const router = require('express').Router();
const { listOffices } = require('../controllers/officesController');

router.get('/', listOffices);

module.exports = router;
