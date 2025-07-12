const router = require('express').Router();

router.use('/users', require('./userRouters'));
router.use('/organizers', require('./orgUser'));
router.use('/events', require('./event'));
router.use('/sheduler', require('./scheduler'));

module.exports = router;