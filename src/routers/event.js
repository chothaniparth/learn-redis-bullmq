const router = require('express').Router();
const auth = require('../middlewares/auth');
const {getEvents, createEvent, updateEvent, deleteEvent} = require('../controllers/event');

router.get('/getEvents', auth, getEvents);
router.post('/createEvents', auth, createEvent);
router.put('/updateEvents', auth, updateEvent);
router.delete('/deleteEvents', auth, deleteEvent);

module.exports = router;