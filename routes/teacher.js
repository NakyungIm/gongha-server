const express = require('express');
const router = express.Router();
const teacher = require('../controllers/teacher');
const { checkToken } = require('../middlewares/auth');

router.get('/ping', teacher.ping);
router.get('/', checkToken, teacher.teachers);
router.get('/:no', checkToken, teacher.teacher);
router.post('/signup', teacher.signUp);
router.post('/login', teacher.login);
router.put('/', checkToken, teacher.editTeacher);

module.exports = router;
