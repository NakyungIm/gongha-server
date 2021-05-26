const express = require('express');
const router = express.Router();
const teacher = require('../controllers/teacher');
const { checkTokenTeacher } = require('../middlewares/auth');

router.get('/ping', teacher.ping);
router.post('/', teacher.createTeacher);
router.post('/login', teacher.loginTeacher);
router.get('/list', checkTokenTeacher, teacher.teachers);
router.get('/', checkTokenTeacher, teacher.getTeacherInfo);
router.put('/', checkTokenTeacher, teacher.editTeacherInfo);
router.get('/', checkTokenTeacher, teacher.searchStudent)

module.exports = router;
