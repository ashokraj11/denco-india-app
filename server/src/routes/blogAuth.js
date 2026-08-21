const router = require('express').Router();
const { login } = require('../controllers/blogAuthController');

router.post('/login', login);

module.exports = router;
