const router = require('express').Router();
const authController = require('../controllers/authentication');
const { authenticateToken } = require('../middleware/authenticate');

router.post('/Login',authController.login)
router.post('/RefreshToken/:refreshToken',authController.refreshToken)
router.put('/InitialChangePassword',authenticateToken,authController.initialChangePassword)

module.exports = router;