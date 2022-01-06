const express = require('express');
const userController = require('../controllers/user');  

const router = express.Router();

router.post('/createUser', userController.createUser);
router.get('/getAllUser', userController.getAllUser);
router.get('/getUser/:userId',userController.getUser);
router.patch('/updateUser/:userId',userController.updateUserById);
router.delete('/deleteUser/:userId', userController.deleteUser);

module.exports = router;
