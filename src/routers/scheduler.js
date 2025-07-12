const router = require('express').Router()
const {createShedule} = require('../controllers/scheduler')

router.post('/createShedule', createShedule);

module.exports = router;