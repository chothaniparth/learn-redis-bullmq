const router = require('express').Router();
const {OrganizerLogin, OrganizerSignUp, getOrganizerUser} = require('../controllers/organizer');

router.post('/signup', OrganizerSignUp);
router.post('/login', OrganizerLogin);
router.get('/orgUsers/:_id', getOrganizerUser);

module.exports = router;