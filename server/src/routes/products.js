const router = require('express').Router();
const { listProducts } = require('../controllers/productsController');

router.get('/', listProducts);

module.exports = router;
