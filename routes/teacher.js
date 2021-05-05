const express = require('express');
const router = express.Router();
const teacher = require('../controllers/teacher');
const { checkTokenTeacher } = require('../middlewares/auth');

router.get('/ping', teacher.ping);
router.get('/list', checkTokenTeacher, teacher.teachers);
router.get('/', checkTokenTeacher, teacher.teacher);
router.post('/', teacher.signUp);
router.post('/login', teacher.login);
router.put('/', checkTokenTeacher, teacher.editTeacher);

module.exports = router;
