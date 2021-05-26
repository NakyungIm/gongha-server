const express = require('express');
const router = express.Router();
const teacher = require('../controllers/teacher');
const { checkToken } = require('../middlewares/auth');

router.get('/ping', teacher.ping);
router.post('/', teacher.createTeacher);
router.post('/login', teacher.loginTeacher);
router.get('/list', checkToken, teacher.teachers);
router.get('/', checkToken, teacher.getTeacherInfo);
router.put('/', checkToken, teacher.editTeacherInfo);

module.exports = router;
