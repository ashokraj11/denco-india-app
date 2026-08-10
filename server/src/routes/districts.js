const router = require('express').Router();
const { listDistricts } = require('../controllers/districtsController');

router.get('/', listDistricts);

module.exports = router;
