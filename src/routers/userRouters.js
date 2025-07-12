const router = require('express').Router();
const { CreateUser, loginUser, getUsers, exportUserExcel } = require('../controllers/user');

router.get('/getUsers/:_id', getUsers);
router.get('/exportUserExcel', exportUserExcel);
router.post('/createUser', CreateUser);
router.post('/login', loginUser);

module.exports = router;